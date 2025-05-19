/**
 *  Generators  /
 * ------------´
 * 
 * Calls the backend, returns equations.
 * Why is the file called generators.ts???
 * Suffering.
 */

import { MgDifficulty } from "../../types/MgDifficulty";
import { Equation } from "./equation";

export async function generateEquation(difficulty: MgDifficulty): Promise<Equation> {
    // Gambling twice increases our chances of success ofc
    const diffString =
        (difficulty == MgDifficulty.EASY) ? "easy"
        : (difficulty == MgDifficulty.MID ? "mid"
        : "hard"
        )
    ;
    
    const res = await fetch(`${import.meta.env.VITE_EQUATIONS_ENDPOINT}/${diffString}`);
    const equationJson = await res.json();
    const equation = new Equation(equationJson.raw, equationJson.latex);

    return equation ?? new Equation("", "");
}