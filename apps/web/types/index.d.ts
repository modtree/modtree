import type { UserProfile } from '@auth0/nextjs-auth0'
import type { ButtonHTMLAttributes, ReactElement, ComponentProps } from 'react'
import type {
  UseState,
  Modify,
  IModuleCondensed,
  IModule,
} from '@modtree/types'

/**
 * for frontend-specific types.
 * importable from within this project with
 * `import { Placeholder } from 'types'`
 */
export type Placeholder = string

export type UserContext = {
  user: string
}

export type ModtreeUserProfile = UserProfile & {
  modtreeId?: string // modtree database user id
}

export type ModtreeUserContext = {
  user?: ModtreeUserProfile
  error?: Error
  isLoading: boolean
  checkSession: () => Promise<void>
}

export type UserMenuItem = {
  text: string
  href?: string
  callback?: () => void
}

export type MenuItem = {
  text: string
  href?: string
  callback?: (_: IModule) => void
}

export type ButtonColor = 'red' | 'blue' | 'green' | 'gray'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: ButtonColor
}

export type HeroIcon = (_: ComponentProps<'svg'>) => JSX.Element

export type SidebarEntryProps = {
  pageId: Pages['UserProfile']
  title: string
  content: ReactElement
  icon: HeroIcon
}

export type SidebarCategoryProps = {
  category: string
  entries: SidebarEntryProps[]
}

type HTML = JSX.IntrinsicElements

type ExtendedPropsPure = {
  input: HTML['input'] & {
    state: UseState<string>
    grayed?: boolean
  }
  header: HTML['h1'] & { children: string }
  headerWithUnderline: HTML['h1'] & {
    underline?: boolean
  }
  table: HTML['table'] & { containerClass?: string }
}

export type ExtendedProps = Modify<HTML, ExtendedPropsPure>

/**
 * settings panel data types
 */
export type ModuleSimple = Pick<IModuleCondensed, 'title' | 'moduleCode'>
export type DegreeGraphs = {
  degree: string
  graphs: string[]
}

export type DegreeSummary = {
  title: string
  graphCount: number
}

export type Pages = {
  Degrees: 'main' | 'add-new' | 'edit'
  Modules: 'main' | 'add-doing' | 'add-done'
  UserProfile:
    | 'public-profile'
    | 'account'
    | 'graphs'
    | 'modules'
    | 'degrees'
    | 'debug'
}
