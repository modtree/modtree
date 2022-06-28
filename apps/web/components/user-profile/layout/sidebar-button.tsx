import { flatten } from '@/utils/tailwind'
import { HeroIcon } from 'types'

export default function SidebarButton(props: {
  children: string
  icon: HeroIcon
}) {
  return (
    <div
      className={flatten(
        'py-1 h-8',
        'text-left text-base text-gray-600',
        'rounded-md',
        'hover:bg-gray-00 focus:outline-none'
      )}
    >
      <div className="flex flex-row items-center">
        <props.icon className="mx-2 text-gray-600" />
        {props.children}
      </div>
    </div>
  )
}
