import { UserProfile, useUser } from '@auth0/nextjs-auth0'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { showUserProfile } from '@/store/modal'

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
    <Link href={props.href || '#'} passHref>
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
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')

  const getUsername = async (email: string) => {
    const res = await axios.post('http://localhost:8080/user', {
      email,
    })
    const username = res.data.result.username
    setUsername(username)
  }

  function openUserProfile() {
    console.log("Clicked on Your profile")
    dispatch(showUserProfile())
  }

  useEffect(() => {
    if (user && user.email) getUsername(user.email)
  }, [user])

  return (
    <div
      className={`w-48 bg-white rounded-md border shadow-md text-sm tracking-normal ${spacing}`}
    >
      <SignedInAs user={user} />
      <div className={'text-sm mx-4'}>
        Username: <span className={'font-bold'}>{username}</span>
      </div>
      <Separator />
      <MenuItem text="Your profile" onClick={openUserProfile} />
      <MenuItem text="Settings" onClick={() => alert('Open settings')} />
      <MenuItem text="Sign out" href="/api/auth/logout" />
    </div>
  )
}
