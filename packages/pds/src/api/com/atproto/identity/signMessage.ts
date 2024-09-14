import assert from 'node:assert'

import { check } from '@atproto/common'
import { InvalidRequestError } from '@atproto/xrpc-server'

import AppContext from '../../../../context'
import { Server } from '../../../../lexicon'
import { ids } from '../../../../lexicon/lexicons'
import { resultPassthru } from '../../../proxy'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.identity.signMessage({
    auth: ctx.authVerifier.accessFull(),
    handler: async ({ auth, input }) => {
      if (ctx.entrywayAgent) {
        assert(ctx.cfg.entryway)
        return resultPassthru(
          await ctx.entrywayAgent.com.atproto.identity.signMessage(
            input.body,
            await ctx.serviceAuthHeaders(
              auth.credentials.did,
              ctx.cfg.entryway.did,
              ids.ComAtprotoIdentitySignMessage,
            ),
          ),
        )
      }
      const { message } = input.body

      const messageBytes = new TextEncoder().encode(auth.credentials.did + "\n" + message)
      const sigBytes = await ctx.plcRotationKey.sign(messageBytes)
      const sigHex = Buffer.from(sigBytes).toString('hex')

      return {
        encoding: 'application/json',
        body: {
          sig: sigHex,
        },
      }
    },
  })
}
