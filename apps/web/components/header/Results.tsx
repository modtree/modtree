import { ModuleCondensed } from 'database'
import { useSelector } from 'react-redux'
import { SearchState } from '@/store/search'
import { ReactElement } from 'react'

const ResultContainer = (props: {
  children: ReactElement[] | ReactElement
}) => {
  return <div className="flex-col shadow-md rounded-md overflow-hidden">{props.children}</div>
}

/**
 * one entry
 */
const ResultEntry = (props: { module: ModuleCondensed }) => {
  const { module } = props
  const { moduleCode, title } = module
  return (
    <div className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer hover:bg-gray-100">
      <div className="w-28 text-gray-500 font-semibold">{moduleCode}</div>
      <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
        {title}
      </div>
    </div>
  )
}

export default function ResultDisplay() {
  const searchedModuleCondensed = useSelector<SearchState, ModuleCondensed[]>(
    (state) => state.search.moduleCondensed
  )

  /**
   * default return
   */
  return (
    <ResultContainer>
      {searchedModuleCondensed.slice(0, 8).map((m, index) => (
        <ResultEntry module={m} key={index} />
      ))}
    </ResultContainer>
  )
}
