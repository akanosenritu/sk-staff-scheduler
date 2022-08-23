import {useSession} from "next-auth/react"
import useSwr from "swr"

const isGuest = (principalName: string): boolean => {
  return principalName.endsWith("#EXT#@SKGroup34.onmicrosoft.com")
}

export const useUser = () => {
  const {data: session} = useSession()
  const {data, error} = useSwr(() => {
    if (session?.token) return "graph/me"
    return null
  }, () => {
    return fetch("https://graph.microsoft.com/v1.0/me", {
      headers: {
        "Authorization": `Bearer ${session?.token.accessToken}`
      }
    }).then(res => res.json())
  })

  if (data && data.userPrincipalName) {
    data.isGuest = isGuest(data.userPrincipalName)
  }
  return {isLoggedOut: !session?.token, data, error}
}