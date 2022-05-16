import type {
  NextApiRequest as Request,
  NextApiResponse as Response,
} from 'next'
import { AppDataSource } from 'database'

export default async function handler(req: Request, res: Response) {
  AppDataSource.initialize().then(() => {

  }).catch((err) => {
    console.log(err)
    console.log('TypeORM failed to initialize connection to database')
  }).finally(() => {
    AppDataSource.destroy()
  })
  const { moduleCode } = req.query
  if (moduleCode === 'CS1010S') {
    res.status(200).json({ requested: moduleCode, cache: 'hit!' })
    return
  }
  res.status(200).json({ requested: moduleCode })
}
