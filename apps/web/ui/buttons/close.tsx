import { cc } from '@/utils/tailwind'
import { CloseIcon } from '@/ui/icons'

export const CloseButton = (props: {
  close: () => void
  cypressCloseButton?: string
}) => (
  <button
    className={cc(
      'h-6 w-6 rounded-md',
      'hover:bg-gray-200 active:bg-gray-300',
      'flex flex-row centered',
      'focus:outline-none'
    )}
    onClick={props.close}
    id="module-modal-close-button"
    data-cy={props.cypressCloseButton}
  >
    <CloseIcon className="text-gray-600 h-5 w-5" />
  </button>
)
