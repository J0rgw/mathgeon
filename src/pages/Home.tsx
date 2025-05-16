import { useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    updatePassword,
    User,
    deleteUser,
} from "firebase/auth";
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { auth } from "../services/firebase";
import McButton from "../components/McButton";
import McInput from "../components/McInput";
import "../styles/book.css";
import "../styles/animations.css";
import "../styles/main.css";
import "../styles/homeLayout.css";
import { Link } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import AlertMessage from "../components/AlertMessage";
import { amIAdmin } from "../services/users";

// Constants
const REGEX_EMAIL = /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*$/;

// Interfaces
interface Dungeon {
    name: string;
}

interface LeaderboardEntry {
    username: string;
    score: number;
}

export default function MainPage() {
    // Estado de usuario autenticado (Firebase)
    const [user, setUser] = useState<User | null>(null);

    // Indica si somos o no administradores
    const [isAdmin, setIsAdmin] = useState(false);

    // Índice de la página actual del libro (scroll horizontal)
    const [currentPage, setCurrentPage] = useState(0);

    // Mensaje de error a mostrar en alertas (login/signup) y datos relacionados
    const [loginErrorMsg, setLoginErrorMsg] = useState("");

    // Alterna entre modo login (true) o registro (false)
    const [isLogin, setIsLogin] = useState(true);

    // Inputs del formulario de autenticación
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    // Nombre de usuario (para login y registro)
    const [username, setUsername] = useState("");

    // Lista de mazmorras obtenida desde Firebase
    const [dungeons, setDungeons] = useState<Record<string, Dungeon>>({});

    // Lista del top 10 en la mazmorra seleccionada
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    // ID de la mazmorra seleccionada actualmente
    const [selectedDungeon, setSelectedDungeon] = useState<string>("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const db = getDatabase();
                const userRef = ref(db, `users/${firebaseUser.uid}`);
                onValue(userRef, (snapshot) => {
                    const name = snapshot.val().username;
                    if (name) {
                        setUsername(name);
                        const myRoles = snapshot.val().roles ?? [];
                        if (myRoles.includes("superAdmin")) {
                            setIsAdmin(true);
                        } else {
                            setIsAdmin(false);
                        }
                    }
                });
            } else {
                setUsername("");
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const carousel = document.querySelector(".carousel") as HTMLElement;
        if (!carousel) return;
        const handleScroll = () => {
            const scrollLeft = carousel.scrollLeft;
            const totalWidth = carousel.scrollWidth;
            const slideCount = 4;
            const pageWidth = totalWidth / slideCount;
            const index = Math.round(scrollLeft / pageWidth);
            setCurrentPage(index);
        };
        carousel.addEventListener("scroll", handleScroll);
        return () => carousel.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const db = getDatabase();
        const dungeonsRef = ref(db, "dungeons");
        onValue(dungeonsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setDungeons(data);
                const firstKey = Object.keys(data)[0];
                setSelectedDungeon(firstKey);
            }
        });
    }, []);

    useEffect(() => {
        const db = getDatabase();
        const userProgressRef = ref(db, "userProgress");
        onValue(userProgressRef, async (snapshot) => {
            const progressData = snapshot.val();
            const usersRef = ref(db, "users");
            const usersSnapshot = await get(usersRef);
            const users = usersSnapshot.val();

            const scores: LeaderboardEntry[] = [];
            for (const uid in progressData) {
                const dungeonData = progressData[uid]?.[selectedDungeon];
                if (dungeonData) {
                    scores.push({
                        username: users[uid]?.username || "???",
                        score: dungeonData.score || 0,
                    });
                }
            }

            scores.sort((a, b) => b.score - a.score);
            while (scores.length < 10) {
                scores.push({ username: "???", score: 0 });
            }
            setLeaderboard(scores.slice(0, 10));
        });
    }, [selectedDungeon]);

    const handleEnter = () => {
        const carousel = document.querySelector(".carousel") as HTMLElement;
        if (!carousel) return;
        const slideCount = 4;
        const pageWidth = carousel.scrollWidth / slideCount;
        const targetIndex = user ? 2 : 1;
        carousel.scrollTo({ left: pageWidth * targetIndex, behavior: "smooth" });
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        const db = getDatabase();
        try {
            if (isLogin) {
                const usersRef = ref(db, "users");
                const snapshot = await get(usersRef);
                const users = snapshot.val();
                let emailFound: string | null = null;
                let status = "";
                for (const uid in users) {
                    if (users[uid].username === username) {
                        // Get email
                        emailFound = users[uid].email;
                        // Get account status
                        if (users[uid].status) {
                            if (users[uid].status?.includes("deleted")) {
                                status = "deleted";
                            } else if (users[uid].status?.includes("banned")) {
                                status = "banned";
                            }
                        }
                        break;
                    }
                }
                if (!emailFound) {
                    // console.log("Username not found");
                    // When the security is sus
                    setLoginErrorMsg("Invalid username or password");
                    return;
                }
                // Handle statuses
                switch (status) {
                    case "deleted":
                        setLoginErrorMsg("Invalid username or password");
                        return;
                
                    case "banned":
                        setLoginErrorMsg("This account is banned");
                        return;

                    default:
                        break;
                }
                await signInWithEmailAndPassword(auth, emailFound, password);
                setLoginErrorMsg("");
                // alert("Logged in!");
            } else {
                if (!REGEX_EMAIL.test(email)) {
                    setLoginErrorMsg("Invalid email format");
                    return;
                }

                const snapshot = await get(ref(db, "users"));
                const users = snapshot.val();

                // Verificar si el username ya existe
                const usernameExists = Object.values(users || {}).some(
                    (u: any) => u.username?.toLowerCase() === username.toLowerCase()
                );

                if (usernameExists) {
                    setLoginErrorMsg("Username already playing mathgeon");

                    return;
                }
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;
                await set(ref(db, `users/${uid}`), { username, email });
                setLoginErrorMsg("Username already playing mathgeon");

            }
        } catch (error: unknown) {
            if (!(error instanceof FirebaseError)) {
                console.error("Error is not firebare error somehow");
                return;
            }
            if (error.code == "auth/invalid-credential") {
                //sustituir todos los alerts son setLoginErrorMSG
                setLoginErrorMsg("Invalid username or password");
            } else {
                setLoginErrorMsg(error.message);
            }
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setLoginErrorMsg("");
        setUsername("");
        setPassword("");
        setIsAdmin(false); // para evitar popping al iniciar sesión con no-administrador después de iniciar sesión como administrador
        // alert("Logged out!");
    };

    const handlePasswordChange = async () => {
        if (auth.currentUser && newPassword.length >= 6) {
            try {
                await updatePassword(auth.currentUser, newPassword);
                alert("Password updated!");
                setNewPassword("");
            } catch (error: any) {
                setLoginErrorMsg(error.message);
            }
        } else {
            setLoginErrorMsg("Password must be at least 6 characters.");
        }
    };

    const handleEnterDungeon = (id: string) => {
        console.log(`Entering dungeon: ${dungeons[id].name}`);
    };

    return (
        <div className="fakeroot"> {/* Fake Root holds the styles that were previously in the <body>. This way other pages don't inherit this page's style */}
            <div className="container">
                <div className="sprite-wrapper">
                    <div className="book">
                        {/* Error handling */}
                        <AlertMessage message={loginErrorMsg} type="home" onClose={()=>setLoginErrorMsg("")} />

                        <div className="carousel" style={{ "--slides": "4" } as React.CSSProperties}>
                            <div className="sprite" />

                            {/* PAGE 1: Home */}
                            <div className={`carousel-item ${currentPage === 0 ? "active" : ""}`}>
                                <div className="page-container">
                                    <div className="page left-page" data-page="1">
                                        <div className="home-content">
                                            <h1 className="wave-text">
                                                {"MATHGEON".split("").map((letter, idx) => (
                                                    <span key={idx} className={`letter-delay-${idx}`}>{letter}</span>
                                                ))}
                                            </h1>
                                            <div className="button-container">
                                                <McButton onClick={handleEnter}>Enter the Dungeon</McButton>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="page right-page" data-page="2">
                                        
                                        <p className="desc-text">
                                            A roguelite dungeon where your sword is your mind.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* PAGE 2 */}
                            <div className={`carousel-item ${currentPage === 1 ? "active" : ""}`}>
                                <div className="page-container">
                                    {user ? (
                                        <>
                                            {/* PERFIL */}
                                            <div className="page left-page" data-page="3">
                                                <div className="profile-info">
                                                    <h3 className="profile-title">Welcome, {username || "..."}</h3>
                                                    <p className="profile-text">Email: {user.email}</p>
                                                    <p className="profile-text">Password: ********</p>
                                                    {isAdmin &&
                                                        <Link to={`/admin`}>
                                                            <McButton onClick={()=>{}}>Administration Panel</McButton>
                                                        </Link>
                                                    }
                                                </div>
                                            </div>

                                            <div className="page right-page" data-page="4">
                                                <form
                                                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                                                        e.preventDefault();
                                                        handlePasswordChange();
                                                    }}
                                                    style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}
                                                >
                                                    <McInput
                                                        placeholder="New Password"
                                                        value={newPassword}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                                                        type="password"
                                                    />
                                                    <McButton type="submit">Change Password</McButton>
                                                    <McButton onClick={handleLogout}>Log Out</McButton>
                                                </form>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* LOGIN / REGISTRO */}
                                            <div className="page left-page" data-page="3">
                                                <div className="auth-toggle" style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
                                                    <McButton onClick={() => setIsLogin(true)}>Login</McButton>
                                                    <McButton onClick={() => setIsLogin(false)}>Sign Up</McButton>
                                                </div>
                                            </div>

                                            <div className="page right-page" data-page="4">
                                                <form
                                                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleAuth(e)}
                                                    style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}
                                                >
                                                    {!isLogin && (
                                                        <>
                                                            <McInput
                                                                placeholder="Username"
                                                                value={username}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                                            />
                                                            <McInput
                                                                placeholder="Email"
                                                                value={email}
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                                type="email"
                                                            />
                                                        </>
                                                    )}
                                                    {isLogin && (
                                                        <McInput
                                                            placeholder="Username"
                                                            value={username}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                                                        />
                                                    )}
                                                    <McInput
                                                        placeholder="Password"
                                                        value={password}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                                        type="password"
                                                    />
                                                    <McButton type="submit">{isLogin ? "Log In" : "Sign Up"}</McButton>
                                                </form>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* PAGE 3: Dungeon Selector */}
                            <div className={`carousel-item ${currentPage === 2 && user ? "active" : ""}`}>
                                <div className="page-container">
                                    <div className="page left-page" >
                                        <div>
                                            <h2 className="profile-title">Dungeon Selector</h2>
                                            {Object.entries(dungeons).map(([id, dungeon]) => (
                                                <div key={id} style={{ marginBottom: "0.5rem", width: "100%" }}>
                                                    <strong className="profile-text">{dungeon.name}</strong>
                                                    <Link to={`/play/${id}`}>
                                                        <McButton onClick={() => handleEnterDungeon(id)}>Enter</McButton>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="page right-page" >
                                        <div>
                                            <p style={{ fontSize: "0.85rem" }} className="profile-text">
                                                {user ?
                                                    <>Select a dungeon to begin your challenge.<br />More coming soon!</>
                                                    :
                                                    <>Log in to select a dungeon.</>
                                                }
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* PAGE 4: Leaderboard */}
                            <div className={`carousel-item ${currentPage === 3 ? "active" : ""}`}>
                                <div className="page-container">
                                    <div className="page left-page" data-page="7">
                                        <div className="leaderboard-left">
                                            <h2 className="wave-text">Leaderboard</h2>
                                            <select
                                                value={selectedDungeon}
                                                onChange={(e) => setSelectedDungeon(e.target.value)}
                                                className="mc-button selector-style fit-width"
                                            >
                                                {Object.entries(dungeons).map(([id, dungeon]) => (
                                                    <option key={id} value={id}>
                                                        {dungeon.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="page right-page" data-page="8">
                                        <ol className="leaderboard-list small-text">
                                            {leaderboard.map((entry, idx) => (
                                                <li key={idx} className="leaderboard-entry">
                                                    <span className="rank">{idx + 1}.</span>{" "}
                                                    <span className="leaderboard-name">{entry.username}</span>
                                                    <span className="colon">:</span>
                                                    <span className="leaderboard-score">{entry.score}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div> // Fake Root
    );
}