import { UserProfile, useUser } from '@auth0/nextjs-auth0'

const Separator = () => <hr className="border-gray-200 my-3" />

const SignedInAs = (props: { user: UserProfile | undefined }) => {
  return props.user ? (
    <>
      <div className="mx-4">
        <div>Signed in as</div>
        <div className="font-bold text-ellipsis overflow-hidden">
          {props.user.name}alskdfjlasdjfkladsfj
        </div>
      </div>
      <Separator />
    </>
  ) : null
}

const MenuItem = (props: { text: string; onClick: () => void }) => {
  const transition = 'transition ease-out'
  const hover = 'hover:bg-blue-500 hover:text-white'
  return (
    <div
      className={`cursor-pointer ${hover} ${transition}`}
      onClick={props.onClick}
    >
      <div className="mx-4 py-1.5">{props.text}</div>
    </div>
  )
}

export default function UserMenu() {
  const { user } = useUser()
  const spacing = 'py-3 mt-1'
  return (
    <div
      className={`w-48 bg-white rounded-md border shadow-md text-sm tracking-normal ${spacing}`}
    >
      <SignedInAs user={user} />
      <MenuItem text="Your Profile" onClick={() => alert('Open Profile')} />
      <MenuItem text="Settings" onClick={() => alert('Open settings')} />
      <MenuItem text="Sign out" onClick={() => alert('Logout')} />
    </div>
  )
}
