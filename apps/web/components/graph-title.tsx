import { useAppSelector } from '@/store/redux'
import { flatten } from 'utils'
import { GraphPicker } from '@/ui/search/graph/graph-picker'

export function FloatingGraphTitle() {
  const mainGraph = useAppSelector((s) => s.modtree.graph)

  const className = flatten(
    // top center
    'absolute top-4 w-64 h-8 m-auto left-0 right-0',
    'select-none bg-white shadow-md rounded-xl'
  )

  return mainGraph && mainGraph.id !== '' ? (
    <div className={className}>
      <GraphPicker />
    </div>
  ) : (
    <></>
  )
}
