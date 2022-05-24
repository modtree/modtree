import {
  Dispatch as ReactDispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { IoChevronForwardSharp, IoSearchSharp } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import {
  clearSearches,
  SearchState,
  setSearchedModuleCondensed,
} from '@/store/search'
import colors from 'tailwindcss/colors'
import { Input } from '@/components/Html'
import { ModuleCondensed } from 'database'
import { flatten } from '@/utils/tailwind'
import { AnyAction, Dispatch } from 'redux'
import { UseState } from 'types'

const Prompt = () => (
  <IoChevronForwardSharp color={colors.gray[400]} size={20} className="mx-4" />
)

const SearchButton = () => (
  <IoSearchSharp color={colors.gray[400]} size={20} className="mx-4" />
)

const Base = (props: {
  focused: boolean
  hasResults: boolean
  children: ReactElement[]
  bg: string
}) => {
  const transition = 'transition ease-out delay-50'
  const shadow = props.focused ? 'shadow-md' : ''
  const container = 'flex flex-row items-center'
  const border = 'border border-gray-200'
  const round = props.hasResults ? 'rounded-md' : 'rounded-t-md'
  const style = `${container} ${border} ${shadow} ${transition} ${round} ${props.bg}`
  return <div className={style}>{props.children}</div>
}

/**
 * talk to backend
 */
async function handleQuery(
  dispatch: Dispatch<AnyAction>,
  value: string,
  reload: UseState<boolean>
) {
  if (value.length === 0) {
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
      reload[1](!reload[0])
    })
  })
}

export default function SearchBar() {
  const dispatch = useDispatch()
  const displayState = useState('')
  const hasResults =
    useSelector<SearchState, ModuleCondensed[]>(
      (state) => state.search.moduleCondensed
    ).length === 0

  const bg = 'bg-white'
  const [focused, setFocused] = useState(false)
  const reload = useState(false)

  useEffect(() => {
    if (displayState[0].length === 0) {
      dispatch(clearSearches())
    }
  }, [reload[0]])
  return (
    <Base focused={focused} bg={bg} hasResults={hasResults}>
      <Prompt />
      <Input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        displayState={displayState}
        className={flatten('flex-1 text-sm h-12', bg)}
        callback={(e) => handleQuery(dispatch, e, reload)}
      />
      <SearchButton />
    </Base>
  )
}
