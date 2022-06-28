import SidebarButton from './sidebar-button'
import { SidebarCategoryProps } from 'types'
import { dashed } from '@/utils/array'
import { useAppSelector } from '@/store/redux'

export default function Sidebar(props: { contents: SidebarCategoryProps[] }) {
  const currentPage = useAppSelector((state) => state.modal.userProfilePage)
  return (
    <div className="w-48 flex flex-col">
      {props.contents.map(({ category, entries }, index) => (
        <div key={dashed(category, index)}>
          {category !== '' && (
            <div className="text-sm font-semibold text-gray-500 mt-3 mb-1">
              {category}
            </div>
          )}
          <div className="flex flex-col">
            {entries.map(({ icon, title, pageId }, index) => (
              <SidebarButton
                key={dashed(title, index)}
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
