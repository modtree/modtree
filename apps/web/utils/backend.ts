import axios from 'axios'
import store from '@/store/redux'
import { clearSearches, setSearchedModule } from '@/store/search'

export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
})

/**
 * searches module condensed
 */
export async function handleSearch(value: string) {
  if (value.length === 0) {
    store.dispatch(clearSearches())
    return
  }
  const upper = value.toUpperCase()
  console.log(upper)
  return backend
    .get(`/search/modules/${upper}`)
    .then((res) => store.dispatch(setSearchedModule(res.data)))
    .catch(() => true)
}
