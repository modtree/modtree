import { ButtonProps } from '@/types'
import { flatten } from '@/utils/tailwind'
import { base, colorMap } from './base'
import { PlusIcon } from '@heroicons/react/outline'

export function AddButton(props: ButtonProps) {
  const color = props.color || 'gray'
  const accents = flatten(...colorMap[color])
  const { className, children, ...rest } = props
  return (
    <div className="inline-block cursor-pointer bg-black rounded-lg">
      <div className={`${base} ${accents} w-8 px-0 py-0 mb-0`}>
        <PlusIcon className="h-5 w-5" />
      </div>
    </div>
  )
}
