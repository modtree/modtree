import { flatten } from '@/utils/tailwind'
import { DeleteIcon } from '@/ui/icons'

export const DeleteButton = (props: {
  onClick: () => void
  cypress?: string
}) => {
  return (
    <div className={flatten('w-6 h-6 ui-rectangle')}>
      <button
        className={flatten(
          'h-full w-full rounded-md',
          'hover:bg-gray-200 active:bg-gray-300',
          'flex flex-row centered',
          'focus:outline-none'
        )}
        onClick={props.onClick}
        id="module-modal-close-button"
        data-cy={props.cypress}
      >
        <DeleteIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  )
}
