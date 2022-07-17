import store, { useAppSelector } from '@/store/redux'
import { trpc } from '@/utils/trpc'
import { ModtreeApiResponse } from '@modtree/types'
import { useEffect, useState } from 'react'
import { flatten } from '../utils'
import { GraphPicker } from '@/ui/search/graph/graph-picker'

export function FloatingGraphTitle() {
  // Get IDs
  const graphIds = useAppSelector((state) => state.user.savedGraphs)

  // Load graphs
  const [graphs, setGraphs] = useState<ModtreeApiResponse.Graph[]>([])
  // placeholder state
  // updated correctly in useEffect
  const state = {
    graph: useState<ModtreeApiResponse.Graph>(graphs[0]),
  }

  useEffect(() => {
    trpc.query('graphs', graphIds).then((graphs) => {
      setGraphs(graphs)
      // mainGraph is different from graphs
      // mainGraph has an extra property selectedCodes
      // removing that property is still not enough for React to check equality
      const mainGraph = store.getState().graph
      const graph = graphs.find((g) => g.id === mainGraph.id)
      if (graph) state.graph[1](graph)
    })
  }, [graphIds])

  const className = flatten(
    // top center
    'absolute top-4 w-64 h-8 m-auto left-0 right-0',
    'select-none bg-white shadow-md rounded-xl'
  )

  return state.graph[0] && state.graph[0].id !== '' ? (
    <div className={className}>
      <GraphPicker graphs={graphs} select={state.graph} />
    </div>
  ) : (
    <></>
  )
}
