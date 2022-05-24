import { HeaderOverlay } from '@/components/Views'
import { ReactElement } from 'react'
import SearchBar from './SearchBar'

const SearchArea = (props: { children: ReactElement[] | ReactElement }) => {
  return <div className='mx-2 w-96'>{props.children}</div>
}

const Results = () => {
  return <div className="relative left-0 h-96 bg-green-100"></div>
}

export default function Header() {
  return (
    <HeaderOverlay>
      <SearchArea>
        <SearchBar />
        <Results />
      </SearchArea>
    </HeaderOverlay>
  )
}
