export type PromiseFn<T> = (...args: any) => Promise<T>;

export type PickTypeByKey<U extends Record<string, any>, K extends keyof U> = U[K];
