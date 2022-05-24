/**
 * a full-screen overlay that doesn't take any clicks on itself,
 * but still passes on click events to its children
 */
export function FullScreenOverlay(props: { children: any }) {
  return (
    <div className="z-10 absolute left-0 top-0 h-screen w-screen pointer-events-none">
      <div className="pointer-events-auto">{props.children}</div>
    </div>
  )
}
