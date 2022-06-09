import { ModuleCondensed } from '@modtree/database'
import { IoEllipseOutline, IoEllipse } from 'react-icons/io5'
import { BuilderState, toggleBuilderModule } from '@/store/builder'
import { useDispatch, useSelector } from 'react-redux'
import colors from 'tailwindcss/colors'
import { SearchState } from '@/store/search'
import { useEffect } from 'react'

const Outline = () => <IoEllipseOutline color={colors.gray[400]} />
const Filled = () => <IoEllipse color={colors.emerald[500]} />

export const ResultDisplay = () => {
  const dispatch = useDispatch()
  const selectedCodes = useSelector<BuilderState, ModuleCondensed[]>(
    (state) => state.builder.moduleCondensed
  ).map((x) => x.moduleCode)
  const searchedModuleCondensed = useSelector<SearchState, ModuleCondensed[]>(
    (state) => state.search.moduleCondensed
  )
  useEffect(() => {
    console.log('results component', searchedModuleCondensed[0])
  }, [searchedModuleCondensed])

  /**
   * checkbox
   */
  const CheckBox = (props: { moduleCode: string }) => (
    <div className="flex flex-col h-full justify-center mr-2">
      {selectedCodes.includes(props.moduleCode) ? <Filled /> : <Outline />}
    </div>
  )

  /**
   * one entry
   */
  const ResultEntry = (props: { module: ModuleCondensed }) => {
    const { module } = props
    const { moduleCode, title } = module
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer hover:bg-gray-100"
        onClick={() => dispatch(toggleBuilderModule(module))}
      >
        <CheckBox moduleCode={moduleCode} />
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
