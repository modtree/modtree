import { Pages } from 'types'
import { SetState } from '@modtree/types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { setBuildList } from '@/store/search'
import { backend } from '@/utils/backend'
import { useEffect, useState } from 'react'
import { moduleCondensedCache } from '@/utils/modules-condensed-cache'
import { ModuleCondensed } from '@modtree/entity'

export function Main(props: { setPage: SetState<Pages['Modules']> }) {
  const user = useAppSelector((state) => state.user)
  const [cache, setCache] = useState<Record<string, ModuleCondensed>>({})

  useEffect(() => {
    moduleCondensedCache
      .preload([...user.modulesDone, ...user.modulesDoing])
      .then(() => {
        setCache(moduleCondensedCache.getData())
      })
  }, [user.modulesDone, user.modulesDoing])

  const dispatch = useAppDispatch()
  const hasModules = {
    done: user.modulesDone.length !== 0,
    doing: user.modulesDoing.length !== 0,
  }
  return (
    <>
      <div className="mb-12">
        <SettingsSection
          title="Modules doing"
          addButtonColor={hasModules.doing ? 'gray' : 'green'}
          addButtonText={hasModules.doing ? 'Modify' : 'Add doing'}
          onAddClick={() => {
            backend
              .get('/modules-condensed', {
                params: { moduleCodes: user.modulesDoing },
              })
              .then((res) => {
                dispatch(setBuildList(res.data))
              })
            props.setPage('add-doing')
          }}
        >
          {hasModules.doing ? (
            <>
              <p>{text.moduleListSection.doing.summary}</p>
              <div className="ui-rectangle flex flex-col overflow-hidden">
                {user.modulesDoing.map((code, index) => (
                  <Row.Module key={dashed(code, index)}>
                    <span className="font-semibold">{code}</span>
                    <span className="mx-1">/</span>
                    {cache[code]?.title}
                  </Row.Module>
                ))}
              </div>
            </>
          ) : (
            <p>{text.moduleListSection.doing.emptySummary}</p>
          )}
        </SettingsSection>
      </div>
      <div className="mb-12">
        <SettingsSection
          title="Modules done"
          addButtonColor={hasModules.done ? 'gray' : 'green'}
          addButtonText={hasModules.done ? 'Modify' : 'Add done'}
          onAddClick={() => {
            backend
              .get('/modules-condensed', {
                params: { moduleCodes: user.modulesDone },
              })
              .then((res) => {
                dispatch(setBuildList(res.data))
              })
            props.setPage('add-done')
          }}
        >
          {hasModules.done ? (
            <>
              <p>{text.moduleListSection.done.summary}</p>
              <div className="ui-rectangle flex flex-col overflow-hidden">
                {user.modulesDone.map((code, index) => (
                  <Row.Module key={dashed(code, index)}>
                    <span className="font-semibold">{code}</span>
                    <span className="mx-1">/</span>
                    {cache[code]?.title}
                  </Row.Module>
                ))}
              </div>
            </>
          ) : (
            <p>{text.moduleListSection.done.emptySummary}</p>
          )}
        </SettingsSection>
      </div>
    </>
  )
}
