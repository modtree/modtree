import { UserProfile, useUser } from '@auth0/nextjs-auth0'

const Separator = () => <hr className="border-gray-200" />

const SignedInAs = (props: { user: UserProfile | undefined }) => {
  return props.user ? (
    <>
      <div className="mx-4 mb-3">
        <div>Signed in as</div>
        <div className="font-bold">{props.user.name}</div>
      </div>
      <Separator />
    </>
  ) : null
}

const MenuItem = (props: { text: string; onClick: () => void }) => {
  const hover = 'hover:bg-blue-500 hover:text-white'
  return (
    <div className={`cursor-pointer ${hover}`} onClick={props.onClick}>
      <div className="mx-4 py-1.5">{props.text}</div>
    </div>
  )
}

export default function UserMenu() {
  const { user } = useUser()
  const spacing = 'py-3 mt-1'
  return (
    <div
      className={`w-48 h-64 bg-white rounded-md border shadow-md text-sm tracking-normal ${spacing}`}
    >
      <SignedInAs user={user} />
      <MenuItem text="Sign out" onClick={() => console.log('logout')} />
    </div>
  )
}
