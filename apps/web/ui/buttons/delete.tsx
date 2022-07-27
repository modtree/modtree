import { cc } from '@/utils/tailwind'
import { DeleteIcon } from '@/ui/icons'

export const DeleteButton = (props: {
  onClick: () => void
  cypress?: string
}) => {
  return (
    <div className={cc('w-6 h-6 ui-rectangle')}>
      <button
        className={cc(
          'h-full w-full rounded-md',
          'hover:bg-gray-200 active:bg-gray-300',
          'flex flex-row centered',
          'focus:outline-none'
        )}
        onClick={props.onClick}
        data-cy={props.cypress}
      >
        <DeleteIcon className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  )
}
