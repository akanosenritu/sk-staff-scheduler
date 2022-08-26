import {NextApiHandler} from "next"
import {callGetOnBackend} from "./callBackend"
import {FuncBackendGetGroupsResponse} from "shared/dist/types/funcBackendResponses"
import {unstable_getServerSession} from "next-auth/next"
import {nextAuthOptions} from "../auth/[...nextauth]"

const handler: NextApiHandler = async (req, res) => {
  const session = await unstable_getServerSession(req, res, nextAuthOptions)
  if (session) {
    res.status(200).json(await callGetOnBackend<FuncBackendGetGroupsResponse>("/get-groups"))
  } else {
    res.status(401).json({error: "Unauthorized"})
  }
}

export default handler