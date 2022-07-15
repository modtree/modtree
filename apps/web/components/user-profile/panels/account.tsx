import { Button } from '@/ui/buttons'
import { useUser } from '@/utils/auth0'

export function AccountTabContent() {
  const { user } = useUser()
  return (
    <>
      <h2>Change username</h2>
      <p>Changing your username can have unintended side effects.</p>
      <Button className="mb-4">Change username</Button>
      <h2>Export account data</h2>
      <p>
        Export all repositories and profile metadata for{' '}
        <b>@{user?.nickname}</b>. Exports will be available for 7 days.
      </p>
      <Button className="mb-4">Start export</Button>
    </>
  )
}
