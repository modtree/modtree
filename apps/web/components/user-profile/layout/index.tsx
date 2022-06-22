import { Tab } from '@headlessui/react'
import { ReactElement } from 'react'
import { SidebarCategoryProps } from 'types'
import Panels from './panels'
import Sidebar from './sidebar'

export default function SidebarWithContents(props: {
  contents: SidebarCategoryProps[]
  show: boolean
}) {
  const { contents, show } = props

  const panelContents: ReactElement[] = []
  contents.forEach((category) => {
    category.entries.forEach((entry) => {
      panelContents.push(entry.content)
    })
  })

  return show ? (
    <Tab.Group>
      <div className="flex flex-row space-x-4 h-full">
        <Sidebar contents={contents} />
        <Panels contents={panelContents} />
      </div>
    </Tab.Group>
  ) : null
}
