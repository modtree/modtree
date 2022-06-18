import { H2, P } from '@/components/html'
import { Button } from '@/components/buttons'

export default function Account() {
  return (
    <>
      <H2 underline>Change username</H2>
      <P className="mb-4">
        Changing your username can have unintended side effects.
      </P>
      <Button>Change username</Button>
    </>
  )
}
