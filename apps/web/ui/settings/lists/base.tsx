import { ReactElement } from 'react'
import { Button } from '@/ui/buttons'
import { Slash } from '@/ui/inline'

type TitleProps = {
  title: string
  baseTitle?: string
  onBack?: () => void
}

type SettingsSectionProps = {
  addButtonText?: string
  onAddClick?: () => void
  children: ReactElement | ReactElement[]
  className?: string
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
            <Button color="green" onClick={props.onAddClick}>
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
