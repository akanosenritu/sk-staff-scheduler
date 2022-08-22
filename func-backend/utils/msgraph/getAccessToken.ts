import * as msal from "@azure/msal-node"

const msalConfig = {
  auth: {
    clientId: process.env["SK_STAFF_SCHEDULER_FUNC_BACKEND_Client_ID"],
    clientSecret: process.env["SK_STAFF_SCHEDULER_FUNC_BACKEND_Client_SECRET"],
    authority: "https://login.microsoftonline.com/" + process.env["SK_TENANT_ID"]
  }
}

const tokenRequest = {
  scopes: ["https://graph.microsoft.com" + "/.default"]
}

const cca = new msal.ConfidentialClientApplication(msalConfig)

export const getAccessToken = async () => {
  return await cca.acquireTokenByClientCredential(tokenRequest)
}