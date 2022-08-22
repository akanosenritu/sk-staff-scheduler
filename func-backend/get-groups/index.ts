import {AzureFunction, Context, HttpRequest, HttpResponse} from "@azure/functions"
import {getAccessToken} from "../utils/msgraph/getAccessToken"
import {callGraphApi} from "../utils/msgraph/callGraphApi"
import {Group} from "shared/types/group"
import {User} from "shared/types/user"
import {FuncBackendGetGroupsResponse} from "shared/types/funcBackendResponses"

const httpTrigger: AzureFunction = async function (): Promise<HttpResponse> {
  const res: HttpResponse = {
    status: 200,
    body: {},
    headers: {
      "Content-Type": "application/json"
    }
  }

  const authenticationResult = await getAccessToken()
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
    data: groups
  }

  res.status = 200
  res.body = body

  return res
}

export default httpTrigger