import axios from 'axios'
import { Agent } from 'https'

export const client = axios.create({
  baseURL: 'https://api.nusmods.com/v2/2021-2022/modules/',
  timeout: 60000,
  maxRedirects: 10,
  httpsAgent: new Agent({ keepAlive: true }),
})
