import { HeaderOverlay } from '@/components/Views'
import { ReactElement } from 'react'
import SearchBar from './search-bar'
import Results from './results'

const SearchArea = (props: { children: ReactElement[] | ReactElement }) => {
  return <div className="mx-2 w-96">{props.children}</div>
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
