import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Play from "../pages/Play";
import { MgDifficulty } from "../types/MgDifficulty";
import Admin from "../pages/Admin";
// import Login from "../pages/Login";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/admin" element={<Admin />}/>
        <Route path="/play/:dungeonId" element={<Play />} />
        {/* <Route path="/login" element={<Login />} /> */}
        {/* futuras rutas: Login, Dungeon, Leaderboard... */}
      </Routes>
    </Router>
  );
}
