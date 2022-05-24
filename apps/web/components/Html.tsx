function composeCss(base: string, added: string | undefined): string {
  return added ? `${base} ${added}` : base
}

type HtmlTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const htmlConfig: Record<HtmlTag, string> = {
  h1: 'text-2xl font-semibold text-gray-600',
  h2: 'text-2xl font-semibold text-gray-600',
  h3: 'text-2xl font-semibold text-gray-600',
  h4: 'text-2xl font-semibold text-gray-600',
  h5: 'text-2xl font-semibold text-gray-600',
  h6: 'text-2xl font-semibold text-gray-600',
}

type HeaderProps = { className?: string; children: string }

type Header = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>

const makeHeader =
  (Tag: HtmlTag) =>
  (props: HeaderProps): Header => {
    const _props = {
      className: composeCss(htmlConfig[Tag], props.className),
      children: props.children,
    }
    return <Tag {..._props} />
  }

export const H1 = makeHeader('h1')
export const H2 = makeHeader('h2')
export const H3 = makeHeader('h3')
export const H4 = makeHeader('h4')
export const H5 = makeHeader('h5')
export const H6 = makeHeader('h6')
