import { ReactNode, useEffect, useState } from 'react'
import Search from '@/components/Search'
import { ModuleCondensed } from 'database'
import { ResultDisplay } from '@/components/module-search/Results'
import { SelectedDisplay } from '@/components/module-search/Selected'
import { useSelector } from 'react-redux'
import { BuilderState } from '@/store/builder'

export default function Wrapper() {
  return (
      <SearchPage />
  )
}

function SearchPage() {
  const [results, setResults] = useState<ModuleCondensed[]>([])
  const builderSelection = useSelector<BuilderState, ModuleCondensed[]>(
    (state) => state.builder.moduleCondensed
  )

  useEffect(() => {
    console.log('builder selection:', builderSelection)
  }, [builderSelection])

  const ResultContainer = (props: { children: ReactNode }) => {
    return (
      <div className="bg-white rounded-md shadow-md w-full rounded-md overflow-hidden">
        {props.children}
      </div>
    )
  }

  const SelectedContainer = (props: { children: ReactNode }) => {
    return (
      <div className="bg-white rounded-md shadow-md w-full overflow-y-scroll h-[40rem]">
        {props.children}
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-4xl mt-12 mb-12 font-semibold tracking-normal text-gray-700">
        modtree
      </h1>
      <div className="flex flex-row justify-center overflow-y-hidden">
        <div className="w-1/4 bg-white mr-6 rounded-md shadow-md mb-4">
          <div className="flex flex-row">
            <h2 className="px-4 py-3 text-xl tracking-tight font-semibold text-gray-500 flex-1">
              Module List
            </h2>
            <div className="flex flex-col justify-center mr-4 tracking-normal">
              <div
                className="text-gray-400 rounded-md px-1.5 hover:bg-gray-200 cursor-pointer active:bg-gray-300"
              >
                clear
              </div>
            </div>
          </div>
          <SelectedContainer>
            <SelectedDisplay />
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
    </div>
  )
}
