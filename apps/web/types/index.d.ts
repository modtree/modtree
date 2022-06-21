import { UserProfile } from '@auth0/nextjs-auth0'
import { ModuleCondensed } from '@modtree/entity'
import { ModtreeApiResponse, UseState, Modify } from '@modtree/types'
import { ButtonHTMLAttributes, ReactElement, ComponentProps } from 'react'

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
  modtree?: ModtreeApiResponse.User
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
  callback?: () => void
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'red' | 'blue' | 'green' | 'gray'
}

export type HeroIcon = (_: ComponentProps<'svg'>) => JSX.Element

export type SidebarEntryProps = {
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
export type ModuleSimple = Pick<ModuleCondensed, 'title' | 'moduleCode'>
export type DegreeGraphs = {
  degree: string
  graphs: string[]
}

export type DegreeSummary = {
  title: string
  graphCount: number
}
