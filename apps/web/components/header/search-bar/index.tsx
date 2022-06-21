import { useState } from 'react'
import { Combobox } from '@headlessui/react'
import { SearchIcon } from '@heroicons/react/solid'
import { useAppDispatch } from '@/store/redux'
import { handleSearch, getModuleInfo } from './lib'
import ResultEntries from './entries'

export default function SearchBar() {
  const dispatch = useAppDispatch()
  const [selected, setSelected] = useState('')

  return (
    <div className="fixed top-3 left-3 w-72">
      <Combobox
        value={selected}
        onChange={(query) =>
          getModuleInfo(dispatch, query, [selected, setSelected])
        }
      >
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-modtree-300">
            <Combobox.Input
              className="h-10 w-full border-none py-2 pl-3 pr-10 leading-5 text-gray-900 focus:ring-0"
              onChange={(event) => handleSearch(dispatch, event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <SearchIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <ResultEntries setSelected={setSelected} />
        </div>
      </Combobox>
    </div>
  )
}
