export const isObject = (x: unknown): x is Object => {
  return x instanceof Object
}

export const hasProperty = <K extends string>(x: unknown, name: K): x is {[M in K]: unknown} => {
  return x instanceof Object && name in x
}