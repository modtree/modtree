import {
  PublicProfileTabContent,
  AccountTabContent,
  DebugTabContent,
} from './panels'
import { DegreesTabContent } from './degrees'
import { ModulesTabContent } from './modules'
import { GraphsTabContent } from './graphs'
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
        pageId: 'public-profile',
        title: 'Public profile',
        content: <PublicProfileTabContent />,
        icon: ProfileIcon,
      },
      {
        pageId: 'account',
        title: 'Account',
        content: <AccountTabContent />,
        icon: AccountIcon,
      },
    ],
  },
  {
    category: 'Academics',
    entries: [
      {
        pageId: 'graphs',
        title: 'Graphs',
        content: <GraphsTabContent />,
        icon: GraphIcon,
      },
      {
        pageId: 'modules',
        title: 'Modules',
        content: <ModulesTabContent />,
        icon: ModuleIcon,
      },
      {
        pageId: 'degrees',
        title: 'Degrees',
        content: <DegreesTabContent />,
        icon: DegreeIcon,
      },
    ],
  },
  {
    category: 'Developer',
    entries: [
      {
        pageId: 'debug',
        title: 'Debug',
        content: <DebugTabContent />,
        icon: DebugIcon,
      },
    ],
  },
]
