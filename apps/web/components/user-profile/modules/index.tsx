import { Pages } from 'types'
import { Main } from './main'
import { useState } from 'react'

export function ModulesTabContent() {
  const [page, setPage] = useState<Pages['Modules']>('main')
  if (page === 'main') {
    return <Main setPage={setPage} />
  }
  if (page === 'add-doing') {
    return <Main setPage={setPage} />
  }
  if (page === 'add-done') {
    return <Main setPage={setPage} />
  }
}
