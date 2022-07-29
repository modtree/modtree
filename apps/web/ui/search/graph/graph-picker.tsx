import { Listbox } from '@headlessui/react'
import { ApiResponse } from '@modtree/types'
import { CheckIcon, SelectorIcon } from '@/ui/icons'
import { cc } from '@/utils/tailwind'
import { getUniqueGraphTitle } from '@/utils/graph'
import { useAppSelector, r, useAppDispatch } from '@/store/redux'
import { trpcReact } from '@/utils/trpc'

export function GraphPicker() {
  /** hooks */
  const user = useAppSelector((s) => s.modtree.user)
  const graph = useAppSelector((s) => s.graph)
  const dispatch = useAppDispatch()
  const trpc = trpcReact.useContext()
  const { data: graphs } = trpcReact.useQuery(
    ['graphs', { graphIds: user.savedGraphs }],
    {
      keepPreviousData: true,
      onSuccess: (graphs) => {
        const match = graphs.find((g) => g.id === graph.id)
        if (match) dispatch(r.setMainGraph(match))
      },
    }
  )
  const setMain = trpcReact.useMutation(['user/set-main-graph'])

  /**
   * on selection change, update the displayed entry and set the main graph
   */
  const onChange = (graph: ApiResponse.Graph) => {
    setMain.mutate(
      { userId: user.id, graphId: graph.id },
      {
        onSuccess: () => {
          trpc.invalidateQueries(['graphs'])
          trpc.invalidateQueries(['user'])
        },
      }
    )
    dispatch(r.setMainGraph(graph))
  }

  /**
   * the thing you press to open the picker
   */
  const ListBoxButton = () => (
    <Listbox.Button className="h-full w-full relative">
      <span className="block truncate">{getUniqueGraphTitle(graph)}</span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <SelectorIcon className="h-5 w-5 text-gray-600" />
      </span>
    </Listbox.Button>
  )

  return (
    <Listbox value={graph} onChange={onChange}>
      <ListBoxButton />
      <Listbox.Options className="shadow-lg rounded-md overflow-hidden z-10 relative bg-white">
        {(graphs || []).map((g) => (
          <Listbox.Option key={g.id} value={g}>
            {({ active, selected }) => (
              <div
                className={cc(
                  'h-8 cursor-pointer px-3 leading-8',
                  active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                )}
              >
                {selected || graph.id === g.id ? <CheckIcon /> : null}{' '}
                {getUniqueGraphTitle(g)}
              </div>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  )
}
