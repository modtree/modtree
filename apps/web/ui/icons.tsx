import { HeroIcon } from 'types'
import * as hero from '@heroicons/react/outline'
import { flatten } from '../utils'

const defaultSize = '16px'

function getIcon(Icon: HeroIcon) {
  const component = (props: { className?: string; px?: number }) => {
    const iconSize = props.px ? `${props.px}px` : defaultSize
    const style = { height: iconSize, width: iconSize }
    return (
      <Icon style={style} className={flatten('ui-icon', props.className)} />
    )
  }
  component.displayName = Icon.name
  return component
}

export const GraphIcon = getIcon(hero.ShareIcon)
export const ModuleIcon = getIcon(hero.CubeIcon)
export const DegreeIcon = getIcon(hero.AcademicCapIcon)
export const DebugIcon = getIcon(hero.BeakerIcon)
export const ProfileIcon = getIcon(hero.UserIcon)
export const UserIcon = getIcon(hero.UserIcon)
export const AccountIcon = getIcon(hero.CogIcon)
export const SearchIcon = getIcon(hero.SearchIcon)
export const PlusIcon = getIcon(hero.PlusIcon)
export const CloseIcon = getIcon(hero.XIcon)
export const DeleteIcon = getIcon(hero.TrashIcon)
export const CheckIcon = getIcon(hero.CheckIcon)
export const SelectorIcon = getIcon(hero.SelectorIcon)
