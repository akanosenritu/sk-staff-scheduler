import {AzureFunction, HttpResponse} from "@azure/functions"
import {FuncBackendGetGroupsResponse, Group, User} from "shared/dist/types"
import {getAccessToken} from "shared/dist/utils/msgraph/getAccessToken"
import {callGraphApi} from "shared/dist/utils/msgraph/callGraphApi"
import {getEnvironmentVariable} from "../environmentVariables"

const httpTrigger: AzureFunction = async function (): Promise<HttpResponse> {
  const res: HttpResponse = {
    status: 200,
    body: {},
    headers: {
      "Content-Type": "application/json"
    }
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

  const authenticationResult = await getAccessToken(clientId, clientSecret, authority)
  const apiResponse = await callGraphApi<{value: Group[]}>("/v1.0/groups", authenticationResult.accessToken)
  const groups = apiResponse.value
  await Promise.all(groups.map(group => {
    return callGraphApi<{value: User[]}>(`/v1.0/groups/${group.id}/members`, authenticationResult.accessToken)
      .then(res => res.value)
      .then(users => {
        group.members = users
      })
  }))

  const body: FuncBackendGetGroupsResponse = {
    status: "success",
    groups: groups
  }

  res.status = 200
  res.body = body

  return res
}

export default httpTrigger