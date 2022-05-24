import { HeaderOverlay } from '@/components/Views'

function SearchBar() {
  return (
    <div
      className="w-96 h-12 mx-2 bg-white rounded-md border border-gray-200"
      onClick={() => console.log('clicked on me')}
    >
      <span>hello there what is up</span>
    </div>
  )
}

export default function Header() {
  return (
    <HeaderOverlay>
      <SearchBar />
    </HeaderOverlay>
  )
}
