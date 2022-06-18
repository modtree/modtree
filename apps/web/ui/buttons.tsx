import { XIcon } from '@heroicons/react/outline'

export const CloseButton = (props: { close: () => void; bg?: string }) => {
  const bg = props.bg ? ' ' + props.bg : ''
  const hover = ' hover:bg-gray-200 active:bg-gray-300 cursor-pointer'
  const center = ' flex flex-row justify-center items-center'
  const className = 'h-full rounded-md' + hover + center
  const base = 'w-6 h-6 absolute right-6' + bg
  return (
    <div className={base}>
      <div
        className={className}
        onClick={props.close}
        id="module-modal-close-button"
      >
        <XIcon className="text-gray-600 h-5 w-5" />
      </div>
    </div>
  )
}
