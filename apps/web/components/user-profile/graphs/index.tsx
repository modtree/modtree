import { useState } from 'react'
import { Pages } from 'types'
import { AddNew } from './add-new'
import { Main } from './main'

export function GraphsTabContent() {
  const [page, setPage] = useState<Pages['Graphs']>('add-new')
  if (page === 'main') {
    return <Main setPage={setPage} />
  }
  if (page === 'add-new') {
    return <AddNew setPage={setPage} />
  }
}
