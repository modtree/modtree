import { ReactChild } from "react"

export const H1 = (props: { children:ReactChild }) => {
  return (
    <h1 className='text-4xl'>{props.children}</h1>
  )
}
