import { Fragment } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { useAppSelector } from '@/store/redux'
import { flatten } from '@/utils/tailwind'
import { dashed } from '@/utils/array'
import { IModule, UseState } from '@modtree/types'

function SearchResult(props: { module: IModule }) {
  return (
    <span className="block truncate">
      <div className="w-28 font-semibold">{props.module.moduleCode}</div>
      <div className="opacity-75 flex-1 mr-2 truncate text-sm">
        {props.module.title}
      </div>
    </span>
  )
}

function SearchResultList(props: { modules: IModule[] }) {
  if (props.modules.length === 0) {
    return (
      <div className="select-none py-2 px-4 text-gray-700">Nothing found.</div>
    )
  }
  return (
    <>
      {props.modules.map((module, index) => (
        <Combobox.Option
          key={dashed(module.moduleCode, index)}
          value={module.moduleCode}
          className={({ active }) =>
            flatten(
              'cursor-pointer select-none py-2 px-4',
              active ? 'bg-modtree-300 text-white' : 'text-gray-900'
            )
          }
          data-cy="search-result"
        >
          <SearchResult module={module} />
        </Combobox.Option>
      ))}
    </>
  )
}

export function SearchResultContainer() {
  const searchResults = useAppSelector((state) => state.search.module)
  return (
    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Combobox.Options
        className={flatten(
          'w-full mt-1 max-h-60 overflow-auto rounded-md bg-white',
          'shadow-lg focus:outline-none'
        )}
      >
        <SearchResultList modules={searchResults} />
      </Combobox.Options>
    </Transition>
  )
}
