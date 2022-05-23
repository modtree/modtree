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
  const { selectedState, codesState } = useContext(ModuleContext)
  const [selected, setSelected] = selectedState
  const [codes, setCodes] = codesState
  /**
   * one selected entry
   */
  const SelectedEntry = (props: { module: ModuleCondensed }) => {
    const { module } = props
    function removeSelected() {
      console.log('remove', module.moduleCode)
      console.log(selected, codes)
      const code = module.moduleCode
      codes.delete(code)
      const copy = selected.filter((x) => x.moduleCode !== code)
      setCodes(new Set(codes))
      setSelected(copy)
    }
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer"
        onClick={() => removeSelected()}
      >
        <div className="w-28 text-gray-600">{module.moduleCode}</div>
        <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
          {module.title}
        </div>
      </div>
    )
  }

  /**
   * final return
   */
  return (
    <div className="flex-col">
      {selectedState[0].map((m, index) => (
        <SelectedEntry module={m} key={index} />
      ))}
    </div>
  )
}
