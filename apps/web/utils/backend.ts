import axios from 'axios'

export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})

export async function fetcher(url: string) {
  return backend.get(url).then((res) => res.data)
}
