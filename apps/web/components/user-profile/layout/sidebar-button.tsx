import { useAppDispatch, r } from '@/store/redux'
import { flatten } from '@/utils/tailwind'
import { HeroIcon, Pages } from 'types'

export default function SidebarButton(props: {
  children: string
  icon: HeroIcon
  pageId: Pages['UserProfile']
  selected: boolean
}) {
  const dispatch = useAppDispatch()
  return (
    <div
      className={flatten(
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
