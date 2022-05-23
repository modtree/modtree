import { ModuleCondensed } from 'database'
import { UseState } from '../../types'
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

const SelectedEntry = (props: {
  module: ModuleCondensed
  selectState: UseState<ModuleCondensed[]>
}) => {
  const { module, selectState } = props
  const [selected, setSelected] = selectState
  function removeSelected() {
    const i = selected.indexOf(module)
    quickpop(selected, i)
    setSelected([...selected])
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

export const SelectedDisplay = (props: { selectState: UseState<ModuleCondensed[]> }) => {
  const selected = props.selectState[0]
  return (
    <div className="flex-col">
      {selected.map((m, index) => (
        <SelectedEntry module={m} key={index} selectState={props.selectState} />
      ))}
    </div>
  )
}
