import { UseState } from '@modtree/types'

const base = ''
const className = {
  h1: `text-xl mb-3 ${base}`,
  h2: `text-lg mb-3 ${base}`,
  h3: `text-sm font-semibold mb-2 text-gray-800 ${base}`,
}

export const H1 = (props: { children: string }) => (
  <>
    <h1 className={className.h1}>{props.children}</h1>
    <hr className="border-gray-200 mb-3" />
  </>
)

export const H2 = (props: { children: string }) => (
  <>
    <h2 className={className.h2}>{props.children}</h2>
  </>
)

export const H3 = (props: { children: string }) => (
  <>
    <h3 className={className.h3}>{props.children}</h3>
  </>
)

export const Input = (props: { state: UseState<string> }) => {
  const [value, setValue] = props.state
  const interact = 'focus:outline-none focus:border-modtree-200'
  return (
    <input
      className={`w-full text-sm py-1 px-2 border rounded-md ${interact}`}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
