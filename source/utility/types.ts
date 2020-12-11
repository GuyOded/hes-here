/**
 * A module providing utilities regarding type definitions
 */

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
