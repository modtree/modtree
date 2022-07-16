import { Pages } from 'types'
import { Main } from './main'
import { AddDone } from './add-done'
import { useState } from 'react'
import { AddDoing } from './add-doing'

export function ModulesTabContent() {
  const [page, setPage] = useState<Pages['Modules']>('main')
  if (page === 'main') {
    return <Main setPage={setPage} />
  }
  if (page === 'add-doing') {
    return <AddDoing setPage={setPage} />
  }
  if (page === 'add-done') {
    return <AddDone setPage={setPage} />
  }
  return <></>
}
