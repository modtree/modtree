import { ExtendedProps } from '@/types'
import { GraphIcon } from '@/ui/icons'
import { BaseRow } from './base'

export function GraphHeaderRow(props: ExtendedProps['div']) {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} className="font-semibold bg-gray-100">
      {children}
    </BaseRow>
  )
}

export function GraphRow(props: ExtendedProps['div']) {
  const { children, ...rest } = props
  return (
    <BaseRow {...rest} icon={GraphIcon}>
      <a>{children}</a>
    </BaseRow>
  )
}
