import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings'

export function SelectedModules(props: {
  cypress?: string
  cypressModule?: string
}) {
  const dispatch = useAppDispatch()
  const {
    cache,
    search: { buildList },
  } = useAppSelector((state) => state)

  return buildList.length === 0 ? null : (
    <div
      className="ui-rectangle flex flex-col overflow-hidden"
      data-cy={props.cypress}
    >
      {buildList.map((code, index) => {
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
            {module?.title}
          </Row.Module>
        )
      })}
    </div>
  )
}
