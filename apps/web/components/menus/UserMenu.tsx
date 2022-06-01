import { UserProfile, useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios, {AxiosResponse} from 'axios'

const Separator = () => <hr className="border-gray-200 my-3" />

const SignedInAs = (props: { user: UserProfile | undefined }) => {
  return props.user ? (
    <>
      <div className="mx-4">
        <div>Signed in as</div>
        <div className="font-bold text-ellipsis overflow-hidden">
          {props.user.name}
        </div>
      </div>
      <Separator />
    </>
  ) : null
}

const MenuItem = (props: {
  href?: string
  text: string
  onClick?: () => void
}) => {
  const transition = 'transition ease-out'
  const hover = 'hover:bg-blue-500 hover:text-white'
  return (
    <Link href={props.href || '#'}>
      <div
        className={`cursor-pointer ${hover} ${transition}`}
        onClick={props.onClick}
      >
        <div className="mx-4 py-1.5">{props.text}</div>
      </div>
    </Link>
  )
}

export default function UserMenu() {
  const { user } = useUser()
  const spacing = 'py-3 mt-1'

  const [username, setUsername] = useState('')

  const getUsername = async (email: string) => {
    const res = await axios.get("http://localhost:8080/user", {
      params: {
        email,
      }
    })
    const username = res.data.result.username
    setUsername(username)
  }

  // email @ user.email
  useEffect(() => {
    if (user && user.email)
      getUsername(user.email)
  }, [user])

  return (
    <div
      className={`w-48 bg-white rounded-md border shadow-md text-sm tracking-normal ${spacing}`}
    >
      <SignedInAs user={user} />
      <div>Username: {username}</div>
      <MenuItem text="Your Profile" onClick={() => alert('Open Profile')} />
      <MenuItem text="Settings" onClick={() => alert('Open settings')} />
      <MenuItem text="Sign out" href="/api/auth/logout" />
    </div>
  )
}
