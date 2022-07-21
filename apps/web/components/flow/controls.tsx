import { useReactFlow } from 'react-flow-renderer'
import { PlusIcon, MinusIcon, FitViewIcon } from '@/ui/svgs/flow'
import { flatten } from '@/utils/tailwind'
import { ReactElement } from 'react'
import { useAppDispatch, useAppSelector, r } from '@/store/redux'

const Button = (props: {
  className?: string
  onClick?: () => void
  children?: ReactElement | string
}) => (
  <button
    className={flatten(
      'react-flow__controls-button',
      'fill-gray-700 text-gray-700',
      props.className
    )}
    onClick={() => (props.onClick ? props.onClick() : null)}
  >
    {props.children}
  </button>
)

export function FlowControls() {
  const dispatch = useAppDispatch()
  const moduleStateGuide = useAppSelector((s) => s.modal.showModuleStateGuide)
  const { fitView, zoomIn, zoomOut } = useReactFlow()
  return (
    <div className="react-flow__controls">
      {moduleStateGuide ? null : (
        <Button onClick={() => dispatch(r.showModuleStateGuide())}>?</Button>
      )}
      <Button onClick={zoomIn}>
        <PlusIcon />
      </Button>
      <Button onClick={zoomOut}>
        <MinusIcon />
      </Button>
      <Button onClick={() => fitView({ maxZoom: 1 })}>
        <FitViewIcon />
      </Button>
    </div>
  )
}
