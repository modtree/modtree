import { useAppSelector } from '@/store/redux'
import { SidebarCategoryProps, SidebarEntryProps } from 'types'
import Sidebar from './sidebar'

export default function SidebarWithContents(props: {
  contents: SidebarCategoryProps[]
  show: boolean
}) {
  const { contents, show } = props
  const page = useAppSelector((state) => state.modal.userProfilePage)

  const panelContents: SidebarEntryProps[] = []
  contents.forEach((category) => {
    category.entries.forEach((entry) => {
      panelContents.push(entry)
    })
  })

  const currentPanel = panelContents.find((content) => content.pageId === page)

  return show ? (
    <div className="flex flex-row space-x-4 h-full">
      <Sidebar contents={contents} />
      <div className="flex-1 px-6 pb-12 overflow-y-auto">
        <div>
          <div className="mb-6">{currentPanel.content}</div>
        </div>
      </div>
    </div>
  ) : null
}
