import { useState } from 'react'
import { Pages } from 'types'
import { AddNew } from './add-new'
import { Main } from './main'
import { Edit } from './edit'

export function GraphsTabContent() {
  const [page, setPage] = useState<Pages['Graphs']>('main')
  if (page === 'main') {
    return <Main setPage={setPage} />
  }
  if (page === 'add-new') {
    return <AddNew setPage={setPage} />
  }
  if (page === 'edit') {
    return <Edit setPage={setPage} />
  }
  return <></>
}
