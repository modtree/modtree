import { ReactChild } from "react"

export const H1 = (props: { children:ReactChild }) => {
  return (
    <h1 className='text-4xl mt-12 mb-8 font-semibold tracking-normal text-gray-700'>{props.children}</h1>
  )
}

export const H2 = (props: { children:ReactChild }) => {
  return (
    <h2 className='text-2xl mt-12 mb-8'>{props.children}</h2>
  )
}
