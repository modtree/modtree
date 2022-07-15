import { ReactElement } from 'react'
import { Button } from '@/ui/buttons'
import { Slash } from '@/ui/inline'
import { ButtonColor } from 'types'

type TitleProps = {
  title: string
  baseTitle?: string
  onBack?: () => void
}

type SettingsSectionProps = {
  addButtonColor?: ButtonColor
  addButtonText?: string
  onAddClick?: () => void
  children: ReactElement | ReactElement[]
  className?: string
  cypress?: string
} & TitleProps

const Title = (props: TitleProps) => {
  return (
    <span className="flex-1">
      {props.baseTitle ? (
        <>
          <a onClick={props.onBack}>{props.baseTitle}</a>
          <Slash />
          <span>{props.title}</span>
        </>
      ) : (
        <span>{props.title}</span>
      )}
    </span>
  )
}

export function SettingsSection(props: SettingsSectionProps) {
  return (
    <div className={props.className}>
      <h2>
        <div className="flex flex-row items-center">
          <Title {...props} />
          {props.addButtonText && (
            <Button
              color={props.addButtonColor || 'green'}
              onClick={props.onAddClick}
              data-cy={props.cypress}
            >
              {props.addButtonText}
            </Button>
          )}
        </div>
      </h2>
      <hr />
      {props.children}
    </div>
  )
}
