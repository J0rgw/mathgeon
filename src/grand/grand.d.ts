/* tslint:disable */
/* eslint-disable */
/**
 * Designed for the web, this function returns a wrapper
 * to the underlying Gex object (GrandEx).
 * This wrapper converts generated Decimal numbers into
 * f64. These numbers can be printed without losing precision
 */
export function compile(expression: string): GrandEx;
/**
 * A Grand Expression. It is a recursive structure that evaluates a range and modifiers (constraints)
 * or a selection from a list.
 * The range's parameters may be other expressions that have to be evaluated first.
 */
export class Gex {
  private constructor();
  free(): void;
}
/**
 * Wrapper for Gex that returns a f64 instead of a Decimal when calling generate().  
 * Made primarily for WASM
 */
export class GrandEx {
  private constructor();
  free(): void;
  /**
   * Generates a random number and returns it as a float without
   * losing its precision.
   */
  generate(): number;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_grandex_free: (a: number, b: number) => void;
  readonly grandex_generate: (a: number) => number;
  readonly compile: (a: number, b: number) => number;
  readonly __wbg_gex_free: (a: number, b: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
