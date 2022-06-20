import { ReactElement } from 'react'
import { Button } from '@/ui/buttons'

export function SettingsSection(props: {
  title: string
  addButtonText?: string
  children: ReactElement | ReactElement[]
}) {
  return (
    <div className="mb-12">
      <h2>
        <div className="flex flex-row items-center">
          <span className="flex-1">{props.title}</span>
          {props.addButtonText && (
            <Button color="green">{props.addButtonText}</Button>
          )}
        </div>
      </h2>
      <hr />
      {props.children}
    </div>
  )
}
