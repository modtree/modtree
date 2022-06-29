import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0'
import { NextApiRequest, NextApiResponse } from 'next'
import { api } from 'api'

const afterCallback = async (
  _req: NextApiRequest,
  _res: NextApiResponse,
  session: Session
) => {
  return api.user
    .login(session.user.sub, session.user.email)
    .then((user) => {
      session.user.modtree = user
      return session
    })
    .catch((err) => {
      console.log(err)
      console.log('User not found. Own time own target carry on.')
      return session
    })
}

export default handleAuth({
  async callback(req, res) {
    try {
      await handleCallback(req, res, { afterCallback })
    } catch (error) {
      res.status(error.status || 500).end(error.message)
    }
  },
})
