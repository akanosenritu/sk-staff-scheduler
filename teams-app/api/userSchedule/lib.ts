import "isomorphic-fetch"
import {CosmosDBScheduleItem, ScheduleData} from "shared/dist/types"
import {CosmosClient} from "@azure/cosmos"
import {getEnvironmentVariable} from "../environmentVariables"
import {
  createUserScheduleItem,
  getUserScheduleItem,
  replaceUserScheduleItem,
} from "shared/dist/utils/cosmosdb/schedules"
import {createScheduleItem, updateSchedule} from "shared/dist/utils/schedule"

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
} | {
  status: "notSaved",
  data: CosmosDBScheduleItem,
})

let cosmosClient
try {
  cosmosClient = new CosmosClient(getEnvironmentVariable("AzureCosmosDBConnectionString"))
} catch (e) {
  throw e
}

export const getUserSchedule = async (userId: string): Promise<Result> => {
  const itemResponse = await getUserScheduleItem(cosmosClient, userId)
  if (itemResponse.statusCode === 200) {
    return {
      statusCode: 200,
      status: "success",
      data: itemResponse.resource
    }
  } else if (itemResponse.statusCode === 404) {
    return {
      statusCode: 404,
      status: "notFound",
    }
  }
  return {
    statusCode: 500,
    status: "failed",
    error: "unknown reason"
  }
}

export const updateOrCreateUserSchedule = async (userId: string, scheduleData: ScheduleData): Promise<Result> => {
  const getItemResponse = await getUserScheduleItem(cosmosClient, userId)

  // if no data was found, create a new one.
  if (getItemResponse.statusCode === 404) {
    const newData = createScheduleItem(userId, scheduleData)
    const createItemResponse = await createUserScheduleItem(cosmosClient, newData)
    return {
      statusCode: 201,
      status: "success",
      data: createItemResponse.resource
    }
  }

  // if data was found, replace the old one with the new one
  const replaceItemResponse = await replaceUserScheduleItem(cosmosClient, userId, {id: userId, schedule: updateSchedule(getItemResponse.resource.schedule, scheduleData)})
  return {
    statusCode: 200,
    status: "success",
    data: replaceItemResponse.resource
  }
}