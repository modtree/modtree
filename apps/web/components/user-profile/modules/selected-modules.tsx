import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings'

export function SelectedModules(props: {
  modules: string[]
  cypress?: string
  cypressModule?: string
}) {
  const dispatch = useAppDispatch()
  const cache = useAppSelector((state) => state.cache)
  return (
    <>
      {props.modules.length !== 0 && (
        <div
          className="ui-rectangle flex flex-col overflow-hidden"
          data-cy={props.cypress}
        >
          {props.modules.map((code, index) => {
            const module = cache.modules[code]
            return (
              <Row.Module
                key={dashed(code, index)}
                deletable
                onDelete={() => dispatch(r.removeFromBuildList(code))}
              >
                <span data-cy={props.cypressModule} className="font-semibold">
                  {code}
                </span>
                <span className="mx-1">/</span>
                {module && module.title}
              </Row.Module>
            )
          })}
        </div>
      )}
    </>
  )
}
