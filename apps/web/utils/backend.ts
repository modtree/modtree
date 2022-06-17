import axios from 'axios'

export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})
