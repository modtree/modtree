import { ModuleContext } from 'contexts/ModuleContext'
import { ModuleCondensed } from 'database'
import { useContext } from 'react'
// import colors from 'tailwindcss/colors'

export const SelectedDisplay = () => {
  const { moduleCondensedState, moduleCodeState } = useContext(ModuleContext)
  const [modules, setModules] = moduleCondensedState
  const [codes, setCodes] = moduleCodeState
  /**
   * one selected entry
   */
  const SelectedEntry = (props: { module: ModuleCondensed }) => {
    const { module } = props
    const { moduleCode, title } = module
    function removeSelected() {
      codes.delete(moduleCode)
      setCodes(new Set(codes))
      setModules(modules.filter((m) => m.moduleCode !== moduleCode))
    }
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer"
        onClick={removeSelected}
      >
        <div className="w-28 text-gray-600">{moduleCode}</div>
        <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
          {title}
        </div>
      </div>
    )
  }

  /**
   * final return
   */
  return (
    <div className="flex-col">
      {moduleCondensedState[0].map((m, index) => (
        <SelectedEntry module={m} key={index} />
      ))}
    </div>
  )
}
