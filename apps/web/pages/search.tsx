import { useEffect, useState } from 'react'
import Search from '../components/Search'
import { H1 } from '../components/Html'

export default function SearchPage() {
  const [data, setData] = useState('')
  useEffect(() => {
    async function getData() {
      const res = await fetch('/api/helloworld')
      const data = await res.json()
      setData(data)
    }
    getData()
  }, [])
  const queryState = useState('')
  const [query, setQuery] = queryState
  console.log(data)

  return (
    <>
      <H1>Search Page</H1>
      <Search queryState={queryState} />
      <div>{query}</div>
      <div>{data.name}</div>
    </>
  )
}
