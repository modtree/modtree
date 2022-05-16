import { useState } from 'react'
import Search from '../components/Search'
import { H1 } from '../components/Html'

export default function SearchPage() {
  const queryState = useState('')
  const [query, setQuery] = queryState

  return (
    <>
      <H1>Search Page</H1>
      <Search queryState={queryState} />
      <div>{query}</div>
    </>
  )
}
