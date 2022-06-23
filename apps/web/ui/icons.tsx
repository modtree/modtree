import { HeroIcon } from 'types'
import {
  AcademicCapIcon,
  CubeIcon,
  ShareIcon,
  BeakerIcon,
  CogIcon,
  UserIcon,
  SearchIcon as _SearchIcon,
} from '@heroicons/react/outline'
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

export const GraphIcon = getIcon(ShareIcon)
export const ModuleIcon = getIcon(CubeIcon)
export const DegreeIcon = getIcon(AcademicCapIcon)
export const DebugIcon = getIcon(BeakerIcon)
export const ProfileIcon = getIcon(UserIcon)
export const AccountIcon = getIcon(CogIcon)
export const SearchIcon = getIcon(_SearchIcon)
