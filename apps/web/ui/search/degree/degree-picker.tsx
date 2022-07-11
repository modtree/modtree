import { Listbox } from '@headlessui/react'
import { IDegree, UseState } from '@modtree/types'
import { CheckIcon, SelectorIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'
import { flatten as flat } from '@modtree/utils'
import { useEffect, useState } from 'react'

export function DegreePicker(props: {
  degrees: IDegree[]
  select: UseState<IDegree>
  modulesDoneCodes: string[]
  modulesDoingCodes: string[]
}) {
  const [degree, setDegree] = props.select
  const [remainingCodes, setRemainingCodes] = useState([])

  /**
   * Filters away modulesDone and modulesDoing from degree.modules,
   * and combines into a comma separated string of module codes.
   */
  async function getRemainingModuleCodes(degree: IDegree): Promise<string[]> {
    return degree.modules
      .map(flat.module)
      .filter(
        (m) =>
          !props.modulesDoneCodes.includes(m) &&
          !props.modulesDoingCodes.includes(m)
      )
  }

  useEffect(() => {
    getRemainingModuleCodes(degree).then((codes) => {
      setRemainingCodes(codes)
    })
  }, [degree])

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
      <div className="bg-gray-200 p-2 rounded-xl">
        <p>
          The following remaining degree modules will be placed in the graph:
        </p>
        <p className="mb-0">{remainingCodes.join(', ')}</p>
      </div>
    </div>
  )
}
