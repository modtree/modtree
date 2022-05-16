import { ReactNode, useEffect, useState } from 'react'
import Search from '../components/Search'
import { H1 } from '../components/Html'
// import axios from 'axios'

export default function SearchPage() {
  const [module, setModule] = useState('')
  // useEffect(() => {
  //   async function getModule() {
  //     const moduleCode = query || "_"
  //     console.log('query ===', query)
  //     const res = await fetch(`/api/module/get/${moduleCode}`)
  //     const data = await res.json()
  //     setModule(data)
  //   }
  //   getModule()
  // }, [])

  const queryState = useState('')
  const [query, setQuery] = queryState
  const [results, setResults] = useState<string[]>([])
  const [ResultsDisplay, setResultsDisplay] = useState<ReactNode[]>([])

  useEffect(() => {
    async function print() {
      const components = results.map((module, i) => (
        <span className="text-amber-50" key={i}>
          {module}
          {i === results.length - 1 ? '' : ', '}
        </span>
      ))
      return components
    }
    print().then((components) => {
      setResultsDisplay(components)
    })
  }, [results])

  return (
    <>
      <H1>Search Page</H1>
      <Search setQuery={setQuery} setResults={setResults} />
      <div className="mt-8 text-gray-600">Console</div>
      <div className="bg-gray-900 py-1 px-2 font-mono rounded-md h-56 overflow-y-hidden">
        <p className="text-amber-50">
          <span className="text-emerald-500">{'> '}</span>
          {query}
        </p>
        {ResultsDisplay}
      </div>
    </>
  )
}
