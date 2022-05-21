import { ModuleCondensed } from 'database'
import { IoEllipseOutline, IoCheckmarkCircleSharp } from 'react-icons/io5'
import colors from 'tailwindcss/colors'
import { UseState } from '../../types'

function updateSelected(moduleCode: string, selectState: UseState<string[]>) {
  const [selected, setSelected] = selectState
  const curr = [...selected]
  if (curr.includes(moduleCode)) {
    setSelected(curr.filter((x) => x !== moduleCode))
  } else {
    curr.push(moduleCode)
    setSelected(curr)
  }
}

const CheckBox = (props: { moduleCode?: string; on: () => boolean }) => {
  return (
    <div className="flex flex-col h-full justify-center mr-2">
      {props.on() ? (
        <IoCheckmarkCircleSharp color={colors.emerald[500]} />
      ) : (
        <IoEllipseOutline color={colors.gray[400]} />
      )}
    </div>
  )
}

const ResultEntry = (props: { module: ModuleCondensed, selectState: UseState<string[]> }) => {
  const { module, selectState } = props
  const selected = selectState[0]
  const on = (): boolean => selected.includes(module.moduleCode)
  return (
    <div
      className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer"
      onClick={() => updateSelected(module.moduleCode, selectState)}
    >
      <CheckBox on={on} />
      <div className="w-28 text-gray-600">{module.moduleCode}</div>
      <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
        {module.title}
      </div>
    </div>
  )
}

export const ResultDisplay = (props: {
  selectState: UseState<string[]>
  results: ModuleCondensed[]
}) => {
  return (
    <div className="flex-col">
      {props.results.slice(0, 10).map((m, index) => (
        <ResultEntry module={m} key={index} selectState={props.selectState} />
      ))}
    </div>
  )
}
