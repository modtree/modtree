import { AppDispatch } from '@/store/redux'
import { flatten } from '@/utils/tailwind'
import { Combobox } from '@headlessui/react'
import { handleSearch } from '@/utils/backend'
import { AnyAction } from 'redux'
import { ActionCreatorWithOptionalPayload } from '@reduxjs/toolkit'
import { SearchIcon } from '@/ui/icons'

export function SearchInput<T>(props: {
  dispatch: AppDispatch
  hideResults?: boolean
  inputClass?: string
  containerClass?: string
  clear: () => AnyAction
  set: ActionCreatorWithOptionalPayload<T[], string>
}) {
  const { dispatch, inputClass, containerClass } = props
  return (
    <>
      <div
        className={flatten(
          'flex flex-row',
          'rounded-lg bg-white shadow-md focus:outline-none',
          containerClass
        )}
      >
        <Combobox.Input
          className={flatten(
            'flex-1 bg-inherit border-none pl-3 focus:outline-none',
            inputClass
          )}
          onChange={(event) =>
            handleSearch({
              clear: props.clear,
              set: props.set,
              dispatch,
              value: event.target.value,
            })
          }
        />
        <Combobox.Button className="flex items-center px-3">
          <SearchIcon className="text-gray-400" px={18} aria-hidden="true" />
        </Combobox.Button>
      </div>
    </>
  )
}
