import { flatten } from '@/utils/tailwind'
import { Tab } from '@headlessui/react'
import { HeroIcon } from 'types'

export default function SidebarButton(props: {
  children: string
  icon: HeroIcon
}) {
  const text = 'text-left text-base text-gray-600'
  const shape = 'rounded-md'
  const interact = 'hover:bg-gray-00 focus:outline-none'
  const selectedCss = (s: boolean) =>
    s ? ' font-medium text-gray-800 bg-gray-100' : ''
  const iconSize = '16px'
  return (
    <Tab
      className={({ selected }) => {
        return flatten('py-1 h-8', text, shape, interact, selectedCss(selected))
      }}
    >
      <div className="flex flex-row items-center">
        <props.icon
          className="mx-2 text-gray-600"
          style={{ height: iconSize, width: iconSize }}
        />
        {props.children}
      </div>
    </Tab>
  )
}
