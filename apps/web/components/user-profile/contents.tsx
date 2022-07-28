import { DegreesTabContent } from './degrees'
import { ModulesTabContent } from './modules'
import { GraphsTabContent } from './graphs'
import { SidebarCategoryProps } from 'types'
import { DegreeIcon, GraphIcon, ModuleIcon } from '@/ui/icons'
import { AccountTabContent } from './account'

export const contents: SidebarCategoryProps[] = [
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
    category: 'Settings',
    entries: [
      {
        pageId: 'account',
        title: 'Account',
        content: <AccountTabContent />,
        icon: GraphIcon,
      },
    ],
  },
]
