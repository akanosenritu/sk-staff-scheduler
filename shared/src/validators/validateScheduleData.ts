import {createFailedResult, ValidationResult} from "./validationResult"
import {hasProperty, isObject} from "./utils"
import {ScheduleData} from "../types"

export const validateScheduleData = (input: unknown): ValidationResult<ScheduleData> => {
  if (!input) return createFailedResult("no data was given")
  if (!(input instanceof Object)) return createFailedResult("data was not an object")
  if (!hasProperty(input, "data")) return createFailedResult("data must have a field named 'data'")

  const data = input.data
  if (!isObject(data)) return createFailedResult("data field must be an object")

  const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
  for (const dayString in data) {
    if (!regex.test(dayString)) {
      return createFailedResult(`data field object has an invalid key ${dayString}: key must be formatted as yyyy-MM-dd.`)
    }
  }
  return {
    result: "success",
    validated: input as ScheduleData
  }
}
