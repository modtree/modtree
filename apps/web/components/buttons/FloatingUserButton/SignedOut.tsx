import Link from 'next/link'

export default function SignedOutRect() {
  return (
    <Link href="/api/auth/login" passHref>
      <a className="inline-flex h-10 items-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        Sign in
      </a>
    </Link>
  )
}
