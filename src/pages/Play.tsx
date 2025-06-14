import { RefObject, useEffect, useRef, useState } from "react";
import "../styles/gameplay.css"

import { generateEquation } from "../logic/gameplay/generators";
import { Equation } from "../logic/gameplay/equation";
import { solve } from "../logic/gameplay/solver";
import { MgDifficulty } from "../types/MgDifficulty";
import McButton from "../components/McButton";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../services/firebase";
import { getDatabase, onValue, ref } from "firebase/database";
import { useNavigate, useParams } from "react-router-dom";
import { saveHighScore } from "../services/highscore";

// CONSTANTS                      _
const IMG_RATIO = 16.0/9.0;  // 1.7  <-- infinite 7s lol
const IMG_POS_X = 0.575;      // X Position of the plate on the door, values from 0 to 1 beginning from left
const IMG_POS_Y = 0.275;      // Y Position of the plate on the door, values from 0 to 1 beginning from top
const TARGET_X_SIZE = 1280;
const TARGET_Y_SIZE = 720;
const BASE_FONT_SIZE = 30;        // text size in PX for the ideal background size (1280x720)
const BASE_X_SIZE = 352;
const BASE_Y_SIZE = 85;
const BASE_X_PADDING = 10;
const BASE_Y_PADDING = 10;

const MAX_ROOMS_IN_DUNGEON = 20;

function Play() {
    const [user, setUser] = useState<User | null>(null);

    const background: RefObject<null | HTMLDivElement> = useRef(null);
    const navigate = useNavigate();
    const [equation, setEquation] = useState<Equation>(new Equation("", ""));
    const [userInput, setUserInput] = useState("");
 
    const [points, setPoints] = useState(0);
    const [combo, setCombo] = useState(1); // points get multiplied by this

    // Game state
    const [room, setRoom] = useState(1);
    const [lives, setLives] = useState(3);

    // Dungeon data
    const { dungeonId } = useParams();
    const [dungeonName, setDungeonName] = useState(dungeonId);
    const [dungeonBackground, setDungeonBackground] = useState("");
    const [dungeonDifficulties, setDungeonDifficulties] = useState<MgDifficulty[]>([]);
    const [dungeonPointsPerAnswer, setDungeonPointsPerAnswer] = useState(0);

    // Get Dungeon Data
    useEffect(() => {
        const db = getDatabase();
        const reference = ref(db, `dungeons/${dungeonId}`);
        const unsubscribeFn = onValue(reference, (snapshot) => {
            if (snapshot.exists()) {
                const dungeon = snapshot.val();
                setDungeonName(dungeon.name);
                setDungeonBackground(dungeon.background);
                setDungeonPointsPerAnswer(dungeon["points-per-answer"]);
                
                let difficulties: MgDifficulty[] = dungeon.difficulties.map((value: string) => {
                    // console.log(value);
                    switch (value) {
                        case "EASY":
                            return MgDifficulty.EASY;
                    
                        case "MID":
                            return MgDifficulty.MID;
                        
                        case "HARD":
                            return MgDifficulty.HARD;

                        default:
                            return MgDifficulty.MID;
                    }
                });
                if (difficulties.length == 0) {
                    difficulties = [MgDifficulty.MID];
                }
                setDungeonDifficulties(difficulties);

                generateEquation(difficulties[Math.floor(Math.random() * difficulties.length)])
                    .then((newEq)=>{
                        // console.log(newEq, newEq.isEmpty());
                        if (!newEq.isEmpty()) setEquation(newEq);
                    })
                ;
            }
        })

        return ()=>{
            unsubscribeFn();
        }
    }, [])

    function getDungeonDifficulty() {
        return dungeonDifficulties[Math.floor(Math.random() * dungeonDifficulties.length)];
    }

    // Auth
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                const db = getDatabase();
                const usernameRef = ref(db, `users/${firebaseUser.uid}`);
                onValue(usernameRef, (snapshot) => {
                    const my = snapshot.val();

                    // Get account status
                    let status = "";
                    if (my.status) {
                        if (my.status?.includes("deleted")) {
                            status = "deleted";
                        } else if (my.status?.includes("banned")) {
                            status = "banned";
                        }
                    }
                    // Handle statuses
                    switch (status) {
                        case "deleted":
                            signOut(auth);
                            return;
                    
                        case "banned":
                            console.warn("GTFO of here loser!");
                            navigate("/");
                            return;
    
                        default:
                            break;
                    }
                });
                console.log("logged in");
            } else {
                console.log("oopsy");
                navigate("/");
            }
        });
        return () => unsubscribe();
    }, []);
    

    // Resize event listener
    useEffect(()=>{
        calculateEquationTransform(background);
        const evListener = ()=>calculateEquationTransform(background);
        window.addEventListener("resize", evListener);
        // console.log("loaded resize fix listener");

        return () => {
            window.removeEventListener("resize", evListener);
            // console.log("unloaded resize fix listener");
        }
    }, []);

    useEffect(()=>{
        // If we fucking died, store score in DB
        // (only saved if current > stored)
        if (lives < 0 && user && dungeonId) {
            saveHighScore(user, dungeonId, points)
                .then(()=>{
                    console.log("saved");
                });
        }
        // If we solved everything, store score in DB
        // (only saved if current > stored)
        if (room > MAX_ROOMS_IN_DUNGEON && user && dungeonId) {
            saveHighScore(user, dungeonId, points)
                .then(()=>{
                    console.log("saved");
                });
        }
    });

    async function validateRes() {
        if (userInput.length == 0) {
            return;
        }

        const res = solve(equation.getRaw());
        if (res == userInput) {
            setUserInput("");
            setRoom(room + 1);
            setPoints(points + dungeonPointsPerAnswer * combo);
            setCombo(combo + 1);
            const newEq = await generateEquation(getDungeonDifficulty());
            if (!newEq.isEmpty()) setEquation(newEq);
        } else {
            setLives(lives - 1);
            setCombo(1);
        }
    }

    // Game end screen component
    const GameEndScreen = ({ type, score }: { type: 'victory' | 'defeat', score: number }) => {
        const navigate = useNavigate();
        const title = type === 'victory' ? 'VICTORY!' : 'DEFEAT!';
        
        return (
            <div className="game-end-screen">
                <div className="game-end-content">
                    <div className="game-end-image-container">
                        <img 
                            src="/assets/sprites/winScreen.png"
                            alt={title}
                            className="game-end-image"
                        />
                    </div>
                    <h2 className="game-end-title">{title}</h2>
                    <p className="game-end-score">Score: {score}</p>
                    <McButton 
                        onClick={() => navigate('/')}
                        className="continue-button"
                    >
                        Continue
                    </McButton>
                </div>
            </div>
        );
    };

    // Check for game end conditions
    if (room > MAX_ROOMS_IN_DUNGEON) {
        return <GameEndScreen type="victory" score={points} />;
    }

    if (lives < 0) {
        return <GameEndScreen type="defeat" score={points} />;
    }

    return (
        <div className="mg-gameplay" style={{backgroundImage: `url(${dungeonBackground})`}} ref={background}>
            {/* Equation in Background */}
            <div className="mg-gameplay-equation-door">
                <p>{equation.getLatex()}</p>
            </div>
            {/* Gameplay */}
            <div className="mg-gameplay-flex">
                <div className="mg-gameplay-panel">
                    <h1>{dungeonName}</h1>
                    <p>Room: {room}/{MAX_ROOMS_IN_DUNGEON}</p>
                    <div className="lives-container">
                        <p>Lives:</p>
                        <div className="hearts-container">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <img 
                                    key={index}
                                    src="/assets/sprites/lives.png" 
                                    alt="Life" 
                                    className={`life ${index < lives ? 'active' : 'inactive'}`}
                                />
                            ))}
                        </div>
                    </div>
                    <p>Score: {points}</p>
                    {/* <p>Combo: {combo}</p> */}
                    <form action={validateRes} className="mg-gameplay-form">
                        {/* Equation in gameplay card */}
                        {/* TODO: Implement LaTex rendering. Change styles once LaTex is implemented */}
                        <p className="mg-gameplay-equation">
                            {equation.getLatex()}
                        </p>
                        {/* Input */}
                        <div className="mg-gameplay-input">
                            <label htmlFor="solution-input">x = </label>
                            <input id="solution-input" type="number" placeholder="..." value={userInput} onChange={(e)=>{setUserInput(e.target.value)}} />
                        </div>
                        {/* Submit */}
                        <McButton type="submit">
                            Submit!
                        </McButton>
                    </form>
                </div>
            </div>
        </div>
    );
}

