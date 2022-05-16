import { ReactChild } from "react"

export const H1 = (props: { children:ReactChild }) => {
  return (
    <h1 className='text-4xl mt-12 mb-8'>{props.children}</h1>
  )
}
