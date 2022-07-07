import { Listbox, Switch } from '@headlessui/react'
import { IDegree } from '@modtree/types'
import { useState } from 'react'
import { CheckIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'

export function PickOne(props: { degrees: IDegree[] }) {
  const [degree, setDegree] = useState(props.degrees[0])
  const [pullAll, setPullAll] = useState(true)
  return (
    <div className="flex-col space-y-2">
      <div className={flatten('ui-rectangle', 'shadow-none', 'h-8 w-64')}>
        <Listbox value={degree} onChange={setDegree}>
          <Listbox.Button className={'h-full w-full'}>
            {degree.title}
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
    </div>
  )
}
