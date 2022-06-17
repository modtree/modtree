import { handleAuth, handleCallback, Session } from '@auth0/nextjs-auth0'
import axios from 'axios'
import { NextApiRequest, NextApiResponse } from 'next'

const afterCallback = async (
  _req: NextApiRequest,
  _res: NextApiResponse,
  session: Session
) => {
  const backend = process.env.NEXT_PUBLIC_BACKEND
  return axios
    .post(`${backend}/users/login`, {
      authZeroId: session.user.sub,
      email: session.user.email,
    })
    .then((res) => {
      console.log(res)
      session.user.modtree = res.data
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
