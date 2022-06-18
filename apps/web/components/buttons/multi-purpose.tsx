import { Component, HTMLAttributes } from 'react'
import { flatten } from '@/utils/tailwind'

type ButtonProps = HTMLAttributes<HTMLDivElement> & {
  color?: 'red' | 'blue' | 'green' | 'gray'
}

export class Button extends Component<ButtonProps> {
  private color: string
  /**
   * applies to all buttons
   */
  private base =
    'h-8 border text-sm font-medium px-4 flex justify-center items-center ' +
    'rounded-md hover:bg-opacity-90 active:bg-opacity-80 whitespace-nowrap'
  /**
   * exists because tailwind only takes literals
   */
  private colorMap = {
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
  constructor(props: ButtonProps) {
    super(props)
    this.color = props.color || 'gray'
  }
  render() {
    const flat = flatten(...this.colorMap[this.color])
    return (
      <div className="inline-block cursor-pointer bg-black rounded-lg">
        <div className={`${this.base} ${flat}`} {...this.props} />
      </div>
    )
  }
}
