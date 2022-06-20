import { flatten } from '@/utils/tailwind'
import { XIcon } from '@heroicons/react/outline'

export const CloseButton = (props: { close: () => void; bg?: string }) => {
  const bg = props.bg ? ' ' + props.bg : ''
  return (
    <div className={flatten('w-6 h-6 absolute right-6', bg)}>
      <button
        className={flatten(
          'h-full w-full rounded-md',
          'hover:bg-gray-200 active:bg-gray-300',
          'flex flex-row centered'
        )}
        onClick={props.close}
        id="module-modal-close-button"
      >
        <XIcon className="text-gray-600 h-5 w-5" />
      </button>
    </div>
  )
}
