export const environmentVariableNamesRequired = [
  "AzureCosmosDBConnectionString",
] as const

type EnvironmentVariableName = typeof environmentVariableNamesRequired[number]

export const environmentVariables: {[key in EnvironmentVariableName]: string | undefined} = Object.fromEntries(environmentVariableNamesRequired.map(name => {
  return [name, process.env[name]]
})) as {[key in EnvironmentVariableName]: string | undefined}

export const getEnvironmentVariable = (key: EnvironmentVariableName): string => {
  const value = environmentVariables[key]
  if (value) return value
  throw new Error(`Environment variable ${key} is not defined.`)
}