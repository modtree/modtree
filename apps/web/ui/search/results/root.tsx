import { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { useAppSelector } from '@/store/redux'
import { ModuleCondensed } from '@modtree/entity'

function SearchResult(props: { module: ModuleCondensed }) {
  return (
    <span className="block truncate">
      <div className="w-28 font-semibold">{props.module.moduleCode}</div>
      <div className="opacity-75 flex-1 mr-2 truncate text-sm">
        {props.module.title}
      </div>
    </span>
  )
}

export function SearchResults() {
  const { moduleCondensed, hasResults } = useAppSelector(
    (state) => state.search
  )
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Combobox.Options className="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {moduleCondensed.length === 0 && !hasResults ? (
          <div className="select-none py-2 px-4 text-gray-700">
            Nothing found.
          </div>
        ) : (
          moduleCondensed.map((module) => (
            <Combobox.Option
              key={module.moduleCode}
              className={({ active }) =>
                `cursor-pointer select-none py-2 px-4 ${
                  active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                }`
              }
              value={module.moduleCode}
            >
              <SearchResult module={module} />
            </Combobox.Option>
          ))
        )}
      </Combobox.Options>
    </Transition>
  )
}
