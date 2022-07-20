import { Listbox } from '@headlessui/react'
import { ApiResponse } from '@modtree/types'
import { CheckIcon, SelectorIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'
import { getUniqueGraphTitle } from '@/utils/graph'
import { setMainGraph } from '@/store/modtree'
import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { trpcReact } from '@/utils/trpc'

export function GraphPicker() {
  /** hooks */
  const dispatch = useAppDispatch()
  const {
    graph: { selectedCodes, ...graph },
    user,
  } = useAppSelector((s) => s.modtree)
  const { data: graphs } = trpcReact.useQuery(['graphs', user.savedGraphs])
  const [selectedGraph, setSelectedGraph] = useState(graph)

  /**
   * on selection change, update the displayed entry and set the main graph
   */
  const onChange = (graph: ApiResponse.Graph) => {
    setSelectedGraph(graph)
    dispatch(setMainGraph(graph))
  }

  /**
   * the thing you press to open the picker
   */
  const ListBoxButton = () => (
    <Listbox.Button className="h-full w-full relative">
      <span className="block truncate">
        {getUniqueGraphTitle(selectedGraph)}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <SelectorIcon className="h-5 w-5 text-gray-600" />
      </span>
    </Listbox.Button>
  )

  return graphs ? (
    <Listbox value={selectedGraph} onChange={onChange}>
      <ListBoxButton />
      <Listbox.Options className="shadow-lg rounded-md overflow-hidden z-10 relative bg-white">
        {graphs.map((g) => (
          <Listbox.Option key={g.id} value={g}>
            {({ active, selected }) => (
              <div
                className={flatten(
                  'h-8 cursor-pointer px-3 leading-8',
                  active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                )}
              >
                {selected || selectedGraph.id === g.id ? <CheckIcon /> : null}{' '}
                {getUniqueGraphTitle(g)}
              </div>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  ) : null
}
