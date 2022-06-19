import { UserProfile } from '@auth0/nextjs-auth0'
import { ModtreeApiResponse } from '@modtree/types'
import { ButtonHTMLAttributes, ReactElement } from 'react'

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

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: 'red' | 'blue' | 'green' | 'gray'
}

export type HeroIcon = (props: React.ComponentProps<'svg'>) => JSX.Element

export type SidebarEntryProps = {
  title: string
  content: ReactElement
  icon: HeroIcon
}

export type SidebarCategoryProps = {
  category: string
  entries: SidebarEntryProps[]
}
