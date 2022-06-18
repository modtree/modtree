import { Tab } from '@headlessui/react'
import { ReactElement } from 'react'
import SidebarButton from './button'

function Sidebar(props: { titles: string[] }) {
  return (
    <Tab.List className="w-48 flex flex-col">
      {props.titles.map((title) => (
        <SidebarButton>{title}</SidebarButton>
      ))}
    </Tab.List>
  )
}

function Panels(props: { contents: ReactElement[] }) {
  return (
    <Tab.Panels className="flex-1">
      {props.contents.map((content) => (
        <Tab.Panel>{content}</Tab.Panel>
      ))}
    </Tab.Panels>
  )
}

export default function SidebarWithContents(props: {
  contents: [string, ReactElement][]
}) {
  return (
    <Tab.Group>
      <div className="flex flex-row space-x-6">
        <Sidebar titles={props.contents.map((e) => e[0])} />
        <Panels contents={props.contents.map((e) => e[1])} />
      </div>
    </Tab.Group>
  )
}
