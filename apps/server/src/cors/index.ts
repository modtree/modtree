import type { CorsOptions } from 'cors'

const origins = [
  'https://modtree.vercel.app',
  'http://localhost:3000',
  'http://localhost',
]

export const corsOpts: CorsOptions = {
  origin: [...origins],
}
