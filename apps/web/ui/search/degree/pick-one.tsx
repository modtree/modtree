import { Listbox, Switch } from '@headlessui/react'
import { IDegree, UseState } from '@modtree/types'
import { CheckIcon, SelectorIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'

export function PickOne(props: {
  degrees: IDegree[]
  select: UseState<IDegree>
  pull: UseState<boolean>
}) {
  const [degree, setDegree] = props.select
  const [pullAll, setPullAll] = props.pull
  return (
    <div className="flex-col space-y-2">
      <div className={flatten('ui-rectangle', 'shadow-none', 'h-8 w-64')}>
        <Listbox value={degree} onChange={setDegree}>
          <Listbox.Button className="h-full w-full relative">
            <span className="block truncate">{degree.title}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon className="h-5 w-5 text-gray-600" />
            </span>
          </Listbox.Button>
          <Listbox.Options
            className={
              'shadow-lg rounded-md overflow-hidden z-10 relative bg-white'
            }
          >
            {props.degrees.map((d) => (
              <Listbox.Option key={d.id} value={d}>
                {({ active, selected }) => (
                  <li
                    className={`${flatten(
                      'h-8 cursor-pointer px-3 leading-8',
                      active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                    )}`}
                  >
                    {selected && <CheckIcon />} {d.title}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
      <Switch.Group>
        <div className="flex items-center space-x-2">
          <Switch
            checked={pullAll}
            onChange={setPullAll}
            className={`${pullAll ? 'bg-modtree-300' : 'bg-gray-300'}
              relative inline-flex h-[26px] w-[58px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span
              aria-hidden="true"
              className={`${pullAll ? 'translate-x-8' : 'translate-x-0'}
                pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
          </Switch>
          <Switch.Label>Insert degree required modules into graph</Switch.Label>
        </div>
      </Switch.Group>
      {pullAll && (
        <div className="bg-gray-200 p-2 rounded-xl">
          <p>The following modules will be placed in the graph:</p>
          <p className="mb-0">
            {degree.modules.map((m) => m.moduleCode).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}