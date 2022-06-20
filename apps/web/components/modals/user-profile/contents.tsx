import {
  PublicProfileTabContent,
  AccountTabContent,
  ModulesTabContent,
  GraphsTabContent,
  DegreesTabContent,
  DebugTabContent,
} from './panels'
import { SidebarCategoryProps } from 'types'
import {
  AccountIcon,
  DebugIcon,
  DegreeIcon,
  GraphIcon,
  ModuleIcon,
  ProfileIcon,
} from '@/ui/icons'

export const contents: SidebarCategoryProps[] = [
  {
    category: '',
    entries: [
      {
        title: 'Public profile',
        content: <PublicProfileTabContent />,
        icon: ProfileIcon,
      },
      { title: 'Account', content: <AccountTabContent />, icon: AccountIcon },
    ],
  },
  {
    category: 'Academics',
    entries: [
      { title: 'Graphs', content: <GraphsTabContent />, icon: GraphIcon },
      { title: 'Modules', content: <ModulesTabContent />, icon: ModuleIcon },
      {
        title: 'Degrees',
        content: <DegreesTabContent />,
        icon: DegreeIcon,
      },
    ],
  },
  {
    category: 'Developer',
    entries: [
      { title: 'Debug', content: <DebugTabContent />, icon: DebugIcon },
    ],
  },
]
