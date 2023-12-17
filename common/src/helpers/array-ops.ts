export function isArray(arg: unknown | unknown[]): arg is Array<typeof arg> {
  return Array.isArray(arg);
}
