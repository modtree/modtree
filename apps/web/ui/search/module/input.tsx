import { flatten } from '@/utils/tailwind'
import { Combobox } from '@headlessui/react'
import { SearchIcon } from '@/ui/icons'
import { trpcReact } from '@/utils/trpc'
import { useAppDispatch } from '@/store/redux'
import { setSearchedModule } from '@/store/search'
import { useEffect, useState } from 'react'

export function SearchInput(props: {
  inputClass?: string
  inputContainerClass?: string
  searchIcon?: boolean
  cypress?: string
}) {
  const { inputClass, inputContainerClass } = props
  const [query, setQuery] = useState('')
  const dispatch = useAppDispatch()

  const res = trpcReact.useQuery(['search/modules', query])

  useEffect(() => {
    if (res && res.data) {
      dispatch(setSearchedModule(res.data || []))
    }
  }, [res])

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
          data-cy={props.cypress}
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
