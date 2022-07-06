import { Pages } from 'types'
import { useState } from 'react'
import { Main } from './main'
import { AddNew } from './add-new'
import { Edit } from './edit'

export function DegreesTabContent() {
  const [page, setPage] = useState<Pages['Degrees']>('main')
  if (page === 'main') {
    return <Main setPage={setPage} />
  }
  if (page === 'add-new') {
    return <AddNew setPage={setPage} />
  }
  if (page === 'edit') {
    return <Edit setPage={setPage} />
  }
}
