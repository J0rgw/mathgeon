import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import "../styles/book.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in!");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created!");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <div className="sprite-wrapper">
        <div className="book">
          <div className="carousel" style={{ "--slides": "4" } as React.CSSProperties}>
            <div className="sprite" />

            {/* Página 1 */}
            <div className="carousel-item">
              <div className="page-container">
                <div className="page left-page">
                  <div />
                </div>
                <div className="page right-page">
                  <div />
                </div>
              </div>
            </div>

            {/* Página 2 */}
            <div className="carousel-item">
              <div className="page-container">
                <div className="page left-page">
                  <div />
                </div>
                <div className="page right-page">
                  <div />
                </div>
              </div>
            </div>

            {/* Página 3: Texto de introducción */}
            <div className="carousel-item">
              <div className="page-container">
                <div className="page left-page">
                  <div>
                    <h2 style={{ fontFamily: "PixelText", fontSize: "1rem" }}>
                      🔐 Login / Sign Up
                    </h2>
                    <p style={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
                      To access the dungeons of Mathgeon, you must be identified.
                      Log in if you're already a registered warrior, or sign up to begin your journey.
                    </p>
                  </div>
                </div>
                <div className="page right-page" />
              </div>
            </div>

            {/* Página 4: Formulario */}
            <div className="carousel-item">
              <div className="page-container">
                <div className="page left-page">
                  <div>
                    <form onSubmit={handleAuth} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
                      <button type="button" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? "Switch to Sign Up" : "Switch to Log In"}
                      </button>
                    </form>
                  </div>
                </div>
                <div className="page right-page">
                  <div>
                    <p style={{ fontSize: "0.7rem", textAlign: "justify" }}>
                      Your credentials are managed securely with Firebase Authentication. You can safely log in to save progress and stats.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
