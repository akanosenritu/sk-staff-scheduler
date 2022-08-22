import {User} from "./user"

export type Group = {
  id: string,
  displayName: string,
  description: string,
  mail: string,
  members: User[]
}
