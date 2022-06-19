import { Button } from '@/components/buttons'
import { H2, Input, P } from '@/components/html'
import { ExtendedProps } from '@/types'
import { ShareIcon } from '@heroicons/react/outline'
import { useState } from 'react'
import { flatten } from '@/utils/tailwind'
import { dashed } from '@/utils/array'

const iconSize = '16px'
const GraphIcon = () => (
  <ShareIcon
    style={{ height: iconSize, width: iconSize }}
    className="mr-2 text-gray-700 inline"
  />
)

function HeaderRow(props: ExtendedProps['div']) {
  const { className, ...rest } = props
  return (
    <div
      className={flatten(
        'border-b border-b-gray-300 last:border-none',
        'flex flex-row items-center px-4 py-4',
        'font-semibold tracking-normal',
        className
      )}
      {...rest}
    />
  )
}

function GraphRow(props: ExtendedProps['div']) {
  const { className, children, ...rest } = props
  return (
    <HeaderRow className={flatten('bg-white font-normal', className)} {...rest}>
      <GraphIcon />
      <span className="text-blue-500 cursor-pointer hover:underline">
        {children}
      </span>
    </HeaderRow>
  )
}

type DegreeGraphs = {
  degree: string
  graphs: string[]
}

const graphContent: DegreeGraphs[] = [
  {
    degree: 'computer-science',
    graphs: ['main', 'whack', 'blockchain', 'security'],
  },
  {
    degree: 'mathematics',
    graphs: ['minor', 'sidehustle'],
  },
]

function Graphs(props: { contents: DegreeGraphs[] }) {
  const { contents } = props
  return (
    <div className="ui-rectangle flex flex-col text-sm overflow-hidden">
      <HeaderRow>
        <GraphIcon />
        Graphs
      </HeaderRow>
      {contents.map(({ degree, graphs }, index) => (
        <>
          <HeaderRow key={dashed(degree, index)}>{degree}</HeaderRow>
          {graphs.map((graph, index) => (
            <GraphRow key={dashed(degree, graph, index)}>
              {degree}/{graph}
            </GraphRow>
          ))}
        </>
      ))}
    </div>
  )
}

export default function GraphTabContent() {
  const original = 'computer-science/main'
  const state = {
    graphName: useState<string>(original),
  }
  return (
    <>
      <H2 underline>Default graph</H2>
      <P className="mb-4">Choose the default graph to display.</P>
      <div className="flex flex-row space-x-2 mb-4">
        <Input className="w-48 mb-4" state={state.graphName} grayed />
        <Button
          disabled={
            state.graphName[0] === original || state.graphName[0] === ''
          }
        >
          Update
        </Button>
      </div>
      <H2 underline>Graphs</H2>
      <Graphs contents={graphContent} />
    </>
  )
}
