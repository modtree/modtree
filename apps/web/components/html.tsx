import { UseState } from '@modtree/types'

type ExtendedProps = {
  input: JSX.IntrinsicElements['input'] & { state: UseState<string> }
  header: JSX.IntrinsicElements['h1'] & { children: string }
  headerWithUnderline: JSX.IntrinsicElements['h1'] & {
    children: string
    underline?: boolean
  }
}

const base = 'text-gray-700'
const className = {
  h1: `text-3xl font-normal   mb-3 ${base}`,
  h2: `text-2xl font-normal   mb-3 ${base}`,
  h3: `text-xl  font-semibold mb-2 ${base}`,
  h4: `text-lg  font-semibold mb-2 ${base}`,
  h5: `text-md  font-semibold mb-2 ${base}`,
  h6: `text-sm  font-semibold mb-2 ${base}`,
}

function makeHeaderWithUnderline(Tag: 'h1' | 'h2') {
  const Header = (props: ExtendedProps['headerWithUnderline']) => {
    const { children, underline, ...rest } = props
    return (
      <Tag className={className[Tag]} {...rest}>
        {children}
        {underline && <hr className="border-gray-200 bg-green-100 mt-3" />}
      </Tag>
    )
  }
  return Header
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

export const H1 = makeHeaderWithUnderline('h1')
export const H2 = makeHeaderWithUnderline('h2')
export const H3 = makeHeader('h3')
export const H4 = makeHeader('h4')
export const H5 = makeHeader('h5')
export const H6 = makeHeader('h6')

export const Input = (props: ExtendedProps['input']) => {
  const [value, setValue] = props.state
  const interact = 'focus:outline focus:outline-2 outline-blue-300'
  return (
    <input
      className={`text-sm py-1 px-2 border rounded-md ${interact} ${props.className}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
