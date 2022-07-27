import { Pages } from 'types'
import { Main } from './main'
import { Add } from './add'
import { useState } from 'react'
import { ModuleStatus } from '@modtree/types'

export function ModulesTabContent() {
  const [page, setPage] = useState<Pages['Modules']>('main')
  const component = {
    main: <Main setPage={setPage} />,
    'add-doing': <Add setPage={setPage} targetStatus={ModuleStatus.DOING} />,
    'add-done': <Add setPage={setPage} targetStatus={ModuleStatus.DONE} />,
  }[page]
  return component || <></>
}
