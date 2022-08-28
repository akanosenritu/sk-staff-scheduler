import {AzureFunction, Context, HttpRequest, HttpResponse} from "@azure/functions"
import {CosmosClient} from "@azure/cosmos"
import {createScheduleItem, updateSchedule} from "shared/dist/utils/schedule"
import {validateScheduleData} from "shared/dist/validators/validateScheduleData"
import {getEnvironmentVariable} from "../environmentVariables"
import {
  createUserScheduleItem,
  getUserScheduleItem,
  replaceUserScheduleItem
} from "shared/dist/utils/cosmosdb/schedules"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<HttpResponse> {
  const res: HttpResponse = {
    status: 200,
    body: {},
    headers: {
      "Content-Type": "application/json"
    }
  }

  const userId = req.query.userId
  if (!userId) {
    res.status = 400
    res.body = {error: "userId was not provided as a param."}
    return res
  }

  // validate the incoming data
  const incomingData = req.body as unknown
  const validationResult = validateScheduleData(incomingData)
  if (validationResult.result === "failed") {
    res.status = 400
    res.body = {error: validationResult.error}
    return res
  }
  const incomingScheduleData = validationResult.validated

  // get the environment variables required to run this function
  let connectionString
  try {
    connectionString = getEnvironmentVariable("AzureCosmosDBConnectionString")
  } catch (e) {
    res.status = 500
    res.body = {error: e}
    return res
  }

  const client = new CosmosClient(connectionString)

  // retrieve the user's data
  const getItemResponse = await getUserScheduleItem(client, userId)

  // if no data was found, create a new one.
  if (getItemResponse.statusCode === 404) {
    const newData = createScheduleItem(userId, incomingScheduleData)
    const createItemResponse = await createUserScheduleItem(client, newData)
    res.body = createItemResponse.resource
    res.status = 201
    return res
  }

  // if data was found, replace the old one with the new one
  const replaceItemResponse = await replaceUserScheduleItem(client, userId, {id: userId, schedule: updateSchedule(getItemResponse.resource.schedule, incomingScheduleData)})
  res.body = replaceItemResponse.resource
  res.status = 200
  return res
}

export default httpTrigger