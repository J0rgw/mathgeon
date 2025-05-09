import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Play from "../pages/Play";
import { MgDifficulty } from "../types/MgDifficulty";
// import Login from "../pages/Login";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/play">
          <Route index element={<Play />} />
          <Route path="cavern-of-addition" element={<Play difficulty={MgDifficulty.EASY} />} />
          <Route path="crypt-of-multiplication" element={<Play difficulty={MgDifficulty.MID} />} />
          <Route path="temple-of-algebra" element={<Play difficulty={MgDifficulty.HARD} />} />
        </Route>
        {/* <Route path="/login" element={<Login />} /> */}
        {/* futuras rutas: Login, Dungeon, Leaderboard... */}
      </Routes>
    </Router>
  );
}
