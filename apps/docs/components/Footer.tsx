import Link from 'next/link'

function FooterLink({ href, children }) {
  const classes =
    'text-sm text-gray-500 no-underline betterbetterhover:hover:betterhover:hover:text-gray-700 betterbetterhover:hover:dark:betterhover:hover:text-white  transition'
  if (href.startsWith('http')) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href}>
      <a className={classes}>{children}</a>
    </Link>
  )
}

function FooterHeader({ children }) {
  return <h3 className="text-sm text-gray-900 dark:text-white">{children}</h3>
}

const navigation = {
  general: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API Reference', href: '/reference' },
    { name: 'Releases', href: 'https://github.com/modtree/modtree/releases' },
    { name: 'FAQ', href: '/docs/faq' },
    { name: 'About', href: '/docs/about' },
  ],
  support: [
    {
      name: 'GitHub',
      href: 'https://github.com/modtree/modtree',
    },
  ],
}

export function Footer() {
  return (
    <footer className="" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="py-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="grid grid-cols-2 gap-8 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div className="mt-12 md:!mt-0">
                <FooterHeader>General</FooterHeader>
                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                  {navigation.general.map((item, i) => (
                    <li key={i}>
                      <FooterLink href={item.href}>{item.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:!mt-0">
                <FooterHeader>Support</FooterHeader>
                <ul role="list" className="mt-4 space-y-1.5 list-none ml-0">
                  {navigation.support.map((item, i) => (
                    <li key={i}>
                      <FooterLink href={item.href}>{item.name}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8 mt-8 md:flex md:items-center md:justify-between">
          <div>
            <p className="mt-4 text-xs text-gray-500 ">
              MIT &copy; {new Date().getFullYear()} Modtree
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
