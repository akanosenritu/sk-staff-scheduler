import fetch from "cross-fetch"

export const callGetOnBackend = async<T> (endpoint: string): Promise<T> => {
  return fetch(`https://func-sk-staff-scheduler.azurewebsites.net/api` + endpoint, {
    method: "GET",
    headers: {
      "x-functions-key": process.env["FUNC_SK_STAFF_SCHEDULER_API_KEY"] || ""
    }
  })
    .then(res => {
      return res.json()
    })
}