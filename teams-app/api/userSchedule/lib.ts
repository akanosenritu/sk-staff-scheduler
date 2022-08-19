import { CosmosDBScheduleItem, ScheduleData } from "../types/Schedule"
import "isomorphic-fetch"

const apiGetUserScheduleUrl = "https://func-sk-staff-scheduler.azurewebsites.net/api/get-user-schedule"
const apiUpdateOrCreateUserScheduleUrl = " https://func-sk-staff-scheduler.azurewebsites.net/api/update-or-create-user-schedule"

type Result = {
  statusCode: number,
} & ({
  status: "success",
  data: CosmosDBScheduleItem
} | {
  status: "failed",
  error: string,
} | {
  status: "notFound",
})

export const getUserSchedule = async (userId: string): Promise<Result> => {
  const params = new URLSearchParams({userId})
  const apiResponse = await fetch(apiGetUserScheduleUrl + "?" + params.toString(), {
    method: "GET",
    headers: {
      "x-functions-key": process.env["AzureFunctionsFuncSkStaffSchedulerApiKey"]
    }
  })

  if (apiResponse.ok) {
    return {
      status: "success",
      statusCode: 200,
      data: await apiResponse.json()
    }
  } else if (apiResponse.status === 404) {
    return {
      status: "notFound",
      statusCode: 404,
    }
  }
  return {
    status: "failed",
    statusCode: apiResponse.status,
    error: await apiResponse.text(),
  }
}

export const updateOrCreateUserSchedule = async (userId: string, data: ScheduleData): Promise<Result> => {
  const params = new URLSearchParams({userId})
  const apiResponse = await fetch(apiUpdateOrCreateUserScheduleUrl + "?" + params.toString(), {
    method: "POST",
    headers: {
      "x-functions-key": process.env["AzureFunctionsFuncSkStaffSchedulerApiKey"],
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  })

  if (apiResponse.ok) {
    return {
      status: "success",
      statusCode: 200,
      data: await apiResponse.json()
    }
  } 
  return {
    status: "failed",
    statusCode: apiResponse.status,
    error: await apiResponse.text(),
  }
}