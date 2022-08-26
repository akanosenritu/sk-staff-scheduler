import {NextApiHandler} from "next"
import {callGetOnBackend} from "../callBackend"
import {unstable_getServerSession} from "next-auth/next"
import {nextAuthOptions} from "../../auth/[...nextauth]"
import {FuncBackendGetUserSchedulesByGroupResponse} from "shared/dist/types/funcBackendResponses"

const handler: NextApiHandler = async (req, res) => {
  let {groupId} = req.query
  if (!groupId) {
    res.status(400).json({error: "groupId was not provided."})
    return
  } else if (Array.isArray(groupId)) {
    if (groupId.length === 1) {
      groupId = groupId[0]
    } else {
      res.status(400).json({error: "multiple groupIds were provided."})
      return
    }
  }
  const session = await unstable_getServerSession(req, res, nextAuthOptions)
  if (session) {
    res.status(200).json(await callGetOnBackend<FuncBackendGetUserSchedulesByGroupResponse>(`/get-user-schedules-by-group/${groupId}`))
  } else {
    res.status(401).json({error: "Unauthorized"})
  }
}

export default handler