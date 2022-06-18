import { Panel } from '../base'
import { hideUserProfile, ModalState } from '@/store/modal'
import { useSelector } from 'react-redux'
import PublicProfile from './public-profile'
import Account from './account'
import Modules from './modules'
import Graphs from './graphs'
import Degrees from './degrees'
import Debug from './debug'
import SidebarWithContents from './sidebar'
import {
  AcademicCapIcon,
  CogIcon,
  CubeIcon,
  ShareIcon,
  TerminalIcon,
  UserIcon,
} from '@heroicons/react/outline'

const contents = [
  { title: 'Public profile', content: <PublicProfile />, icon: UserIcon },
  { title: 'Account', content: <Account />, icon: CogIcon },
  { title: 'Graphs', content: <Graphs />, icon: ShareIcon },
  { title: 'Modules', content: <Modules />, icon: CubeIcon },
  { title: 'Degrees', content: <Degrees />, icon: AcademicCapIcon },
]

export default function UserProfile() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  if (
    process.env['NODE_ENV'] === 'development' &&
    contents.every((e) => e.title !== 'Debug')
  ) {
    contents.push({
      title: 'Debug',
      content: <Debug />,
      icon: TerminalIcon,
    })
  }
  return (
    <Panel showState={showState} hideAction={hideUserProfile}>
      <SidebarWithContents contents={contents} />
    </Panel>
  )
}
