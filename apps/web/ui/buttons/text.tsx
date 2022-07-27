import { ButtonProps } from 'types'
import { cc } from '@/utils/tailwind'
import { PlusIcon } from '@/ui/icons'

/**
 * all buttons' interactions
 */
export const interact = 'hover:bg-opacity-90 active:bg-opacity-80'

/**
 * exists because tailwind only takes literals
 */
export const colorMap: Record<string, string> = {
  gray: 'button-gray',
  red: 'button-red',
  green: 'button-green',
}

export function Button(props: ButtonProps) {
  const color = props.color || 'gray'
  const { className, children, ...rest } = props
  return (
    <button className={cc(colorMap[color])} {...rest}>
      {children}
    </button>
  )
}

export function AddButton(props: Omit<ButtonProps, 'children'>) {
  const { className, ...rest } = props
  return (
    <Button className={`px-2 ${className}`} {...rest}>
      <PlusIcon className="text-gray-600 h-4 w-4" />
    </Button>
  )
}
