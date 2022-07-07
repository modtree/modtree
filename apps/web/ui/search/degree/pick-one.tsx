import { Listbox } from '@headlessui/react'
import { IDegree } from '@modtree/types'
import { useState } from 'react'
import { CheckIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'

export function PickOne(props: { degrees: IDegree[] }) {
  const [degree, setDegree] = useState(props.degrees[0])
  return (
    <div className={flatten('ui-rectangle', 'shadow-none', 'h-8 w-64')}>
      <Listbox value={degree} onChange={setDegree}>
        <Listbox.Button className={'h-full w-full'}>
          {degree.title}
        </Listbox.Button>
        <Listbox.Options className={'shadow-lg rounded-md overflow-hidden'}>
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
  )
}
