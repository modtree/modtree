import { UseState } from '@modtree/types'

type ExtendedProps = {
  input: JSX.IntrinsicElements['input'] & { state: UseState<string> }
  header: JSX.IntrinsicElements['h1'] & { children: string }
  h1: JSX.IntrinsicElements['h1'] & { children: string; underline?: boolean }
}

const base = ''
const className = {
  h1: `text-xl mb-3 ${base}`,
  h2: `text-lg mb-3 ${base}`,
  h3: `text-sm font-semibold mb-2 text-gray-800 ${base}`,
  h4: `text-sm font-semibold mb-2 text-gray-800 ${base}`,
  h5: `text-sm font-semibold mb-2 text-gray-800 ${base}`,
  h6: `text-sm font-semibold mb-2 text-gray-800 ${base}`,
}

export const H1 = (props: ExtendedProps['h1']) => {
  const { children, underline, ...rest } = props
  return (
    <>
      <h1 className={className.h1} {...rest}>
        {children}
      </h1>
      {underline && <hr className="border-gray-200 mb-3" />}
    </>
  )
}

function makeHeader(Tag: 'h2' | 'h3' | 'h4' | 'h5' | 'h6') {
  const Header = (props: ExtendedProps['header']) => {
    const { children, ...rest } = props
    return (
      <Tag className={className[Tag]} {...rest}>
        {children}
      </Tag>
    )
  }
  return Header
}

export const H2 = (props: ExtendedProps['header']) => {
  const { children, ...rest } = props
  return (
    <h2 className={className.h2} {...rest}>
      {children}
    </h2>
  )
}

export const H3 = makeHeader('h3')
export const H4 = makeHeader('h4')
export const H5 = makeHeader('h5')
export const H6 = makeHeader('h6')

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
