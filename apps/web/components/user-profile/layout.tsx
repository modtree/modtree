import { useAppDispatch, useAppSelector, r } from '@/store/redux'
import { HeroIcon, Pages, SidebarCategoryProps, SidebarEntryProps } from 'types'
import { cc } from '@/utils/tailwind'
import { useMemo } from 'react'

function SidebarButton(props: {
  children: string
  icon: HeroIcon
  pageId: Pages['UserProfile']
  selected: boolean
}) {
  const dispatch = useAppDispatch()
  return (
    <div
      className={cc(
        'h-8',
        'text-gray-600',
        'rounded-md',
        'cursor-pointer',
        'hover:bg-gray-100 focus:outline-none',
        'flex flex-row items-center',
        'active:bg-gray-200',
        'select-none',
        props.selected ? 'bg-gray-100' : ''
      )}
      onClick={() => dispatch(r.setUserProfilePage(props.pageId))}
    >
      <props.icon className="mx-2 text-gray-600" />
      {props.children}
    </div>
  )
}

function Sidebar(props: { contents: SidebarCategoryProps[] }) {
  const currentPage = useAppSelector((state) => state.modal.userProfilePage)
  return (
    <div className="w-48 flex flex-col">
      {props.contents.map(({ category, entries }, i) => (
        <div key={i}>
          {category === '' ? null : (
            <div className="text-sm font-semibold text-gray-500 mt-3 mb-1">
              {category}
            </div>
          )}
          <div className="flex flex-col">
            {entries.map(({ icon, title, pageId }, i) => (
              <SidebarButton
                key={i}
                icon={icon}
                pageId={pageId}
                selected={currentPage === pageId}
              >
                {title}
              </SidebarButton>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * user profile modal panel + sidebar layout manager
 */
export default function UserProfileLayout(props: {
  contents: SidebarCategoryProps[]
  show: boolean
}) {
  const { contents, show } = props
  const page = useAppSelector((state) => state.modal.userProfilePage)

  const panelContents = contents.reduce(
    (acc, category) => [...acc, ...category.entries],
    [] as SidebarEntryProps[]
  )

  const currentPanel = useMemo(
    () => panelContents.find((content) => content.pageId === page),
    [page, panelContents]
  )

  return !show ? null : (
    <div className="flex flex-row space-x-4 h-full">
      <Sidebar contents={contents} />
      <div className="flex-1 px-6 pb-12 overflow-y-auto">
        <div className="mb-6">{currentPanel?.content}</div>
      </div>
    </div>
  )
}
