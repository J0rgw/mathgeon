import { RefObject, useEffect, useRef, useState } from "react";
import "../styles/gameplay.css"

import { generateEasy, initGenerators } from "../logic/gameplay/generators";
import { Equation } from "../logic/gameplay/equation";
import { solve } from "../logic/gameplay/solver";
import { MgPlayProps } from "../types/MgProps";
import { MgDifficulty } from "../types/MgDifficulty";
import McButton from "../components/McButton";

// CONSTANTS                     _
const IMG_RATIO = 16.0/9.0;  // 1.7  <-- infinite 7s lol
const IMG_POS_X = 0.575;      // X Position of the golden plate, values from 0 to 1 beginning from left
const IMG_POS_Y = 0.275;      // Y Position of the golden plate, values from 0 to 1 beginning from top
const TARGET_X_SIZE = 1280;
const TARGET_Y_SIZE = 720;
const BASE_FONT_SIZE = 50;        // text size in PX for the ideal div size (1280x720)
const BASE_X_SIZE = 352;
const BASE_Y_SIZE = 85;
const BASE_X_PADDING = 10;
const BASE_Y_PADDING = 10;

function Play(props: MgPlayProps) {
    const background: RefObject<null | HTMLDivElement> = useRef(null);
    const [equation, setEquation] = useState(new Equation(""))
    const [userInput, setUserInput] = useState("")

    const difficulty = props.difficulty ?? MgDifficulty.MID;
    let difficultyClass: string;
    let levelName: string;
    switch (difficulty) {
        case MgDifficulty.EASY:
            difficultyClass = "mg-gameplay-easy";
            levelName = "Cavern of Addition";
            break;
        case MgDifficulty.MID:
            difficultyClass = "mg-gameplay-moderate";
            levelName = "Crypt of Multiplication";
            break;
        case MgDifficulty.HARD:
            difficultyClass = "mg-gameplay-hard";
            levelName = "Temple of Algebra";
            break;
    }
    

    useEffect(()=>{
        calculateEquationTransform(background);
        const evListener = ()=>calculateEquationTransform(background);
        window.addEventListener("resize", evListener);
        // console.log("loaded resize fix listener");
        
        initGenerators()
            .then(async ()=>{
                setEquation(await generateEasy());
            })
        ;

        return () => {
            window.removeEventListener("resize", evListener);
            // console.log("unloaded resize fix listener");
        }
    }, []);

    async function validateRes() {
        const res = solve(equation.getRaw());
        if (res == userInput) {
            setUserInput("");
            setEquation(await generateEasy());
            alert("Yaaay!");
        } else {
            alert("You stupid")
        }
    }

    return (
        <div className={`mg-gameplay ${difficultyClass}`} ref={background}>
            {/* Equation in Background */}
            <div className="mg-gameplay-equation-door">
                <p>{equation.getLatex()}</p>
            </div>
            {/* Gameplay */}
            <h1>{levelName}</h1>
            <div className="">
                <div className="">
                    <form action={validateRes} className="">
                        {/* Equation in gameplay card */}
                        {/* TODO: Implement LaTex rendering. Change styles once LaTex is implemented */}
                        <p className="mg-gameplay-equation">
                            {equation.getLatex()}
                        </p>
                        {/* Input */}
                        <div className="mg-gameplay-input">
                            <p>x = </p>
                            <input type="text" placeholder="..." value={userInput} onChange={(e)=>{setUserInput(e.target.value)}} />
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