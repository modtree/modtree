import { useEffect, useState } from 'react'
import Search from '../components/Search'
import { H1 } from '../components/Html'
// import axios from 'axios'

export default function SearchPage() {
  const [module, setModule] = useState('')
  useEffect(() => {
    async function getModule() {
      const moduleCode = 'CS1010S'
      const res = await fetch(`/api/module/get/${moduleCode}`)
      const data = await res.json()
      setModule(data)
    }
    getModule()
  }, [])
  const queryState = useState('')
  const [query, setQuery] = queryState
  console.log(module)

  return (
    <>
      <H1>Search Page</H1>
      <Search queryState={queryState} />
      <div className='mt-8 text-gray-600'>Console</div>
      <div className="bg-white py-1 px-2 font-mono">
        <span className='text-emerald-500'>{'> '}</span>
        {query}
      </div>
    </>
  )
}
