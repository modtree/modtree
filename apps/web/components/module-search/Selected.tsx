import { ModuleContext } from 'contexts/ModuleContext'
import { ModuleCondensed } from 'database'
import { useContext } from 'react'
// import colors from 'tailwindcss/colors'

/**
 * O(1) delete from unsorted array
 * @param {T[]} arr
 * @param {number} index
 * @return {Module}
 */
export function quickpop<T>(arr: T[], index: number): T {
  if (arr.length === 0) throw new Error('Tried to quickpop an empty array')
  if (index >= arr.length || index < 0) throw new Error('Out of bounds')
  const res = arr[index]
  const elem = arr.pop()
  if (!elem) throw new Error('Quickpop somehow popped an undefined element')
  if (arr.length !== index) arr[index] = elem
  return res
}

export const SelectedDisplay = () => {
  const { moduleCondensedState, moduleCodeState } = useContext(ModuleContext)
  const [selected, setSelected] = moduleCondensedState
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
      setSelected(selected.filter((x) => x.moduleCode !== moduleCode))
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
