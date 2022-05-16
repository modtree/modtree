import type {
  NextApiRequest as Request,
  NextApiResponse as Response,
} from 'next'

export default function handler(req: Request, res: Response) {
  res.status(200).json({ name: 'John Doe' })
}
