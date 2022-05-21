import { ReactNode, useState } from 'react'
import Search from '@/components/Search'
import { H1, H2 } from '@/components/Html'
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
      <H1>modtree</H1>
      <div className="flex flex-row overflow-y-hidden">
        <div className='w-1/4 bg-gray-200 mr-4'>
          <h2 className="px-4 py-3 text-xl tracking-tight font-medium text-gray-700">Module List</h2>
        </div>
        <div className='flex-1 mb-4'>
          <Search setResults={setResults} />
          {results.length > 0 ? (
            <div className="flex flex-row justify-center mt-12">
              <ResultContainer>
                <ResultDisplay selectState={selectState} results={results} />
              </ResultContainer>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}
