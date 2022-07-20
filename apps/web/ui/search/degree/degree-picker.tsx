import { Listbox } from '@headlessui/react'
import { CheckIcon, SelectorIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'
import { ApiResponse, UseState } from '@modtree/types'
import { useAppSelector } from '@/store/redux'
import { trpcReact } from '@/utils/trpc'

export function DegreePicker(props: {
  degreeState: UseState<ApiResponse.Degree>
}) {
  const [degree, setDegree] = props.degreeState
  const { user } = useAppSelector((s) => s.modtree)
  const { data: degrees } = trpcReact.useQuery(['degrees', user.savedDegrees])

  /**
   * the thing you press to open the picker
   */
  const ListBoxButton = () => (
    <Listbox.Button className="h-full w-full relative">
      <span className="block truncate">{degree.title}</span>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <SelectorIcon className="h-5 w-5 text-gray-600" />
      </span>
    </Listbox.Button>
  )

  return (
    <div className="ui-rectangle shadow-none h-8 w-64">
      <Listbox value={degree} onChange={setDegree}>
        <ListBoxButton />
        <Listbox.Options className="shadow-lg rounded-md overflow-hidden z-10 relative bg-white">
          {(degrees || []).map((d) => (
            <Listbox.Option key={d.id} value={d}>
              {({ active, selected }) => (
                <div
                  className={flatten(
                    'h-8 cursor-pointer px-3 leading-8',
                    active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                  )}
                >
                  {selected || degree.id === d.id ? <CheckIcon /> : null}{' '}
                  {d.title}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  )
}
