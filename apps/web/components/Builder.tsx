import { ReactNode, useEffect, useState } from 'react'
import { ModuleCondensed } from 'database'
import { ResultDisplay } from '@/components/builder/Results'
import { SelectedDisplay } from '@/components/builder/Selected'
import { useSelector, useDispatch } from 'react-redux'
import { BuilderState, clearBuilderModules, hideBuilder } from '@/store/builder'
import Search from '@/components/Search'
import { Modal } from './Views'

export function BuilderLogic() {
  const [results, setResults] = useState<ModuleCondensed[]>([])
  const dispatch = useDispatch()
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
      <div className="flex flex-row justify-center overflow-y-hidden">
        <div className="w-1/4 bg-white mr-6 rounded-md shadow-md mb-4">
          <div className="flex flex-row">
            <h2 className="px-4 py-3 text-xl tracking-tight font-semibold text-gray-500 flex-1">
              Module List
            </h2>
            <div className="flex flex-col justify-center mr-4 tracking-normal">
              <div
                className="text-gray-400 rounded-md px-1.5 hover:bg-gray-200 cursor-pointer active:bg-gray-300"
                onClick={() => dispatch(clearBuilderModules())}
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

export default function Builder() {
  const dispatch = useDispatch()
  return (
    <Modal onDismiss={() => dispatch(hideBuilder())}>
      <div className="h-screen w-screen max-w-[50%] max-h-[60%] bg-white rounded-lg shadow-lg">builder</div>
    </Modal>
  )
}
