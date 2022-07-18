import { Panel, ModalPanelProps } from './panel'
import { Base, ModalBaseProps } from './base'
import { useAppDispatch } from '@/store/redux'
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit'

type ModalProps = Omit<ModalBaseProps & ModalPanelProps, 'closeModal'> & {
  hideAction: ActionCreatorWithoutPayload
  cypressCloseButton?: string
}

export default function Modal(props: ModalProps) {
  const dispatch = useAppDispatch()
  const {
    showState,
    hideAction,
    closeButton,
    scrollable,
    className,
    children,
    minHeight,
    cypressCloseButton,
  } = props

  const closeModal = () => dispatch(hideAction())

  return (
    <Base showState={showState} closeModal={closeModal}>
      <Panel
        closeModal={closeModal}
        closeButton={closeButton}
        scrollable={scrollable}
        className={className}
        minHeight={minHeight}
        cypressCloseButton={cypressCloseButton}
      >
        {children}
      </Panel>
    </Base>
  )
}
