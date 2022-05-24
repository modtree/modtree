import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, ReactElement } from 'react'
import { UseState } from 'types'

function composeCss(base: string, added: string | undefined): string {
  return added ? `${base} ${added}` : base
}

type HtmlTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const htmlConfig: Record<HtmlTag, string> = {
  h1: 'text-4xl font-semibold text-gray-600',
  h2: 'text-3xl font-semibold text-gray-600',
  h3: 'text-2xl font-semibold text-gray-600',
  h4: 'text-xl font-semibold text-gray-600',
  h5: 'text-lg font-semibold text-gray-500',
  h6: 'text-md font-semibold text-gray-500',
}

type HeaderProps = { className?: string; children: string }

function makeHeader(Tag: HtmlTag) {
  const Component = (props: HeaderProps): ReactElement => {
    const _props = {
      className: composeCss(htmlConfig[Tag], props.className),
      children: props.children,
      displayname: Tag,
    }
    return <Tag {..._props} />
  }
  return Component
}

export const H1 = makeHeader('h1')
export const H2 = makeHeader('h2')
export const H3 = makeHeader('h3')
export const H4 = makeHeader('h4')
export const H5 = makeHeader('h5')
export const H6 = makeHeader('h6')

type BaseInputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>


type InputProps = BaseInputProps & {
  displayState: UseState<string>
  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  callback?: (value: string) => any | void
  className?: string
}


export const Input = (props: InputProps) => {
  const [display, setDisplay] = props.displayState
  const yes = () => true
  const callback = props.callback || yes
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDisplay(value)
    callback(value)
  }
  const customKeys = ['callback', 'displayState', 'className']
  const vanillaProps: Partial<Record<string, any>> = {}
  Object.entries(props).forEach(([key, value]) => {
    if (customKeys.includes(key)) return
    vanillaProps[key] = value
  })
  return (
    <input
      spellCheck={false}
      className={composeCss('focus:outline-none', props.className)}
      value={display}
      onChange={(e) => onChange(e)}
      {...vanillaProps}
    />
  )
}
