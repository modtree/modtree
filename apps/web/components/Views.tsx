import { ReactElement, Children } from 'react'


export function clickify(children: ReactElement[] | ReactElement) {
  return Children.map(children, (child) => (
    <div className="pointer-events-auto w-min h-min">{child}</div>
  ))
}


/**
 * a full-screen overlay that doesn't take any clicks on itself,
 * but still passes on click events to its children
 */
export function FullScreenOverlay(props: { children: any }) {
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
  children: ReactElement[] | ReactElement
}) {
  return (
    <div className="z-10 absolute left-0 top-0 h-16 w-screen py-2 pointer-events-none select-none">
      {clickify(props.children)}
    </div>
  )
}

/**
 * a modal such that when you click on anywhere outside it, it will call
 * the onClick passed into it
 */
export function Modal(props: { children: any; onDismiss: any }) {
  /**
   * only call onDismiss if user clicked on an element that has is of the class
   * dismiss-modal
   */
  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement
    try {
      if (target.className.split(' ').includes('dismiss-modal')) {
        props.onDismiss()
      }
    } catch {}
  }
  return (
    <div
      className="z-10 absolute left-0 top-0 h-screen w-screen select-none bg-gray-900/10"
      onClick={(e) => handleClick(e)}
    >
      <div className="flex flex-row justify-center items-center h-full dismiss-modal">
        {props.children}
      </div>
    </div>
  )
}
