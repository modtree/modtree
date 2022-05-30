import { useUser } from "@auth0/nextjs-auth0"

export default function LoginScreen() {
  const { user, isLoading } = useUser()
  return (
    <div>
      <div>Login Screen</div>
      <a href='/api/auth/login'>Login</a>
      <div>You are {user?.name}</div>
    </div>
  )
}
