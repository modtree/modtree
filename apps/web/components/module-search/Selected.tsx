import { ModuleContext } from 'contexts/ModuleContext'
import { ModuleCondensed } from 'database'
import { useContext, useState } from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

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
    const [closeVisible, setCloseVisible] = useState(false)
    function removeSelected() {
      codes.delete(moduleCode)
      setCodes(new Set(codes))
      setModules(modules.filter((m) => m.moduleCode !== moduleCode))
    }
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10"
        onMouseEnter={() => setCloseVisible(true)}
        onMouseLeave={() => setCloseVisible(false)}
      >
        <div className="w-28 text-gray-600">{moduleCode}</div>
        <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
          {title}
        </div>
        <div className="flex flex-row justify-end items-center h-full w-10">
          {closeVisible ? (
            <div className="h-5 w-5 rounded-sm hover:bg-gray-200 active:bg-gray-300 cursor-pointer">
              <IoCloseSharp
                size={20}
                color={colors.gray[400]}
                onClick={removeSelected}
              />
            </div>
          ) : null}
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
