import { Tab } from '@headlessui/react'
import { useState } from 'react'
import { HeroIconProps } from 'types'

export default function SidebarButton(props: {
  children: string
  icon: HeroIconProps
}) {
  const text = 'text-left text-sm text-gray-500'
  const shape = 'rounded-md'
  const interact = 'hover:bg-gray-100'
  const selectedCss = (s: boolean) =>
    s ? ' font-semibold text-gray-800 bg-gray-100' : ''
  const iconSize = '1.3em'
  const [_selected, setSelected] = useState(false)
  return (
    <Tab
      className={({ selected }) => {
        setSelected(selected)
        return `py-1 h-8 ${text} ${shape} ${interact} ${selectedCss(selected)}`
      }}
    >
      <div className="flex flex-row items-center">
        <props.icon
          className={`mx-2 ${_selected && 'text-gray-600'}`}
          style={{ height: iconSize, width: iconSize }}
        />
        {props.children}
      </div>
    </Tab>
  )
}
