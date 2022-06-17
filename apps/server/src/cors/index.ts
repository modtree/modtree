import type { CorsOptions } from 'cors'

const origins = ['https://modtree.vercel.app', 'http://localhost:3000']

export const corsOpts: CorsOptions = {
  origin: [...origins],
}
