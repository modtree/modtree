import React, { ReactElement, Children } from 'react'

type ReactChild = ReactElement[] | ReactElement

export function clickify(children: ReactChild) {
  return Children.map(children, (child) => (
    <div className="pointer-events-auto w-min h-min">{child}</div>
  ))
}

/**
 * a full-screen overlay that doesn't take any clicks on itself,
 * but still passes on click events to its children
 */
export function FullScreenOverlay(props: { children: ReactChild }) {
  return (
    <div className="z-10 absolute left-0 top-0 h-screen w-screen pointer-events-none select-none">
      {clickify(props.children)}
    </div>
  )
}

/**
 * a header overlay that doesn't take any clicks on itself,
 * but still passes on click events to its children
 */
export function HeaderOverlay(props: {
  children: ReactChild
}) {
  return (
    <div className="z-10 absolute left-0 top-0 h-16 w-screen py-2 pointer-events-none select-none">
      {clickify(props.children)}
    </div>
  )
}
