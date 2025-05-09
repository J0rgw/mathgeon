/**
 *  Generators  /
 * ------------´
 * 
 * Equation generators for MathGeon.
 * Random numbers obtained with GRand.
 * 
 * Generators return an Equation
 */

import initSync, { compile, GrandEx } from "../../grand/grand";
import { Equation } from "./equation";
import { allocGrandExpressions, EASY_GENERATORS_SORTED, freeGrandExpressions } from "./generatorFunctions/generatorFunctions";

let easyGenGrandex: GrandEx;

export async function initGenerators() {
    await initSync();
    allocGrandExpressions();
    easyGenGrandex = compile(`0..${EASY_GENERATORS_SORTED.length-1}|*1`);
}
export function freeGenerators() {
    freeGrandExpressions();
    easyGenGrandex.free()
}

// Get Random Indices
function easy() {
    return easyGenGrandex.generate();
}

export function generateEasy(): Equation {
    return EASY_GENERATORS_SORTED[easy()]();
}