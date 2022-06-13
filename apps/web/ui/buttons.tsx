import { XIcon } from '@heroicons/react/outline'

export const CloseButton = (props: { close: () => void }) => {
  const hover = ' hover:bg-gray-200 active:bg-gray-300 cursor-pointer'
  const center = ' flex flex-row justify-center items-center'
  const className = 'w-6 h-6 absolute right-6 rounded-md' + hover + center
  return (
    <div className={className} onClick={props.close}>
      <XIcon className="text-gray-600 h-5 w-5" />
    </div>
  )
}
