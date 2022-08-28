import fetch from "cross-fetch"

export const callGraphApi = async<T> (endpoint: string, accessToken: string): Promise<T> => {
  return fetch("https://graph.microsoft.com" + endpoint, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`
    }
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) throw new Error(data.error)
      return data
    })
}