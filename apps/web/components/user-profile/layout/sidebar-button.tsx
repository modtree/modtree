import { flatten } from '@/utils/tailwind'
import { Tab } from '@headlessui/react'
import { HeroIcon } from 'types'

export default function SidebarButton(props: {
  children: string
  icon: HeroIcon
}) {
  return (
    <Tab
      className={({ selected }) => {
        return flatten(
          'py-1 h-8',
          'text-left text-base text-gray-600',
          'rounded-md',
          'hover:bg-gray-00 focus:outline-none',
          selected && 'font-medium text-gray-800 bg-gray-100'
        )
      }}
    >
      <div className="flex flex-row items-center">
        <props.icon className="mx-2 text-gray-600" />
        {props.children}
      </div>
    </Tab>
  )
}
