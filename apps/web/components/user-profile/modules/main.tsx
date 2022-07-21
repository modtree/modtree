import { Pages } from 'types'
import { SetState } from '@modtree/types'
import { SettingsSection, Row } from '@/ui/settings'
import { text } from 'text'
import { dashed } from '@/utils/array'
import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { useEffect } from 'react'
import { updateModuleCache } from '@/store/functions'

export function Main(props: { setPage: SetState<Pages['Modules']> }) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.modtree.user)
  const cache = useAppSelector((state) => state.cache)

  /**
   * update the cache with required modules
   */
  useEffect(() => {
    updateModuleCache([...user.modulesDone, ...user.modulesDoing])
  }, [user.modulesDone, user.modulesDoing])

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
            dispatch(r.setBuildList(user.modulesDoing))
            props.setPage('add-doing')
          }}
          cypress="modify-doing"
        >
          {hasModules.doing ? (
            <>
              <p>{text.moduleListSection.doing.summary}</p>
              <div
                data-cy="doing-section"
                className="ui-rectangle flex flex-col overflow-hidden"
              >
                {user.modulesDoing.map((code, index) => {
                  const module = cache.modules[code]
                  return (
                    <Row.Module key={dashed(code, index)}>
                      <span className="font-semibold" data-cy="doing-module">
                        {code}
                      </span>
                      <span className="mx-1">/</span>
                      {module && module.title}
                    </Row.Module>
                  )
                })}
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
            dispatch(r.setBuildList(user.modulesDone))
            props.setPage('add-done')
          }}
          cypress="modify-done"
        >
          {hasModules.done ? (
            <>
              <p>{text.moduleListSection.done.summary}</p>
              <div
                data-cy="done-section"
                className="ui-rectangle flex flex-col overflow-hidden"
              >
                {user.modulesDone.map((code, index) => {
                  const module = cache.modules[code]
                  return (
                    <Row.Module key={dashed(code, index)}>
                      <span className="font-semibold" data-cy="done-module">
                        {code}
                      </span>
                      <span className="mx-1">/</span>
                      {module && module.title}
                    </Row.Module>
                  )
                })}
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
