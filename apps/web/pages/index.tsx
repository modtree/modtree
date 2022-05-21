import { ReactNode, useState } from 'react'
import Search from '@/components/Search'
import { H1 } from '@/components/Html'
import { ModuleCondensed } from 'database'
import { ResultDisplay } from '@/components/module-search/Results'

export default function SearchPage() {
  const [results, setResults] = useState<ModuleCondensed[]>([])
  const selectState = useState<string[]>(['meme'])

  const ResultContainer = (props: { children: ReactNode }) => {
    return (
      <div className="px-2 py-1 bg-white rounded-md shadow-md w-full max-w-xl">
        {props.children}
      </div>
    )
  }

  return (
    <>
      <H1>Search Page</H1>
      <Search setResults={setResults} />
      {results.length > 0 ? (
        <div className="flex flex-row justify-center mt-12">
          <ResultContainer>
            <ResultDisplay selectState={selectState} results={results} />
          </ResultContainer>
        </div>
      ) : null}
    </>
  )
}
