import { Pages } from 'types'
import { SetState } from '@modtree/types'
import { SettingsSection } from '@/ui/settings/lists/base'
import { text } from 'text'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { useAppSelector } from '@/store/redux'
import { ModuleCondensed } from '@modtree/entity'
import { useEffect, useState } from 'react'
import { backend } from '@/utils/backend'

export function Main(props: { setPage: SetState<Pages['Modules']> }) {
  const user = useAppSelector((state) => state.user)
  const [isLoading, setIsLoading] = useState(true)
  const cachedModulesCondensed = useAppSelector(
    (state) => state.cache.modulesCondensed
  )
  const [modules, setModules] = useState<Record<string, ModuleCondensed>>({})
  const hasModules = {
    done: user.modulesDone.length !== 0,
    doing: user.modulesDoing.length !== 0,
  }
  useEffect(() => {
    const required = [...user.modulesDone, ...user.modulesDoing]
    const existing = new Set(Object.keys(cachedModulesCondensed))
    const toFetch = required.filter((code) => !existing.has(code))
    backend
      .get<ModuleCondensed[]>('/modules-condensed', {
        params: {
          moduleCodes: toFetch,
        },
      })
      .then((res) => {
        const newState = modules
        res.data.forEach((module) => {
          newState[module.moduleCode] = module
        })
        console.log('isLoading', isLoading)
        setModules(newState)
        setIsLoading(false)
      })
  }, [])
  return (
    <>
      <div className="mb-12">
        <SettingsSection
          title="Modules doing"
          addButtonText="Add doing"
          onAddClick={() => props.setPage('add-doing')}
        >
          {hasModules.doing ? (
            <>
              <p>{text.moduleListSection.doing.summary}</p>
              <div className="ui-rectangle flex flex-col overflow-hidden">
                {!isLoading &&
                  user.modulesDoing.map((code, index) => (
                    <Row.Module key={dashed(code, index)}>
                      <span className="font-semibold">{code}</span>
                      <span className="mx-1">/</span>
                      {modules[code]?.title}
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
          onAddClick={() => props.setPage('add-done')}
        >
          {hasModules.done ? (
            <>
              <p>{text.moduleListSection.done.summary}</p>
              <div className="ui-rectangle flex flex-col overflow-hidden">
                {user.modulesDone.map((code, index) => (
                  <Row.Module key={dashed(code, index)}>
                    <span className="font-semibold">{code}</span>
                    <span className="mx-1">/</span>
                    {modules[code].title}
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
