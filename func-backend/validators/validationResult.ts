export type Failure = {
  result: "failed",
  error: string
}

export type ValidationResult<T> = {
  result: "success",
  validated: T
} | Failure

export const createFailedResult = (error: string): Failure => {
  return {
    result: "failed",
    error
  }
}