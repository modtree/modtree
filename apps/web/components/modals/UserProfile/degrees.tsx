import { Button } from '@/components/buttons'
import { H2, P } from '@/components/html'
import { ExtendedProps } from '@/types'
import { dashed } from '@/utils/array'
import { flatten } from '@/utils/tailwind'
import { AcademicCapIcon } from '@heroicons/react/outline'

type DegreeSummary = {
  title: string
  graphCount: number
}

const iconSize = '16px'
const DegreeIcon = () => (
  <AcademicCapIcon
    style={{ height: iconSize, width: iconSize }}
    className="mr-2 text-gray-700 inline"
  />
)

function Row(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'tracking-normal bg-white',
        className
      )}
      {...rest}
    >
      <DegreeIcon />
      <div className="flex-1">{children}</div>
      <Button className="text-xs px-3" color="red">
        Delete
      </Button>
    </div>
  )
}

const degreeContent: DegreeSummary[] = [
  { title: 'computer-science', graphCount: 4 },
  { title: 'mathematics', graphCount: 420 },
]

function Degrees(props: { contents: DegreeSummary[]; emptyMessage: string }) {
  const hasDegree = props.contents.length !== 0
  return (
    <>
      {hasDegree ? (
        <div className="ui-rectangle flex flex-col text-sm overflow-hidden">
          {props.contents.map((degree, index) => (
            <Row key={dashed(degree.title, index)}>
              <span className="font-semibold">{degree.title}</span>
              <span className="mx-1">/</span>
              {degree.graphCount} graphs
            </Row>
          ))}
        </div>
      ) : (
        <P>{props.emptyMessage}</P>
      )}
    </>
  )
}

export default function DegreesTabContent() {
  return (
    <div className="mb-12">
      <H2 underline>
        <div className="flex flex-row">
          <span className="flex-1">Degrees</span>
          <Button color="green">New Degree</Button>
        </div>
      </H2>
      <Degrees
        contents={degreeContent}
        emptyMessage="There are no degrees associated with this account."
      />
    </div>
  )
}
