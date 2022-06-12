import Link from 'next/link'

export default function SignedOutRect() {
  const padding = 'px-3'
  const flex = 'flex flex-row'
  const border = 'border border-gray-400 rounded-md'
  const hover = 'hover:bg-gray-200'
  const active = 'active:bg-gray-300'
  return (
    <div
      className={`cursor-pointer items-center h-10 ${flex} ${padding} ${border} ${hover} ${active}`}
    >
      <Link href="/api/auth/login" passHref>
        <div className="text-gray-400">Sign in</div>
      </Link>
    </div>
  )
}
