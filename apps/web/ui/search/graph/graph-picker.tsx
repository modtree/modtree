import { Listbox } from '@headlessui/react'
import { UseState, ModtreeApiResponse } from '@modtree/types'
import { CheckIcon, SelectorIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'
import { getUniqueGraphTitle } from '@/utils/graph'
import { setGraph as setMainGraph } from '@/store/graph'
import { useEffect } from 'react'
import { api } from 'api'
import { useUser } from '@/utils/auth0'
import { updateUser } from '@/utils/rehydrate'
import { useAppDispatch } from '@/store/redux'

export function GraphPicker(props: {
  graphs: ModtreeApiResponse.Graph[]
  select: UseState<ModtreeApiResponse.Graph>
}) {
  const { user } = useUser()
  const [graph, setGraph] = props.select
  const dispatch = useAppDispatch()

  useEffect(() => {
    api.user.setMainGraph(user.modtreeId, graph.id).then(() => updateUser())
    dispatch(setMainGraph(graph))
  }, [graph])

  return (
    <div className={flatten('ui-rectangle', 'shadow-none', 'h-8 w-64')}>
      <Listbox value={graph} onChange={setGraph}>
        <Listbox.Button className="h-full w-full relative">
          <span className="block truncate">{getUniqueGraphTitle(graph)}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon className="h-5 w-5 text-gray-600" />
          </span>
        </Listbox.Button>
        <Listbox.Options
          className={
            'shadow-lg rounded-md overflow-hidden z-10 relative bg-white'
          }
        >
          {props.graphs.map((g) => {
            const title = getUniqueGraphTitle(g)
            return (
              <Listbox.Option key={g.id} value={g}>
                {({ active, selected }) => (
                  <li
                    className={`${flatten(
                      'h-8 cursor-pointer px-3 leading-8',
                      active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                    )}`}
                  >
                    {selected && <CheckIcon />} {title}
                  </li>
                )}
              </Listbox.Option>
            )
          })}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}
