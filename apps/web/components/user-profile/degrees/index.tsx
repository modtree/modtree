import { DegreeSummary, Pages } from 'types'
import { useState } from 'react'
import { Main } from './main'
import { AddNew } from './add-new'

const degreeContent: DegreeSummary[] = [
  { title: 'computer-science', graphCount: 4 },
  { title: 'mathematics', graphCount: 420 },
]

export function DegreesTabContent() {
  const [page, setPage] = useState<Pages['Degrees']>('main')
  if (page === 'main') {
    return <Main setPage={setPage} content={degreeContent} />
  }
  if (page === 'add-new') {
    return <AddNew setPage={setPage} />
  }
}
