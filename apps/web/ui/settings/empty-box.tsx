import { Button } from '@/ui/buttons'
import { ButtonProps } from 'types'

export function EmptyBox(props: {
  summary: string
  buttonText: string
  buttonColor?: ButtonProps['color']
}) {
  const buttonColor = props.buttonColor || 'green'
  return (
    <div className="ui-rectangle bg-inherit flex flex-col overflow-hidden items-center py-8 text-center">
      <div className="text-xl font-semibold mb-3">{props.summary}</div>
      <Button color={buttonColor}>{props.buttonText}</Button>
    </div>
  )
}
