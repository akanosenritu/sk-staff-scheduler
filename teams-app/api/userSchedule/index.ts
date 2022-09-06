/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import "isomorphic-fetch"
import {Context, HttpRequest} from "@azure/functions"
import {TeamsFx, UserInfo} from "@microsoft/teamsfx"
import {getUserSchedule, updateOrCreateUserSchedule} from "./lib";

interface Response {
  status: number;
  body: { [key: string]: any };
}

type TeamsfxContext = { [key: string]: any }


/**
 * This function handles requests from teamsfx client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
 * Before trigger this function, teamsfx binding would process the SSO token and generate teamsfx configuration.
 *
 * This function initializes the teamsfx SDK with the configuration and calls these APIs:
 * - TeamsFx().setSsoToken() - Construct teamsfx instance with the received SSO token and initialized configuration.
 * - getUserInfo() - Get the user's information from the received SSO token.
 * - createMicrosoftGraphClient() - Get a graph client to access user's Microsoft 365 data.
 *
 * The response contains multiple message blocks constructed into a JSON object, including:
 * - An echo of the request body.
 * - The display name encoded in the SSO token.
 * - Current user's Microsoft 365 profile if the user has consented.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @param teamsfxContext
 */
export default async function run(
  context: Context,
  req: HttpRequest,
  teamsfxContext: TeamsfxContext
): Promise<Response> {
  // Initialize response.
  const res: Response = {
    status: 200,
    body: {},
  }

  // Put an echo into response body.
  res.body.receivedHTTPRequestBody = req.body || ""

  // Prepare access token.
  const accessToken: string = teamsfxContext["AccessToken"]
  if (!accessToken) {
    return {
      status: 400,
      body: {
        error: "No access token was found in request header.",
      },
    }
  }

  // Construct teamsfx.
  let teamsfx: TeamsFx
  try {
    teamsfx = new TeamsFx().setSsoToken(accessToken)
  } catch (e) {
    context.log.error(e)
    return {
      status: 500,
      body: {
        error:
          "Failed to construct TeamsFx using your accessToken. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    }
  }

  // Query user's information from the access token.
  let currentUser: UserInfo
  try {
    currentUser = await teamsfx.getUserInfo()
    if (currentUser && currentUser.displayName) {
      context.log(`User display name is ${currentUser.displayName}.`)
    } else {
      context.log("No user information was found in access token.")
    }
  } catch (e) {
    context.log.error(e)
    return {
      status: 400,
      body: {
        error: "Access token is invalid.",
      },
    }
  }

  // if the request.method === GET, retrieve the user's schedule.
  if (req.method === "GET") {
    const apiResponse = await getUserSchedule(currentUser.objectId)
    res.body = apiResponse
    res.status = apiResponse.statusCode
  } else if (req.method === "POST") {
    const apiResponse = await updateOrCreateUserSchedule(currentUser.objectId, req.body)
    res.body = apiResponse
    res.status = apiResponse.statusCode
  }
  return res
}
