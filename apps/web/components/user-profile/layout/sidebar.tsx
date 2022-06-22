import { Tab } from '@headlessui/react'
import SidebarButton from './sidebar-button'
import { SidebarCategoryProps } from 'types'
import { dashed } from '@/utils/array'

export default function Sidebar(props: { contents: SidebarCategoryProps[] }) {
  return (
    <Tab.List className="w-48 flex flex-col">
      {props.contents.map(({ category, entries }, index) => (
        <div key={dashed(category, index)}>
          {category !== '' && (
            <div className="text-sm font-semibold text-gray-500 mt-3 mb-1">
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
