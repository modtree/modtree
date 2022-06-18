import { UseState } from '@modtree/types'

type ExtendedProps = {
  input: JSX.IntrinsicElements['input'] & { state: UseState<string> }
  h1: JSX.IntrinsicElements['h1'] & { children: string; underline?: boolean }
  header: JSX.IntrinsicElements['h1'] & { children: string }
}

const base = ''
const className = {
  h1: `text-xl mb-3 ${base}`,
  h2: `text-lg mb-3 ${base}`,
  h3: `text-sm font-semibold mb-2 text-gray-800 ${base}`,
}

export const H1 = (props: ExtendedProps['h1']) => (
  <>
    <h1 className={className.h1}>{props.children}</h1>
    {props.underline && <hr className="border-gray-200 mb-3" />}
  </>
)

export const H2 = (props: ExtendedProps['header']) => (
  <h2 className={className.h2}>{props.children}</h2>
)

export const H3 = (props: ExtendedProps['header']) => (
  <h3 className={className.h3}>{props.children}</h3>
)

export const Input = (props: ExtendedProps['input']) => {
  const [value, setValue] = props.state
  const interact = 'focus:outline-none focus:border-modtree-200'
  return (
    <input
      className={`text-sm py-1 px-2 border rounded-md ${interact} ${props.className}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
