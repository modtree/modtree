import { Button } from '@/ui/buttons'

export function AccountTabContent() {
  return (
    <>
      <h2>Change username</h2>
      <p>Changing your username can have unintended side effects.</p>
      <Button className="mb-4">Change username</Button>
      <h2>Export account data</h2>
      <p>
        Export all repositories and profile metadata for <b>@username</b>.
        Exports will be available for 7 days.
      </p>
      <Button className="mb-4">Start export</Button>
    </>
  )
}
