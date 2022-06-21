import { ExtendedProps } from '@/types'
import { GraphIcon } from '@/ui/icons'
import { flatten } from '@/utils/tailwind'

export function GraphHeaderRow(props: ExtendedProps['div']) {
  const { className, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'font-semibold',
        className
      )}
      {...rest}
    />
  )
}

export function GraphRow(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <GraphHeaderRow
      className={flatten('bg-white font-normal', className)}
      {...rest}
    >
      <GraphIcon className="mr-2" />
      <a>{children}</a>
    </GraphHeaderRow>
  )
}
