import NextAuth, {NextAuthOptions} from "next-auth"
import AzureAD from "next-auth/providers/azure-ad"

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    AzureAD({
      clientId: process.env["AzureADClientID"] || "",
      clientSecret: process.env["AzureADClientSecret"] || "",
      tenantId: process.env["AzureADTenantID"] || "",
      authorization: {
        params: {
          scope: "openid profile email User.Read"
        }
      }
    })
  ],
  secret: process.env["NEXT_AUTH_SECRET"],
  callbacks: {
    async session({session, token}) {
      // @ts-ignore
      session.token = token
      return session
    },
    async jwt({token, account}) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    }
  }
}

export default NextAuth(nextAuthOptions)