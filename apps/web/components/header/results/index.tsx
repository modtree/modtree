import { ModuleCondensed } from '@modtree/entity'
import { useSelector } from 'react-redux'
import { SearchState } from '@/store/search'
import { ResultContainer, ResultEntry } from './components'

export default function ResultDisplay() {
  const { moduleCondensed, hasResults } = useSelector<
    SearchState,
    {
      moduleCondensed: ModuleCondensed[]
      hasResults: boolean
    }
  >((state) => state.search)

  /**
   * default return
   */
  return (
    <ResultContainer hasResults={hasResults}>
      {moduleCondensed.slice(0, 8).map((m, index) => (
        <ResultEntry module={m} key={index} />
      ))}
    </ResultContainer>
  )
}
