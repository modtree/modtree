import { flatten } from '@/utils/tailwind'
import { ButtonProps } from '@/types'
import { PlusIcon } from '@heroicons/react/outline'

/**
 * applies to all buttons
 */
export const base = 'h-8 w-min'

/**
 * applies to all buttons
 */
export const container =
  'flex justify-center items-center cursor-pointer ' +
  'h-8 w-min border text-sm font-medium ' +
  'rounded-md hover:bg-opacity-90 active:bg-opacity-80 whitespace-nowrap'

/**
 * exists because tailwind only takes literals
 */
export const colorMap = {
  green: ['bg-green-600', 'border-green-700/80', 'text-neutral-50'],
  blue: ['bg-blue-600', 'border-blue-700', 'text-neutral-50'],
  gray: ['bg-gray-100', 'border-gray-300', 'text-gray-800'],
  red: [
    'bg-gray-100',
    'border-gray-300',
    'text-red-600',
    'hover:bg-red-700',
    'hover:text-white',
    'hover:border-red-700',
  ],
}

export function Button(props: ButtonProps) {
  const color = props.color || 'gray'
  const accents = flatten(...colorMap[color])
  const { className, children, ...rest } = props
  return (
    <div className={`bg-black rounded-lg ${base}`}>
      <div className={`${container} ${accents} px-4 ${className}`} {...rest}>
        {children}
      </div>
    </div>
  )
}

export function AddButton(props: ButtonProps) {
  return (
    <Button className="px-2">
      <PlusIcon className="text-gray-600 h-4 w-4" />
    </Button>
  )
}
