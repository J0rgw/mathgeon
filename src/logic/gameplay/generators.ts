/**
 *  Generators  /
 * ------------´
 * 
 * Equation generators for MathGeon.
 * Random numbers obtained with GRand.
 * 
 * Generators return an Equation
 */

import __wbg_init, { _hack_unload } from "../../grand/grand";
import initSync, { compile, GrandEx } from "../../grand/grand";
import { MgDifficulty } from "../../types/MgDifficulty";
import { Equation } from "./equation";
import { allocGrandExpressions, EASY_GENERATORS_SORTED, freeGrandExpressions } from "./generatorFunctions/generatorFunctions";

let easyGenGrandex: GrandEx;

export async function initGenerators() {
    await initSync();
    allocGrandExpressions();
    easyGenGrandex = compile(`0..${EASY_GENERATORS_SORTED.length-1}|*1`);
}
export function freeGenerators() {
    try {
        freeGrandExpressions();
        easyGenGrandex.free()
    } catch (error) {
        console.warn("Mathgeon is falling apart at the seams");
        console.error(error);
    }
}

// Get Random Indices
function randomIndexEasy() {
    return easyGenGrandex.generate();
}

async function generateEquation(difficulty: MgDifficulty): Promise<Equation> {
    let equation: Equation | undefined;
    console.log("Let's go gambling!");
    try {
        const generatorFunction = (difficulty == MgDifficulty.EASY) ?
            // Easy Equations
            EASY_GENERATORS_SORTED[randomIndexEasy()]
        : (difficulty == MgDifficulty.MID ?
            // Intermediate equations
            // TODO: Add intermediate equations
            EASY_GENERATORS_SORTED[randomIndexEasy()]
        :
            // Hard equations
            // TODO: Add hard equations
            EASY_GENERATORS_SORTED[randomIndexEasy()]
        )
        equation = generatorFunction();
    } catch (_) {
        // Unload and reload WASM completely
        // freeGenerators();
        _hack_unload();
        try {
            console.warn("WASM Reloaded! (recovered from equation generation error)");
            await initGenerators();
            
            const generatorFunction = (difficulty == MgDifficulty.EASY) ?
                // Easy Equations
                EASY_GENERATORS_SORTED[randomIndexEasy()]
            : (difficulty == MgDifficulty.MID ?
                // Intermediate equations
                // TODO: Add intermediate equations
                EASY_GENERATORS_SORTED[randomIndexEasy()]
            :
                // Hard equations
                // TODO: Add hard equations
                EASY_GENERATORS_SORTED[randomIndexEasy()]
            )

            equation = generatorFunction();
        } catch (error) {
            console.error("Mathgeon has collapsed!");
            console.error(error);
        }
    }
    return equation ?? new Equation("");
}

export async function generateEasy(): Promise<Equation> {
    return generateEquation(MgDifficulty.EASY);
}