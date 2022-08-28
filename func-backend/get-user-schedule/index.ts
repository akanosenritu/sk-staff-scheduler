import {AzureFunction, Context, HttpRequest, HttpResponse} from "@azure/functions"
import {createScheduleItem} from "shared/dist/utils/schedule"
import {getEnvironmentVariable} from "../environmentVariables"
import {getUserScheduleItem} from "shared/dist/utils/cosmosdb/schedules"
import {CosmosClient} from "@azure/cosmos"

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

  // get the environment variables required to run this function
  let connectionString
  try {
    connectionString = getEnvironmentVariable("AzureCosmosDBConnectionString")
  } catch (e) {
    res.status = 500
    res.body = {error: e}
    return res
  }

  // retrieve the item
  const client = new CosmosClient(connectionString)
  const data = await getUserScheduleItem(client, userId)

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