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
