// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(obj: any): obj is Function {
  return typeof obj === 'function';
}

export const isProd = process.env.NODE_ENV === 'production';
