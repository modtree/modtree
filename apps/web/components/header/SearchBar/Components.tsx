import { ReactElement } from 'react'
import { IoChevronForwardSharp, IoSearchSharp } from 'react-icons/io5'
import colors from 'tailwindcss/colors'

export const Prompt = () => (
  <IoChevronForwardSharp color={colors.gray[400]} size={20} className="mx-4" />
)

export const SearchButton = () => (
  <IoSearchSharp color={colors.gray[400]} size={20} className="mx-4" />
)

export const Base = (props: {
  focused: boolean
  hasResults: boolean
  children: ReactElement[]
  bg: string
}) => {
  const transition = 'transition ease-out delay-50'
  const shadow =
    props.focused && !props.hasResults ? 'shadow-lg shadow-gray-300/50' : ''
  const container = 'flex flex-row items-center'
  const border = 'border border-gray-200'
  const round = props.hasResults ? 'rounded-t-xl' : 'rounded-xl'
  const style = `${container} ${border} ${shadow} ${transition} ${round} ${props.bg}`
  return <div className={style}>{props.children}</div>
}
