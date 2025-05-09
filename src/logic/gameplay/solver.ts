/**
 * Solves the problems generated by the generators
 * using mathsteps.
 */

import mathsteps from 'mathsteps';

export function solve(equation: string) {
    try {
        const steps: any[] = mathsteps.solveEquation(equation);
        const solution = steps[steps.length-1].newEquation.ascii() as string;
        return solution.substring(solution.indexOf('=')+1).trim();
    } catch (e) {
        console.log("Mfw when I solve a null equation");
        return "0"
    }
}