import Image from 'next/image'

export const Avatar = ({ name, picture, githubUsername }) => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src={picture}
        height={32}
        width={32}
        layout="fixed"
        priority={true}
        className="w-full rounded-full"
        alt={name}
      />
      <dl className="ml-2 text-sm font-medium leading-4 text-left whitespace-no-wrap">
        <dt className="sr-only">Name</dt>
        <dd className="text-gray-900 dark:text-white">{name}</dd>
        <dd>
          <a
            href={`https://github.com/${githubUsername}`}
            style={{ color: 'hsl(var(--nextra-primary-hue), 100%, 60%)' }}
            className="text-xs no-underline betterhover:hover:text-blue-600 betterhover:hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @{githubUsername}
          </a>
        </dd>
      </dl>
    </div>
  )
}
