import Link from 'next/link'
import { ForwardedRef, forwardRef } from 'react'

function getMenuLink() {
  const MenuLink = forwardRef(
    (
      props: {
        href: string
        children: string
        className: string
        onClick?: () => void
      },
      ref: ForwardedRef<HTMLAnchorElement>
    ) => {
      const { href, children, className, onClick } = props
      return (
        <Link href={href} passHref>
          <a className={className} onClick={onClick} ref={ref}>
            {children}
          </a>
        </Link>
      )
    }
  )
  MenuLink.displayName = 'MenuLink'
  return MenuLink
}

export const MenuLink = getMenuLink()
