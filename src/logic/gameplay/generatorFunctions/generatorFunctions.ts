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
import { compile, GrandEx } from "../../../grand/grand";
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
 * The expression must be pre-compiled. If it was not
 * compiled previously, the function throws an exception
 */
function generate(grandExpression: string) {
    if (!available) throw "Can't generate math problems with uninitialized or freed Random Number Generators";
    return gMap[grandExpression].generate();
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