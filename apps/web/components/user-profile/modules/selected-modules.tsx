import { useAppDispatch } from '@/store/redux'
import { removeFromBuildList } from '@/store/search'
import { dashed } from '@/utils/array'
import { Row } from '@/ui/settings/lists/rows'
import { IModule } from '@modtree/types'

export function SelectedModules(props: { modules: IModule[] }) {
  const dispatch = useAppDispatch()
  return (
    <>
      {props.modules.length !== 0 && (
        <div className="ui-rectangle flex flex-col overflow-hidden">
          {props.modules.map((module, index) => (
            <Row.Module
              key={dashed(module.moduleCode, index)}
              deletable
              onDelete={() => dispatch(removeFromBuildList(module))}
            >
              <span className="font-semibold">{module.moduleCode}</span>
              <span className="mx-1">/</span>
              {module.title}
            </Row.Module>
          ))}
        </div>
      )}
    </>
  )
}
