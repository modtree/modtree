import { Tab } from '@headlessui/react'
import { ReactElement } from 'react'
import SidebarButton from './button'
import { SidebarCategoryProps } from 'types'
import { dashed } from '@/utils/array'

function Sidebar(props: { contents: SidebarCategoryProps[] }) {
  return (
    <Tab.List className="w-48 flex flex-col">
      {props.contents.map(({ category, entries }, index) => (
        <div key={dashed(category, index)}>
          {category !== '' && (
            <div className="text-xs font-semibold tracking-normal text-gray-500 mt-3 mb-1">
              {category}
            </div>
          )}
          <div className="flex flex-col">
            {entries.map(({ icon, title }, index) => (
              <SidebarButton key={dashed(title, index)} icon={icon}>
                {title}
              </SidebarButton>
            ))}
          </div>
        </div>
      ))}
    </Tab.List>
  )
}

function Panels(props: { contents: ReactElement[] }) {
  return (
    <Tab.Panels className="flex-1 px-6 overflow-y-auto">
      {props.contents.map((content, index) => (
        <Tab.Panel key={dashed('user-profile-panel', index)}>
          {content}
        </Tab.Panel>
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
      <div className="flex flex-row space-x-4 h-full">
        <Sidebar contents={contents} />
        <Panels contents={panelContents} />
      </div>
    </Tab.Group>
  )
}
