import type {
  NextApiRequest as Request,
  NextApiResponse as Response,
} from 'next'

export default function handler(req: Request, res: Response) {
  const { moduleCode } = req.query
  if (moduleCode ==='CS1010S') {
    res.status(200).json({ requested: moduleCode, cache: "hit!" })
    return
  }
  res.status(200).json({ requested: moduleCode })
}
