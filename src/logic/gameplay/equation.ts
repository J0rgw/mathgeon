/**
 * A string containing a math problem (not necessarily an equation but meh)
 * and a pretty LaTex version of it rendered with KaTex
 */
export class Equation {
    // Raw, ugly math stuff
    raw: string;
    // Pretty math formatted with LaTex, generated automatically
    latex: string;

    constructor(raw: string) {
        this.raw = raw;

        // TODO: generate the LaTex for the math problem
        this.latex = raw;
    }

    getRaw(): string {
        return this.raw;
    }
    getLatex(): string {
        return this.latex;
    }
}