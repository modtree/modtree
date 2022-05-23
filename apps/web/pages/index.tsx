import { ReactNode, useContext, useState } from 'react'
import Search from '@/components/Search'
import { ModuleCondensed } from 'database'
import { ResultDisplay } from '@/components/module-search/Results'
import { SelectedDisplay } from '@/components/module-search/Selected'
import { ModuleContext, ModuleProvider } from 'contexts/ModuleContext'

export default function Wrapper() {
  return (
    <ModuleProvider>
      <SearchPage />
    </ModuleProvider>
  )
}

function SearchPage() {
  const [results, setResults] = useState<ModuleCondensed[]>([])
  const { moduleCondensedState, moduleCodeState } = useContext(ModuleContext)
  const setModules = moduleCondensedState[1]
  const setCodes = moduleCodeState[1]

  const clearModules = () => {
    console.log('clearModules')
    setModules([])
    setCodes(new Set())
  }

  const ResultContainer = (props: { children: ReactNode }) => {
    return (
      <div className="px-2 py-1 bg-white rounded-md shadow-md w-full">
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
              <div className="text-gray-400 rounded-md px-1.5 hover:bg-gray-200 cursor-pointer active:bg-gray-300" onClick={clearModules}>
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
