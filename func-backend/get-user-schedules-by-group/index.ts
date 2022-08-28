import {AzureFunction, Context, HttpResponse} from "@azure/functions"
import {CosmosClient, SqlQuerySpec} from "@azure/cosmos"
import {callGraphApi} from "../utils/msgraph/callGraphApi"
import {getAccessToken} from "../utils/msgraph/getAccessToken"
import {CosmosDBScheduleItem, FuncBackendGetUserSchedulesByGroupResponse, User} from "shared/dist/types"

const cosmosClient = new CosmosClient(process.env["AzureCosmosDBConnectionString"])

const httpTrigger: AzureFunction = async function (context: Context): Promise<HttpResponse> {
  const res: HttpResponse = {
    status: 200,
    body: {},
    headers: {
      "Content-Type": "application/json",
    }
  }

  const groupId: string | undefined = context.bindingData.groupId
  if (!groupId) {
    res.status = 400
    res.body = {
      error: "groupId was not provided."
    }
    return res
  }

  // call graph api to retrieve the group's members.
  const {accessToken} = await getAccessToken()
  let apiResponse: {value: User[]}
  try {
    apiResponse = await callGraphApi(`/v1.0/groups/${groupId}/members`, accessToken)
  } catch (e: unknown) {
    res.status = 400
    res.body = e
    return res
  }

  // search the users in the cosmosdb
  const users = apiResponse.value

  const querySpec: SqlQuerySpec = {
    query: "Select * from c Where ARRAY_CONTAINS(@array, c.id)",
    parameters: [
      {name: "@array", value: users.map(user => user.id)}
    ]
  }

  const {resources} = await cosmosClient
    .database("schedules")
    .container("Container")
    .items
    .query<CosmosDBScheduleItem>(querySpec)
    .fetchAll()

  const body: FuncBackendGetUserSchedulesByGroupResponse = {
    status: "success",
    schedules: resources,
    users: users
  }

  res.status = 200
  res.body = body

  return res
}

export default httpTrigger