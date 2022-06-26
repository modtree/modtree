import { NextApiResponse } from 'next'
import { backend } from '@/utils/backend'
import { IncomingMessage } from 'http'

/* eslint-disable @typescript-eslint/no-explicit-any */
interface NextApiRequest extends IncomingMessage {
  query: { entity: string; params: string[] }
  cookies: { [key: string]: string }
  body: any
}

const valid = {
  entities: [
    'users',
    'degrees',
    'graphs',
    'modules',
    'modules-condensed',
    'user',
    'degree',
    'graph',
    'module',
    'module-condensed',
    'search',
  ],
  actions: [],
}

function validateEntity(entity: string, res: NextApiResponse) {
  if (!valid.entities.includes(entity)) {
    res.json({ message: 'invalid entity' })
    return false
  }
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { entity, params } = req.query
  if (!validateEntity(entity, res)) return
  const paramString = params.join('/')

  return backend({
    url: `${entity}/${paramString}`,
    method: req.method,
    data: req.body,
  })
    .then((backendRes) => res.json(backendRes.data))
    .catch((err) => res.json(err))
}
