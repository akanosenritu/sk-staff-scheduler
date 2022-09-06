import {CosmosClient, ItemResponse} from "@azure/cosmos"
import {CosmosDBScheduleItem} from "../../types"

export const getUserScheduleItem = async (client: CosmosClient, userId: string): Promise<ItemResponse<CosmosDBScheduleItem>> => {
  // retrieve the user's schedule
  const item = client
    .database("schedules")
    .container("Container")
    .item(userId)
  return item.read<CosmosDBScheduleItem>()
}

export const replaceUserScheduleItem = async (client: CosmosClient, userId: string, data: CosmosDBScheduleItem): Promise<ItemResponse<CosmosDBScheduleItem>> => {
  return await client
    .database("schedules")
    .container("Container")
    .item(userId)
    .replace<CosmosDBScheduleItem>(data)
}

export const createUserScheduleItem = async (client: CosmosClient, data: CosmosDBScheduleItem): Promise<ItemResponse<CosmosDBScheduleItem>> => {
  return await client
    .database("schedules")
    .container("Container")
    .items
    .create<CosmosDBScheduleItem>(data)
}

export const upsertUserScheduleItem = async (client: CosmosClient, userId: string, data: CosmosDBScheduleItem): Promise<ItemResponse<CosmosDBScheduleItem>> => {
  if (userId !== data.id) throw new Error(`given userId and id of data don't match: userId: ${userId}, data's id: ${data.id}`)

  return await client
    .database("schedules")
    .container("Container")
    .items
    .upsert<CosmosDBScheduleItem>(data)
}