/**
 * Calculates the CSS variables required to make the equation stay in the golden plate
 * on the door in the background
 * 
 * @param backgroundRef The reference to the background image object
 * @returns 
 */
function calculateEquationTransform(backgroundRef: RefObject<null | HTMLDivElement>) {
    const rect = backgroundRef.current?.getBoundingClientRect();
    if (!rect) {
        console.error("Invalid reference to background element! Can't calculate equation position! Visual glitches are to be expected!");
        return
    }
    // If this ratio is bigger than IMG_RATIO, the bottom of the image gets cropped,
    // if it's smaller, the right side of the image gets cropped
    const divRatio = rect.width / rect.height;
    let newX;
    let newY;
    let sizeRatio;

    // If we have bottom crop, positioning the equation horizontally is easy
    if (divRatio > IMG_RATIO) {
        newX = `${rect.width  * IMG_POS_X}px`;
        newY = `${rect.width / IMG_RATIO * IMG_POS_Y}px`;

        sizeRatio = rect.width / TARGET_X_SIZE;
        
    }
    // With right crop, vertical positioning is easy
    else {
        newX = `${rect.height * IMG_RATIO * IMG_POS_X}px`;
        newY = `${rect.height * IMG_POS_Y}px`;

        sizeRatio = rect.height / TARGET_Y_SIZE;
    }

    const newSize = `${sizeRatio * BASE_FONT_SIZE}px`
    const newSizeX = `${sizeRatio * BASE_X_SIZE}px`
    const newSizeY = `${sizeRatio * BASE_Y_SIZE}px`
    const newPaddingX = `${sizeRatio * BASE_X_PADDING}px`
    const newPaddingY = `${sizeRatio * BASE_Y_PADDING}px`

    const root = document.querySelector(":root") as HTMLElement;
    root.style.setProperty("--mg-equation-x-pos", newX);
    root.style.setProperty("--mg-equation-y-pos", newY);
    root.style.setProperty("--mg-equation-font-size", newSize);
    root.style.setProperty("--mg-equation-x-size", newSizeX);
    root.style.setProperty("--mg-equation-y-size", newSizeY);
    root.style.setProperty("--mg-equation-x-padding", newPaddingX);
    root.style.setProperty("--mg-equation-y-padding", newPaddingY);
}

export default Play