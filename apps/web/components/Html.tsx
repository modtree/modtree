import { ReactElement } from 'react'
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
      displayName: Tag
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

export const Input = (props: {
  displayState: UseState<string>
  callback?: () => string
  className?: string
}) => {
  const [display, setDisplay] = props.displayState
  const identity = (x: string) => x
  const callback = props.callback || identity
  const style = 'focus:outline-none'
  return (
    <input
      spellCheck={false}
      className={composeCss(style, props.className)}
      value={display}
      onChange={(e) => setDisplay(callback(e.target.value))}
    />
  )
}
