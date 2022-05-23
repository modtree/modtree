import { ModuleCondensed } from 'database'
import { IoEllipseOutline, IoEllipse } from 'react-icons/io5'
import { useContext } from 'react'
import { ModuleContext } from 'contexts/ModuleContext'
import colors from 'tailwindcss/colors'

const Outline = () => <IoEllipseOutline color={colors.gray[400]} />
const Filled = () => <IoEllipse color={colors.emerald[500]} />

export const ResultDisplay = (props: { results: ModuleCondensed[] }) => {
  const { selectedState, codesState } = useContext(ModuleContext)
  const [selected, setSelected] = selectedState
  const [codes, setCodes] = codesState
  const disp = (selected: Set<ModuleCondensed>) =>
    Array.from(selected).map((x) => x.moduleCode)

  /**
   * checkbox
   */
  const CheckBox = (props: { module: ModuleCondensed }) => {
    console.log(codes)
    return (
      <div className="flex flex-col h-full justify-center mr-2">
        {codes.has(props.module.moduleCode) ? <Filled /> : <Outline />}
      </div>
    )
  }

  /**
   * updater function
   */
  function updateSelected(module: ModuleCondensed) {
    if (codes.has(module.moduleCode)) {
      codes.delete(module.moduleCode)
    } else { 
      codes.add(module.moduleCode)
    }
    setCodes(new Set(codes))
    if (selected.has(module)) {
      selected.delete(module)
    } else {
      selected.add(module)
    }
    setSelected(new Set(selected))
  }

  /**
   * one entry
   */
  const ResultEntry = (props: { module: ModuleCondensed }) => {
    const { module } = props
    const on: boolean = selected.has(module)
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer"
        onClick={() => updateSelected(module)}
      >
        <CheckBox module={module} />
        <div className="w-28 text-gray-600">{module.moduleCode}</div>
        <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
          {module.title}
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
