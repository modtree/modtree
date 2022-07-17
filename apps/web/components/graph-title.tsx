import { useAppSelector } from '@/store/redux'
import { getUniqueGraphTitle } from '@/utils/graph'
import { flatten } from '../utils'

export function FloatingGraphTitle() {
  const mainGraph = useAppSelector((state) => state.graph)

  const className = flatten(
    // top center
    'absolute top-4 w-72 h-8 m-auto left-0 right-0',
    'select-none bg-white shadow-md rounded-xl',
    'flex justify-center items-center'
  )

  return mainGraph.id !== '' ? (
    <div className={className}>
      <span className="">{getUniqueGraphTitle(mainGraph)}</span>
    </div>
  ) : (
    <></>
  )
}
