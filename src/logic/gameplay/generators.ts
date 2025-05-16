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
import { allocGrandExpressions, EASY_GENERATORS_SORTED, freeGrandExpressions, MID_GENERATORS_SORTED } from "./generatorFunctions/generatorFunctions";

let easyGenGrandex: GrandEx;
let midGenGrandex: GrandEx;

let initialized = false;

/**
 * Takes a closure and calls it within a try catch block.  
 * It will try to reload WASM a bunch of times in a row and
 * launch a nuclear warhead into the moon if it fails out
 * of sheer frustration.
 * 
 * HOW TO CAUSE THE BUG:
 * - Ctrl+F5 on Home page
 * - Enter any dungeon
 * - See a wall of red on the console
 * 
 * Reloading normally fixes it (forever apparently)
 */
async function gamble(cursedWasmCode: Function, depth: number = 0): Promise<any> {
    try {
        return await cursedWasmCode();
    } catch (e) {
        // Unload and reload WASM completely
        // freeGenerators();
        _hack_unload();
        initialized = false;
        try {
            console.error(e);
            switch (depth) {
                case 0:
                    console.warn("WASM Reloaded, trying to recover... (depth 0)");
                    break;
                case 1:
                    console.warn("WASM Reloaded, through me is the way to the city of woe... (depth 1)");
                    break;
                case 2:
                    console.warn("WASM Reloaded. (depth 2)");
                    console.warn(`%c\n   PERHAPS,   \nTHIS IS HELL`, `
                        font-size: 16px;
                        background-color: black;
                        padding: 8px 24px;
                        color: #eab7a9;
                        margin: 0;
                        font-family: 'Times New Roman', serif;
                        transform: scaleY(1.5);
                    `);
                    break;
                default:
                    console.error(`WASM Reloaded, going nuclear... (depth ${depth})`);
                    break;
            }

            // The code directly called by the user
            if (depth == 0) {
                await gamble(async ()=>{
                    await initGenerators();
                    return await cursedWasmCode();
                }, depth+1);
            }
            // The last attempt
            else if (depth >= 3) {
                // await cursedWasmCode();
                // HACK: Reload entire page when we reach maximum depth
                window.location.reload();
            }
            // Code called in between. Since at depth 0 the
            // initGenerators function was also injected everything should work :)
            else {
                await gamble(cursedWasmCode, depth+1);
            }
        }
        catch (error) {
            console.error("Mathgeon has collapsed!");
            console.error(error);
        }
    }
}

export async function initGenerators() {
    if (initialized) return;
    
    
    let res = await gamble(async ()=>{
        await initSync();
        allocGrandExpressions();
        return {
            ez: compile(`0..${EASY_GENERATORS_SORTED.length-1}|*1`),
            md: compile(`0..${MID_GENERATORS_SORTED.length-1}|*1`)
        }
    })
    easyGenGrandex = res.ez;
    midGenGrandex = res.md;
    
    console.log("Initialized Generators");
    initialized = true;
}
export function freeGenerators() {
    if (!initialized) return;
    try {
        freeGrandExpressions();
        easyGenGrandex.free();
        midGenGrandex.free();
    } catch (error) {
        console.warn("Mathgeon is falling apart at the seams");
        console.error(error);
    }
    initialized = false;
}

// Get Random Indices
function randomIndexEasy() {
    return easyGenGrandex.generate();
}
function randomIndexMid() {
    return midGenGrandex.generate();
}

export async function generateEquation(difficulty: MgDifficulty): Promise<Equation> {
    // Gambling twice increases our chances of success ofc
    const generatorFunction = await gamble(()=>{
        return (difficulty == MgDifficulty.EASY) ?
            // Easy Equations
            EASY_GENERATORS_SORTED[randomIndexEasy()]
        : (difficulty == MgDifficulty.MID ?
            // Intermediate equations
            MID_GENERATORS_SORTED[randomIndexMid()]
        :
            // Hard equations
            // TODO: Add hard equations
            EASY_GENERATORS_SORTED[randomIndexEasy()]
        )
    });
    console.log("Obtained generator function");
    
    const equation = await gamble(()=>{
        return generatorFunction();
    });
    console.log("Obtained Equation", equation);

    return equation ?? new Equation("");
}