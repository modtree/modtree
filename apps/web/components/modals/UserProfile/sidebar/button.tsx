import { Tab } from '@headlessui/react'

export default function SidebarButton(props: { children: string }) {
  const text = 'text-left text-sm'
  const shape = 'rounded-md'
  const interact = 'hover:bg-gray-100 active:bg-red-200'
  const selectedCss = (s: boolean) =>
    s ? ' font-semibold text-gray-800 bg-gray-100' : ''
  return (
    <Tab
      className={({ selected }) =>
        `px-2 py-1 h-8 ${text} ${shape} ${interact}` + selectedCss(selected)
      }
    >
      {props.children}
    </Tab>
  )
}
