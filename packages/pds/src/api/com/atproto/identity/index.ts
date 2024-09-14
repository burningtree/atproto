import AppContext from '../../../../context'
import { Server } from '../../../../lexicon'
import resolveHandle from './resolveHandle'
import updateHandle from './updateHandle'
import getRecommendedDidCredentials from './getRecommendedDidCredentials'
import requestPlcOperationSignature from './requestPlcOperationSignature'
import signMessage from './signMessage'
import verifyMessage from './verifyMessage'
import signPlcOperation from './signPlcOperation'
import submitPlcOperation from './submitPlcOperation'

export default function (server: Server, ctx: AppContext) {
  resolveHandle(server, ctx)
  updateHandle(server, ctx)
  getRecommendedDidCredentials(server, ctx)
  requestPlcOperationSignature(server, ctx)
  signMessage(server, ctx)
  verifyMessage(server, ctx)
  signPlcOperation(server, ctx)
  submitPlcOperation(server, ctx)
}
