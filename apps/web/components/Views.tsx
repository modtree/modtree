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
    <div className="z-10 fixed inset-0 pointer-events-none select-none">
      {clickify(props.children)}
    </div>
  )
}
