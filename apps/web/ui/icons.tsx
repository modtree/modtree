import { HeroIcon } from 'types'
import {
  AcademicCapIcon,
  CubeIcon,
  ShareIcon,
  BeakerIcon,
  CogIcon,
  UserIcon,
} from '@heroicons/react/outline'

const iconSize = '16px'
const style = { height: iconSize, width: iconSize }

function getIcon(Icon: HeroIcon) {
  return (props: { className?: string }) => (
    <Icon style={style} className={`ui-icon ${props.className}`} />
  )
}

export const GraphIcon = getIcon(ShareIcon)
export const ModuleIcon = getIcon(CubeIcon)
export const DegreeIcon = getIcon(AcademicCapIcon)
export const DebugIcon = getIcon(BeakerIcon)
export const ProfileIcon = getIcon(UserIcon)
export const AccountIcon = getIcon(CogIcon)
