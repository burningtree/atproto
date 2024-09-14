import { AtpAgent } from '@atproto/api'
import { InvalidRequestError } from '@atproto/xrpc-server'
import * as ident from '@atproto/syntax'
import { Server } from '../../../../lexicon'
import AppContext from '../../../../context'
import { verifySignature } from '@atproto/crypto'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.identity.verifyMessage(async ({ params }) => {

    const didDoc = await ctx.plcClient.getDocumentData(params.did)
    const messageBytes = new TextEncoder().encode(params.message)
    const sigBytes = new Uint8Array(Buffer.from(params.sig, 'hex'))
    const valid = await verifyMessage(didDoc.rotationKeys, messageBytes, sigBytes)

    return {
      encoding: 'application/json',
      body: { valid },
    }
  })
}

async function verifyMessage(keys: string[], messageBytes: Uint8Array, sigBytes: Uint8Array) {
  for (const key of keys) {
    const isValid = await verifySignature(key, messageBytes, sigBytes)
    if (isValid) {
      return true
    }
  }
  return false
}