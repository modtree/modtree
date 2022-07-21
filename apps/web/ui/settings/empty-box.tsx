import { Button } from '@/ui/buttons'
import { ButtonProps } from 'types'

export function EmptyBox(props: {
  summary: string
  buttonText: string
  buttonColor?: ButtonProps['color']
  onClick?: () => void
}) {
  const buttonColor = props.buttonColor || 'green'
  const onClick = props.onClick ? props.onClick : () => null
  return (
    <div className="ui-rectangle bg-inherit flex flex-col overflow-hidden items-center py-8 text-center">
      <div className="text-xl font-semibold mb-3">{props.summary}</div>
      <Button onClick={() => onClick()} color={buttonColor}>
        {props.buttonText}
      </Button>
    </div>
  )
}
