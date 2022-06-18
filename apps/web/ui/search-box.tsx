import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/solid'
import { Dispatch, AnyAction } from 'redux'
import { useDispatch, useSelector } from 'react-redux'
import { ModuleCondensed } from '@modtree/entity'
import {
  clearSearches,
  SearchState,
  setSearchedModuleCondensed,
} from '@/store/search'
import { setModalModule, showModuleModal } from '@/store/modal'

export default function Example() {
  const dispatch = useDispatch()
  /**
   * searches module condensed
   */
  async function handleSearch(dispatch: Dispatch<AnyAction>, value: string) {
    if (value.length === 0) {
      dispatch(clearSearches())
      return
    }
    const upper = value.toUpperCase()
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const url = `${backend}/modulesCondensed/${upper}`
    fetch(url)
      .then((res) => {
        res.json().then((result) => {
          const moduleList: ModuleCondensed[] = result
          dispatch(setSearchedModuleCondensed(moduleList.slice(0, 10)))
        })
      })
      .catch(() => true)
  }

  /**
   * get one full module info
   */
  async function getModuleInfo(dispatch: Dispatch<AnyAction>, value: string) {
    setSelected(value)
    dispatch(showModuleModal())
    console.log('GOT HERE WITH', value)
    if (value.length === 0) return
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const url = `${backend}/modules/${value}`
    fetch(url)
      .then((res) => {
        res.json().then((result) => {
          dispatch(setModalModule(result))
        })
      })
      .catch(() => true)
  }

  const [selected, setSelected] = useState('')
  const { moduleCondensed, hasResults } = useSelector<
    SearchState,
    {
      moduleCondensed: ModuleCondensed[]
      hasResults: boolean
    }
  >((state) => state.search)

  return (
    <div className="fixed top-16 w-72">
      <Combobox
        value={selected}
        onChange={(query) => getModuleInfo(dispatch, query)}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-modtree-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => handleSearch(dispatch, event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
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
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-modtree-300 text-white' : 'text-gray-900'
                      }`
                    }
                    value={module.moduleCode}
                  >
                    <span className="block truncate">
                      <div className="w-28 font-semibold">
                        {module.moduleCode}
                      </div>
                      <div className="opacity-75 flex-1 mr-2 truncate">
                        {module.title}
                      </div>
                    </span>
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
