import {Group} from "./group"

export type FuncBackendGetGroupsResponse = {
  status: "success",
  groups: Group[]
}