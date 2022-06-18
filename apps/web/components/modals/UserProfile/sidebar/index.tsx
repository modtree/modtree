import { HeroIconProps } from '@/types'
import { Tab } from '@headlessui/react'
import { ReactElement } from 'react'
import SidebarButton from './button'

function Sidebar(props: {
  contents: { title: string; icon: HeroIconProps }[]
}) {
  return (
    <Tab.List className="w-48 flex flex-col">
      {props.contents.map(({ title, icon }) => (
        <SidebarButton icon={icon}>{title}</SidebarButton>
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
  contents: { title: string; content: ReactElement; icon: HeroIconProps }[]
}) {
  const { contents } = props
  return (
    <Tab.Group>
      <div className="flex flex-row space-x-6">
        <Sidebar
          contents={contents.map((e) => ({ title: e.title, icon: e.icon }))}
        />
        <Panels contents={props.contents.map((e) => e[1])} />
      </div>
    </Tab.Group>
  )
}
