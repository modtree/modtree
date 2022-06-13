import { Dispatch, Fragment, SetStateAction } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { useSelector } from 'react-redux'
import { ModuleCondensed } from '@modtree/entity'
import { SearchState } from '@/store/search'

export default function ResultEntries(props: {
  setSelected: Dispatch<SetStateAction<string>>
}) {
  const { setSelected } = props
  const { moduleCondensed, hasResults } = useSelector<
    SearchState,
    {
      moduleCondensed: ModuleCondensed[]
      hasResults: boolean
    }
  >((state) => state.search)
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={() => setSelected('')}
    >
      <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
        {moduleCondensed.length === 0 && !hasResults ? (
          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
            Nothing found.
          </div>
        ) : (
          moduleCondensed.map((module) => (
            <Combobox.Option
              key={module.moduleCode}
              className={({ active }) =>
                `relative cursor-pointer select-none py-2 px-4 ${
                  active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                }`
              }
              value={module.moduleCode}
            >
              <span className="block truncate">
                <div className="w-28 font-semibold">{module.moduleCode}</div>
                <div className="opacity-75 flex-1 mr-2 truncate">
                  {module.title}
                </div>
              </span>
            </Combobox.Option>
          ))
        )}
      </Combobox.Options>
    </Transition>
  )
}
