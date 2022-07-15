import { flatten } from '@/utils/tailwind'
import { Combobox } from '@headlessui/react'
import { AnyAction } from 'redux'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { SearchIcon } from '@/ui/icons'
import { trpc } from '@/utils/trpc'
import { useState } from 'react'
import { useAppDispatch } from '@/store/redux'
import { setSearchedModule } from '@/store/search'

export function SearchInput<T>(props: {
  hideResults?: boolean
  inputClass?: string
  inputContainerClass?: string
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<T[], string>
  searchIcon?: boolean
}) {
  const { inputClass, inputContainerClass } = props
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch()

  const res = trpc.useQuery(['search/modules', query])
  if (res) {
    dispatch(setSearchedModule(res.data || []))
  }

  return (
    <>
      <div
        className={flatten(
          'flex flex-row',
          'rounded-lg bg-white shadow-md focus:outline-none',
          inputContainerClass
        )}
      >
        <Combobox.Input
          className={flatten(
            'flex-1 bg-inherit border-none pl-3 focus:outline-none',
            inputClass
          )}
          placeholder="Search for a module"
          onChange={(event) => setQuery(event.target.value)}
        />
        {props.searchIcon && (
          <Combobox.Button className="flex items-center px-3">
            <SearchIcon className="text-gray-400" px={18} aria-hidden="true" />
          </Combobox.Button>
        )}
      </div>
    </>
  )
}
