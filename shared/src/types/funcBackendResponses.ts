import {Group} from "./group"
import {CosmosDBScheduleItem} from "./schedule"
import {User} from "./user"

export type FuncBackendGetGroupsResponse = {
  status: "success",
  groups: Group[]
}

export type FuncBackendGetUserSchedulesByGroupResponse = {
  status: "success",
  schedules: CosmosDBScheduleItem[],
  users: User[]
}