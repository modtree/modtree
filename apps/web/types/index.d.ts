import type { ButtonHTMLAttributes, ReactElement, ComponentProps } from 'react'
import type {
  UseState,
  Modify,
  GraphFlowNode,
  IModuleCondensed,
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

export type UserMenuItem = {
  text: string
  href?: string
  callback?: () => void
}

export type MenuItem = {
  show: boolean
  text: string
  href?: string
  callback?: (_?: GraphFlowNode) => void
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
  Graphs: 'main' | 'add-new' | 'edit'
  Modules: 'main' | 'add-doing' | 'add-done'
  UserProfile: 'graphs' | 'modules' | 'degrees'
}

export type ContextMenuType =
  | 'flowPaneContextMenu'
  | 'flowNodeContextMenu'
  | 'none'

export type ContextMenuProps = {
  opacity: number
  top: number
  left: number
  menu: ContextMenuType
  flowNode?: GraphFlowNode
}

export type ModuleNodeProps = {
  type?: string
  data: IModuleCondensed & {
    className?: { moduleCode?: string; title?: string }
  }
}
