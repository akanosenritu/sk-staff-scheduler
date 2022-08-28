import {AzureFunction, Context, HttpResponse} from "@azure/functions"
import {CosmosClient, SqlQuerySpec} from "@azure/cosmos"
import {CosmosDBScheduleItem, FuncBackendGetUserSchedulesByGroupResponse, User} from "shared/dist/types"
import {getEnvironmentVariable} from "../environmentVariables"
import {getAccessToken} from "shared/dist/utils/msgraph/getAccessToken"
import {callGraphApi} from "shared/dist/utils/msgraph/callGraphApi"

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

  // get the environment variables required to run this function
  let clientId, clientSecret, authority
  try {
    clientId = getEnvironmentVariable("SK_STAFF_SCHEDULER_FUNC_BACKEND_Client_ID")
    clientSecret = getEnvironmentVariable("SK_STAFF_SCHEDULER_FUNC_BACKEND_Client_SECRET")
    authority = "https://login.microsoftonline.com/" + getEnvironmentVariable("SK_TENANT_ID")
  } catch (e) {
    res.status = 500
    res.body = {error: e}
    return res
  }

  // call graph api to retrieve the group's members.
  const {accessToken} = await getAccessToken(clientId, clientSecret, authority)
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