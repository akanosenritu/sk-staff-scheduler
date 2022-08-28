import * as msal from "@azure/msal-node"

const tokenRequest = {
  scopes: ["https://graph.microsoft.com" + "/.default"]
}

export const getAccessToken = async (clientId: string, clientSecret: string, authority: string) => {
  const msalConfig = {
    auth: {
      clientId,
      clientSecret,
      authority,
    }
  }
  const cca = new msal.ConfidentialClientApplication(msalConfig)

  return await cca.acquireTokenByClientCredential(tokenRequest)
}