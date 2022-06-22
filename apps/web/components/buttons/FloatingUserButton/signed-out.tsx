import { flatten } from '@/utils/tailwind'
import Link from 'next/link'

export default function SignedOutRect() {
  const className = flatten(
    'px-4 py-2',
    'inline-flex h-10 centered rounded-md bg-black bg-opacity-20',
    'font-medium text-white hover:bg-opacity-30',
    'hover:no-underline'
  )
  return (
    <Link href="/api/auth/login" passHref>
      <a className={className}>Sign in</a>
    </Link>
  )
}
