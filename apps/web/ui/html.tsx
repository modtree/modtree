import { ExtendedProps } from 'types'

type Props = ExtendedProps['input'] & {
  cypress?: string
}

export const Input = (props: Props) => {
  const [value, setValue] = props.state
  const interact = 'focus:outline focus:outline-2 outline-blue-300'
  const grayed = props.grayed ? 'focus:bg-white bg-gray-100' : ''
  return (
    <input
      className={`h-8 px-2 border border-gray-300 rounded-md ${interact} ${props.className} ${grayed}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      data-cy={props.cypress}
    />
  )
}
