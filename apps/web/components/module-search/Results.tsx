import { ModuleCondensed } from 'database'
import { IoEllipseOutline, IoEllipse } from 'react-icons/io5'
import { useContext } from 'react'
import { ModuleContext } from 'contexts/ModuleContext'
import colors from 'tailwindcss/colors'

const Outline = () => <IoEllipseOutline color={colors.gray[400]} />
const Filled = () => <IoEllipse color={colors.emerald[500]} />

export const ResultDisplay = (props: { results: ModuleCondensed[] }) => {
  const { moduleCondensedState, moduleCodeState } = useContext(ModuleContext)
  const [modules, setModules] = moduleCondensedState
  const [codes, setCodes] = moduleCodeState

  /**
   * checkbox
   */
  const CheckBox = (props: { moduleCode: string }) => (
    <div className="flex flex-col h-full justify-center mr-2">
      {codes.has(props.moduleCode) ? <Filled /> : <Outline />}
    </div>
  )

  /**
   * updater function
   */
  function updateSelected(module: ModuleCondensed) {
    let copy
    if (codes.has(module.moduleCode)) {
      codes.delete(module.moduleCode)
      copy = modules.filter((x) => x.moduleCode !== module.moduleCode)
    } else {
      codes.add(module.moduleCode)
      copy = [...modules, module]
    }
    setModules(copy)
    setCodes(new Set(codes))
  }

  /**
   * one entry
   */
  const ResultEntry = (props: { module: ModuleCondensed }) => {
    const { module } = props
    const { moduleCode, title } = module
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer hover:bg-gray-100"
        onClick={() => updateSelected(module)}
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
      {props.results.slice(0, 10).map((m, index) => (
        <ResultEntry module={m} key={index} />
      ))}
    </div>
  )
}
