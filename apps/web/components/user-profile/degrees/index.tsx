import { Pages } from 'types'
import { useEffect, useState } from 'react'
import { Main } from './main'
import { AddNew } from './add-new'
import { Edit } from './edit'
import { useAppDispatch, r } from '@/store/redux'

export function DegreesTabContent() {
  const [page, setPage] = useState<Pages['Degrees']>('main')

  /* clear degree modules on page change */
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(r.clearBuildList())
  }, [page])

  const component = {
    main: <Main setPage={setPage} />,
    'add-new': <AddNew setPage={setPage} />,
    edit: <Edit setPage={setPage} />,
  }[page]
  return component || <></>
}
