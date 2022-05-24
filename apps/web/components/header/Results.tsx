import { ModuleCondensed } from 'database'
import { useSelector } from 'react-redux'
import { SearchState } from '@/store/search'
import { useEffect } from 'react'

export default function ResultDisplay() {
  const searchedModuleCondensed = useSelector<SearchState, ModuleCondensed[]>(
    (state) => state.search.moduleCondensed
  )
  console.log('got here')
  useEffect(() => {
    console.log('results component', searchedModuleCondensed[0])
  }, [searchedModuleCondensed])

  /**
   * one entry
   */
  const ResultEntry = (props: { module: ModuleCondensed }) => {
    const { module } = props
    const { moduleCode, title } = module
    return (
      <div className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer hover:bg-gray-100">
        <div className="w-28 text-gray-600">{moduleCode}</div>
        <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
          {title}
        </div>
      </div>
    )
  }

  /**
   * default return
   */
  return (
    <div className="flex-col">
      {searchedModuleCondensed.slice(0, 10).map((m, index) => (
        <ResultEntry module={m} key={index} />
      ))}
    </div>
  )
}
