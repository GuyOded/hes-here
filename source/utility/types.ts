/**
 * A module providing utilities regarding type definitions
 */

export type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type PickAsPartial<T, K extends keyof T> = Readonly<Partial<Pick<T, K>> & Omit<T, K>>;
