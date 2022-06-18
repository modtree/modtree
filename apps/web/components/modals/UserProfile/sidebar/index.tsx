import { Tab } from '@headlessui/react'
import { ReactElement } from 'react'
import SidebarButton from './button'
import { SidebarCategoryProps } from 'types'

function Sidebar(props: { contents: SidebarCategoryProps[] }) {
  return (
    <Tab.List className="w-48 flex flex-col">
      {props.contents.map(({ category, entries }) => (
        <>
          {category !== '' && (
            <div className="text-xs font-semibold tracking-normal text-gray-500 mt-3 mb-1">
              {category}
            </div>
          )}
          {entries.map(({ icon, title }) => (
            <SidebarButton icon={icon}>{title}</SidebarButton>
          ))}
        </>
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
  contents: SidebarCategoryProps[]
}) {
  const { contents } = props

  const panelContents: ReactElement[] = []
  contents.forEach((category) => {
    category.entries.forEach((entry) => {
      panelContents.push(entry.content)
    })
  })

  return (
    <Tab.Group>
      <div className="flex flex-row space-x-6">
        <Sidebar contents={contents} />
        <Panels contents={panelContents} />
      </div>
    </Tab.Group>
  )
}
