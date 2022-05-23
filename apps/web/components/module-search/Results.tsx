import { ModuleCondensed } from 'database'
import { IoEllipseOutline, IoEllipse } from 'react-icons/io5'
import { useContext } from 'react'
import { ModuleContext } from 'contexts/ModuleContext'
import colors from 'tailwindcss/colors'

const Outline = () => <IoEllipseOutline color={colors.gray[400]} />
const Filled = () => <IoEllipse color={colors.emerald[500]} />

const CheckBox = (props: { moduleCode?: string; on: () => boolean }) => {
  return (
    <div className="flex flex-col h-full justify-center mr-2">
      {props.on() ? <Filled /> : <Outline />}
    </div>
  )
}

export const ResultDisplay = (props: { results: ModuleCondensed[] }) => {
  const { selectedState } = useContext(ModuleContext)
  const [selected, setSelected] = selectedState

  /**
   * updater function
   */
  function updateSelected(module: ModuleCondensed) {
    console.log('clicked on', module.moduleCode)
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
    const on = (): boolean => selected.has(module)
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer"
        onClick={() => updateSelected(module)}
      >
        <CheckBox on={on} />
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
