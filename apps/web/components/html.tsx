import { ExtendedProps } from 'types'
import { flatten } from '../utils'

const base = 'text-gray-700'
const baseClass: Partial<Record<keyof JSX.IntrinsicElements, string>> = {
  h1: `text-3xl font-normal   mb-3 ${base}`,
  h2: `text-2xl font-normal   mb-3 ${base}`,
  h3: `text-xl  font-semibold mb-2 ${base}`,
  h4: `text-lg  font-semibold mb-2 ${base}`,
  h5: `text-md  font-semibold mb-2 ${base}`,
  h6: `text-sm  font-semibold mb-2 ${base}`,
  p: `text-sm tracking-normal`,
  table: 'px-4 border-collapse',
  thead: 'border border-gray-300',
  th: 'px-4 py-3',
  td: 'px-4 py-3 bg-white',
  tbody: 'border border-gray-300 bg-white',
}

function makeHeaderWithUnderline(Tag: 'h1' | 'h2') {
  const Header = (props: ExtendedProps['headerWithUnderline']) => {
    const { children, className, underline, ...rest } = props
    return (
      <Tag className={flatten(baseClass[Tag], className)} {...rest}>
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
      <Tag className={baseClass[Tag]} {...rest}>
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
  const grayed = props.grayed ? 'focus:bg-white bg-gray-100' : ''
  return (
    <input
      className={`text-sm py-1 px-2 border border-gray-300 rounded-md ${interact} ${props.className} ${grayed}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

export const P = (props: ExtendedProps['p']) => {
  const { children, className, ...rest } = props
  return (
    <p className={`${baseClass.p} ${className}`} {...rest}>
      {children}
    </p>
  )
}

export const Table = (props: ExtendedProps['table']) => {
  const { containerClass, className, ...rest } = props
  return (
    <div className={containerClass}>
      <table className={`${baseClass.table} ${className}`} {...rest} />
    </div>
  )
}

export const Thead = (props: ExtendedProps['thead']) => {
  const { className, ...rest } = props
  return <thead className={`${baseClass.thead} ${className}`} {...rest} />
}

export const Tbody = (props: ExtendedProps['tbody']) => {
  const { className, ...rest } = props
  return <tbody className={`${baseClass.tbody} ${className}`} {...rest} />
}

export const Th = (props: ExtendedProps['th']) => {
  const { className, ...rest } = props
  return <th className={`${baseClass.th} ${className}`} {...rest} />
}

export const Tr = (props: ExtendedProps['tr']) => {
  const { className, ...rest } = props
  return <tr className={`${baseClass.tr} ${className}`} {...rest} />
}

export const Td = (props: ExtendedProps['td']) => {
  const { className, ...rest } = props
  return <td className={`${baseClass.td} ${className}`} {...rest} />
}
