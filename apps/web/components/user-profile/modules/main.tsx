import { Pages } from 'types'
import { SetState } from '@modtree/types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { useAppDispatch, useAppSelector } from '@/store/redux'
import { useEffect } from 'react'
import { updateCachedModulesCondensed } from '@/utils/backend'
import { clearBuildList, setBuildList } from '@/store/search'

export function Main(props: { setPage: SetState<Pages['Modules']> }) {
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const cachedModulesCondensed = useAppSelector(
    (state) => state.cache.modulesCondensed
  )
  const hasModules = {
    done: user.modulesDone.length !== 0,
    doing: user.modulesDoing.length !== 0,
  }
  useEffect(() => {
    const required = [...user.modulesDone, ...user.modulesDoing]
    const existing = new Set(Object.keys(cachedModulesCondensed))
    const toFetch = required.filter((code) => !existing.has(code))
    updateCachedModulesCondensed(dispatch, toFetch)
  }, [user.modulesDone, user.modulesDoing])
  return (
    <>
      <div className="mb-12">
        <SettingsSection
          title="Modules doing"
          addButtonText="Add doing"
          onAddClick={() => {
            dispatch(clearBuildList())
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
                    {cachedModulesCondensed[code]?.title}
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
          addButtonText="Add done"
          onAddClick={() => {
            dispatch(
              setBuildList(
                user.modulesDone.map((code) => cachedModulesCondensed[code])
              )
            )
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
                    {cachedModulesCondensed[code].title}
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
