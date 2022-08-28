import {AzureFunction, Context, HttpRequest, HttpResponse} from "@azure/functions"
import {CosmosClient} from "@azure/cosmos"
import {createScheduleItem} from "shared/dist/utils/schedule"

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

  // retrieve the user's data
  const item = await cosmosClient
    .database("schedules")
    .container("Container")
    .item(userId)

  const data = await item.read()

  // if item is not found, create a new one
  if (data.statusCode === 404) {
    res.body = createScheduleItem(userId, {data: {}})
    res.status = 200
    return res
  }

  res.body = data.resource
  return res
}

export default httpTrigger