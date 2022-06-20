import { Button } from '@/ui/buttons'
import { ExtendedProps } from 'types'
import { dashed } from '@/utils/array'
import { flatten } from '@/utils/tailwind'
import { DegreeIcon } from '@/ui/icons'
import { Slash } from '@/components/inline'

type DegreeSummary = {
  title: string
  graphCount: number
}

function Row(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'bg-white',
        className
      )}
      {...rest}
    >
      <DegreeIcon className="mr-2" />
      <div className="flex-1">{children}</div>
      <Button className="text-sm px-3" color="red">
        Delete
      </Button>
    </div>
  )
}

const degreeContent: DegreeSummary[] = [
  { title: 'computer-science', graphCount: 4 },
  { title: 'mathematics', graphCount: 420 },
]

function Degrees(props: {
  contents: DegreeSummary[]
  emptyMessage: string
  message: string
}) {
  const hasDegree = props.contents.length !== 0
  return (
    <>
      <h2>
        <div className="flex flex-row">
          <span className="flex-1">Degrees</span>
          <Button color="green">New Degree</Button>
        </div>
      </h2>
      {hasDegree ? (
        <>
          <p>{props.message}</p>
          <div className="ui-rectangle flex flex-col overflow-hidden">
            {props.contents.map((degree, index) => (
              <Row key={dashed(degree.title, index)}>
                <b>{degree.title}</b>
                <Slash />
                {degree.graphCount} graphs
              </Row>
            ))}
          </div>
        </>
      ) : (
        <p>{props.emptyMessage}</p>
      )}
    </>
  )
}

export function DegreesTabContent() {
  const message =
    'This is a list of degrees. Degrees provide a list of required modules ' +
    'to complete. Module suggestions are affected by the current degree.'
  return (
    <div className="mb-12">
      <Degrees
        contents={degreeContent}
        message={message}
        emptyMessage="There are no degrees associated with this account."
      />
      <div className="my-12 text-center">Empty debug ↓</div>
      <Degrees
        contents={[]}
        message="This is a list of completed modules."
        emptyMessage="There are no degrees associated with this account."
      />
    </div>
  )
}
