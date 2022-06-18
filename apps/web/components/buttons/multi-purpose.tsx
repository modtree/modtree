import { HTMLAttributes } from 'react'
import { flatten } from '@/utils/tailwind'

type ButtonProps = HTMLAttributes<HTMLDivElement> & {
  color?: 'red' | 'blue' | 'green' | 'gray'
}

/**
 * applies to all buttons
 */
const base =
  'h-8 border text-sm font-medium px-4 flex justify-center items-center ' +
  'rounded-md hover:bg-opacity-90 active:bg-opacity-80 whitespace-nowrap'

/**
 * exists because tailwind only takes literals
 */
const colorMap = {
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
  const { className, ...rest } = props
  return (
    <div className="inline-block cursor-pointer bg-black rounded-lg">
      <div className={`${base} ${accents}`} {...rest} />
    </div>
  )
}
