import type { CorsOptions } from 'cors'
import { authZeroIpAddresses } from './auth0'

const origins = ['https://modtree.vercel.app', 'http://localhost:3000']

export const corsOpts: CorsOptions = {
  origin: [...authZeroIpAddresses, ...origins],
}
