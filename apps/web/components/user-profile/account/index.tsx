import { Pages } from 'types'
import { useEffect, useState } from 'react'
import { Main } from './main'
import { useAppDispatch, r } from '@/store/redux'

export function AccountTabContent() {
  const [page, setPage] = useState<Pages['Account']>('main')

  /* clear degree modules on page change */
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(r.clearBuildList())
  }, [page])

  const component = {
    main: <Main setPage={setPage} />,
  }[page]
  return component || <></>
}
