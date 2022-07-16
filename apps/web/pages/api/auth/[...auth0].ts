import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { trpc } from '@/utils/trpc'

const afterCallback = async (
  _req: NextApiRequest,
  _res: NextApiResponse,
  session: Session
) => {
  const opts = { authZeroId: session.user.sub, email: session.user.email }
  return trpc
    .mutation('user/login', opts)
    .then((user) => ({
      ...session,
      user: { ...session.user, modtreeId: user.id },
    }))
    .catch((err) => {
      console.debug(err, 'Auth0 login callback: User not found.')
      return session
    })
}

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error: any) {
      res.status(error.status || 500).end(error.message)
    }
  },
})
