import { ReactNode, useState } from 'react'
import Search from '../components/Search'
import { H1 } from '../components/Html'
import { ModuleCondensed } from 'database'
import { IoEllipseOutline } from 'react-icons/io5'

/**
 * O(1) delete from unsorted array
 * @param {T[]} arr
 * @param {number} index
 * @return {Module}
 */
function quickpop<T>(arr: T[], index: number): T | void {
  if (arr.length === 0) return
  const res = arr[index]
  const elem = arr.pop()
  if (!res || !elem) return
  if (arr.length !== index) arr[index] = elem
  return res
}

export default function SearchPage() {
  const [results, setResults] = useState<ModuleCondensed[]>([])
  const [selected, setSelected] = useState<string[]>(['meme'])

  const ResultContainer = (props: { children: ReactNode }) => {
    return (
      <div className="px-2 py-1 bg-white rounded-md shadow-md w-full max-w-xl">
        {props.children}
      </div>
    )
  }

  const CheckBox = (props: { moduleCode?: string; on: () => boolean }) => {
    return (
      <div className="flex flex-col h-full justify-center mr-2">
        {props.on() ? (
          <div className="w-4 h-4 bg-emerald-500 rounded-full" />
        ) : (
          <IoEllipseOutline />
        )}
      </div>
    )
  }

  function updateSelected(moduleCode: string) {
    const curr = [...selected]
    if (curr.includes(moduleCode)) {
      setSelected(curr.filter((x) => x !== moduleCode))
    } else {
      curr.push(moduleCode)
      setSelected(curr)
    }
  }

  const ResultEntry = (props: { module: ModuleCondensed }) => {
    const { module } = props
    const on = (): boolean => selected.includes(module.moduleCode)
    return (
      <div
        className="border-b last:border-b-0 bg-white flex flex-row py-2 px-3 font-medium h-10 cursor-pointer"
        onClick={() => updateSelected(module.moduleCode)}
      >
        <CheckBox on={on} />
        <div className="w-28 text-gray-600">{module.moduleCode}</div>
        <div className="text-gray-400 flex-1 mr-2 whitespace-nowrap overflow-hidden text-ellipsis break-all">
          {module.title}
        </div>
      </div>
    )
  }

  const ResultDisplay = () => {
    console.log('result display refresh')
    return (
      <div className="flex-col">
        {results.slice(0, 10).map((m, index) => (
          <ResultEntry module={m} key={index} />
        ))}
      </div>
    )
  }

  return (
    <>
      <H1>Search Page</H1>
      <Search setResults={setResults} />
      <div className="mt-8 text-gray-600">List</div>
      <div className="flex flex-row justify-center">
        <ResultContainer>
          <ResultDisplay />
        </ResultContainer>
      </div>
    </>
  )
}
