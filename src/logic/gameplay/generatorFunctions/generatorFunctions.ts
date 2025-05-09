/**
 * These generators assume that Grand was already
 * initialized.
 * 
 * Names of generator functions follow this structure:
 * - difficulty level (easy, mid, hard)
 * - underscore
 * - Description of the operation's structure
 */

import { Equation } from "../equation";
import { compile, GrandEx } from "../../../grand-debug/grand";
import { UNCOMPILED_GRAND_EXPRESSIONS } from "../grandExpressions/grandExpressions";

interface GrandExMap {
    [key: string]: GrandEx
}

/**
 * All Compiled Grand Expression Objects in a Map.  
 * It is used a lot, which is why it has a short name
 */
let gMap: GrandExMap;
let available = false;

// Compiles all Grand Expressions, should only be called once
export function allocGrandExpressions() {
    gMap = Object.fromEntries(UNCOMPILED_GRAND_EXPRESSIONS.map(grandex => [grandex, compile(grandex)]));
    // HACK: Save on memory like greedy bastards that hate performance
    // gMap = {};
    available = true;
    // console.log(gMap);
}
// Frees the whole Grand Expressions Map
export function freeGrandExpressions() {
    Object.keys(gMap).forEach((index) => {
        gMap[index].free();
        // console.log(`Freed compiled expression for "${index}"`);
    })
    available = false;
}

/**
 * Generates a number using a Grand Expression.   
 * The expression should be pre-compiled.
 * If it isn't, the expression will be compiled,
 * ran and then freed from memory, which is
 * inefficient but idk what to do anymore
 */
function generate(grandExpression: string) {
    if (!available) throw "Can't generate math problems with uninitialized or freed Random Number Generators";
    if (gMap[grandExpression]) {
        return gMap[grandExpression].generate();
    } else {
        console.warn("Using inefficient Grand Expression mode, this should save memory but is slooooowwww");
        const grandEx = compile(grandExpression);
        const result = grandEx.generate();
        grandEx.free();
        return result;
    }
}

/**
 * List of generators for easy mathematical
 * problems of increasing difficulty.
 */
export const EASY_GENERATORS_SORTED = [
    easy_IntegerAddition,
    easy_ThreeSimpleOps
];


/// GENERATOR FUNCTIONS

function easy_IntegerAddition(): Equation {
    const a = generate("1..10|*1");
    const b = generate("1..10|*1");
    const sign = generate("[0,1]") ? '+' : '-';
    return new Equation(`x = ${a} ${sign} ${b}`);
}
function easy_ThreeSimpleOps(): Equation {
    const a = generate("1..10|*1");
    const b = generate("1..10|*1");
    const c = generate("1..10|*1");
    const sign_a = generate("[0,1]") ? '+' : '-';
    const sign_b = generate("[0,1]") ? '+' : '-';
    return new Equation(`x = ${a} ${sign_a} ${b} ${sign_b} ${c}`);
}