import { ReactElement, useState } from 'react'
import { IoChevronForwardSharp, IoSearchSharp } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { clearSearches, setSearchedModuleCondensed } from '@/store/search'
import colors from 'tailwindcss/colors'
import { Input } from '@/components/Html'
import { ModuleCondensed } from 'database'
import { flatten } from '@/utils/tailwind'

const Prompt = () => (
  <IoChevronForwardSharp color={colors.gray[400]} size={20} className="mx-4" />
)

const SearchButton = () => (
  <IoSearchSharp color={colors.gray[400]} size={20} className="mx-4" />
)

const Base = (props: { focused: boolean, children: ReactElement[]; bg: string }) => {
  const transition = 'transition ease-out delay-100'
  const shadow = props.focused ? 'shadow-md' : ''
  const border = 'border border-gray-200'
  const container = 'flex flex-row items-center rounded-md'
  const style = `${container} ${border} ${shadow} ${transition} ${props.bg}`
  return <div className={style}>{props.children}</div>
}

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
  const [focused, setFocused] = useState(false)
  return (
    <Base focused={focused} bg={bg}>
      <Prompt />
      <Input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        displayState={displayState}
        className={flatten('flex-1 text-sm h-12', bg)}
        callback={handleQuery}
      />
      <SearchButton />
    </Base>
  )
}
