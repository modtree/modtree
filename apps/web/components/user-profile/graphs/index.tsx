import { Pages } from 'types'
import { useState } from 'react'
import { Main } from './main'

export function GraphsTabContent() {
  const [page, setPage] = useState<Pages['Graphs']>('main')
  if (page === 'main') {
    return <Main setPage={setPage} />
  }
}
