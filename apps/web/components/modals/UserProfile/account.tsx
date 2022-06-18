import { H2, P } from '@/components/html'
import { Button } from '@/components/buttons'
import { useUser } from '@/utils/auth0'

export default function Account() {
  const { user } = useUser()
  return (
    <>
      <H2 underline>Change username</H2>
      <P className="mb-4">
        Changing your username can have unintended side effects.
      </P>
      <Button className="mb-4">Change username</Button>
      <H2 underline>Export account data</H2>
      <P className="mb-4">
        Export all repositories and profile metadata for{' '}
        <span className="font-semibold">@{user.nickname}</span>. Exports will be
        available for 7 days.
      </P>
      <Button className="mb-4">Start export</Button>
    </>
  )
}
