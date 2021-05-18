export function createNumberArray(
  len: number,
  formatter?: (index: number) => any,
  start: number = 0
) {
  const arr = [];
  for (let i = start; i < len + start; i += 1) {
    arr.push(formatter ? formatter(i) : i);
  }
  return arr;
}
