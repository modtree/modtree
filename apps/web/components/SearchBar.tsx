import { useState } from 'react'
import { IoChevronForwardSharp, IoSearchSharp } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { clearSearches, setSearchedModuleCondensed } from '@/store/search'
import colors from 'tailwindcss/colors'
import { Input } from './Html'
import { ModuleCondensed } from 'database'

const Prompt = () => (
  <IoChevronForwardSharp color={colors.gray[400]} size={20} className="mx-4" />
)

const SearchButton = () => (
  <IoSearchSharp color={colors.gray[400]} size={20} className="mx-4" />
)

export default function SearchBar() {
  const dispatch = useDispatch()
  const displayState = useState('')

  /**
   * talk to backend
   */
  async function handleQuery(value: string) {
    if (value.length === 0) {
      // empty queries are really slow
      dispatch(clearSearches())
      return
    }
    const upper = value.toUpperCase()
    const backend = process.env.NEXT_PUBLIC_BACKEND
    const url = `${backend}/modules/${upper}`
    fetch(url).then((res) => {
      res.json().then((json) => {
        const moduleList: ModuleCondensed[] = json.result
        dispatch(setSearchedModuleCondensed(moduleList))
      })
    })
  }

  const bg = 'bg-white'
  const shadow = 'shadow-md focus:shadow-none transition ease-out'
  return (
    <div
      className={`flex flex-row items-center mx-2 w-96 rounded-md border border-gray-200 ${shadow} ${bg}`}
    >
      <Prompt />
      <Input
        displayState={displayState}
        className={`flex-1 text-sm h-12 ${bg}`}
        callback={handleQuery}
      />
      <SearchButton />
    </div>
  )
}
