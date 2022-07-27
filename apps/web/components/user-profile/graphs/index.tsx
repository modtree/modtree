import { useState } from 'react'
import { Pages } from 'types'
import { AddNew } from './add-new'
import { Main } from './main'
import { Edit } from './edit'

export function GraphsTabContent() {
  const [page, setPage] = useState<Pages['Graphs']>('main')

  const component = {
    main: <Main setPage={setPage} />,
    'add-new': <AddNew setPage={setPage} />,
    edit: <Edit setPage={setPage} />,
  }[page]
  return component || <></>
}
