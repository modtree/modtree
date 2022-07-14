import { useAppDispatch, useAppSelector } from '@/store/redux'
import { removeFromBuildList } from '@/store/search'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'

export function SelectedModules(props: { modules: string[] }) {
  const dispatch = useAppDispatch()
  const cache = useAppSelector((state) => state.cache)
  return (
    <>
      {props.modules.length !== 0 && (
        <div className="ui-rectangle flex flex-col overflow-hidden">
          {props.modules.map((code, index) => {
            const module = cache.modules[code]
            return (
              <Row.Module
                key={dashed(code, index)}
                deletable
                onDelete={() => dispatch(removeFromBuildList(code))}
              >
                <span className="font-semibold">{code}</span>
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
