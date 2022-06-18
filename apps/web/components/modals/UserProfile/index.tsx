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
import { ReactElement } from 'react'

export default function UserProfile() {
  const showState = useSelector<ModalState, boolean>(
    (state) => state.modal.showUserProfile
  )
  const contents: [string, ReactElement][] = [
    ['Public profile', <PublicProfile />],
    ['Account', <Account />],
    ['Graphs', <Graphs />],
    ['Modules', <Modules />],
    ['Degrees', <Degrees />],
  ]
  if (process.env['NODE_ENV'] === 'development') {
    contents.push(['Debug', <Debug />])
  }
  return (
    <Panel showState={showState} hideAction={hideUserProfile}>
      <SidebarWithContents contents={contents} />
    </Panel>
  )
}
