import { AzureFunction, Context, HttpRequest, HttpResponse } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos"
import {CosmosDBScheduleItem, ScheduleData} from "../types/Schedule"
import {createScheduleItem, updateSchedule} from "../utils/schedule"

const cosmosClient = new CosmosClient(process.env["AzureCosmosDBConnectionString"])

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

  const incomingScheduleData = req.body as ScheduleData

  // retrieve the user's data
  const item = await cosmosClient
    .database("schedules")
    .container("Container")
    .item(userId)

  const oldData = await item.read()
  if (oldData.statusCode === 404) {
    const newData = createScheduleItem(userId, incomingScheduleData)
    const createdItem = await cosmosClient.database("schedules").container("Container")
      .items
      .create(newData)
    res.body = createdItem.resource
    return res
  }

  const updatedItem = await item.replace<CosmosDBScheduleItem>({id: userId, schedule: updateSchedule(oldData.resource.schedule, incomingScheduleData)})
  res.body = updatedItem.resource
  return res
}

export default httpTrigger