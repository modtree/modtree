import { ReactNode, useState } from 'react'
import Search from '@/components/Search'
import { ModuleCondensed } from 'database'
import { ResultDisplay } from '@/components/module-search/Results'
import { SelectedDisplay } from '@/components/module-search/Selected'
import { ModuleProvider } from 'contexts/ModuleContext'

export default function SearchPage() {
  const [results, setResults] = useState<ModuleCondensed[]>([])
  const selectState = useState<ModuleCondensed[]>([])

  const ResultContainer = (props: { children: ReactNode }) => {
    return (
      <div className="px-2 py-1 bg-white rounded-md shadow-md w-full">
        {props.children}
      </div>
    )
  }

  const SelectedContainer = (props: { children: ReactNode }) => {
    return (
      <div className="bg-white bg-green-100 rounded-md shadow-md w-full">
        {props.children}
      </div>
    )
  }

  return (
    <ModuleProvider>
      <h1 className="text-4xl mt-12 mb-12 font-semibold tracking-normal text-gray-700">
        modtree
      </h1>
      <div className="flex flex-row justify-center overflow-y-hidden">
        <div className="w-1/4 bg-white mr-4 rounded-md shadow-md mb-4 min-h-[20rem]">
          <h2 className="px-4 py-3 text-xl tracking-tight font-semibold text-gray-500">
            Module List
          </h2>
          <SelectedContainer>
            <SelectedDisplay selectState={selectState} />
          </SelectedContainer>
        </div>
        <div className="mb-4 w-full max-w-xl">
          <Search setResults={setResults} />
          {results.length > 0 ? (
            <div className="flex flex-row justify-center mt-6">
              <ResultContainer>
                <ResultDisplay results={results} />
              </ResultContainer>
            </div>
          ) : null}
        </div>
      </div>
    </ModuleProvider>
  )
}
