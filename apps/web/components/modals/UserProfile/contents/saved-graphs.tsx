import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'

const graphs = [
  {
    name: 'The Game Plan',
    degree: 'Computer Science',
    count: '6 modules',
  },
  {
    name: 'Life on hard-mode',
    degree: 'Mathematics',
    count: '8 modules',
  },
  {
    name: 'Chase your dreams',
    degree: 'Music',
    count: '9 modules',
  },
]

export default function SavedGraphs() {
  const [selected, setSelected] = useState(graphs[0])

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-md">
        <RadioGroup value={selected} onChange={setSelected}>
          <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
          <div className="space-y-2">
            {graphs.map((graph) => (
              <RadioGroup.Option
                key={graph.name}
                value={graph}
                className={({ checked }) =>
                  `${checked ? 'bg-modtree-300 text-white' : 'bg-white'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  ${
                              checked ? 'text-white' : 'text-gray-900'
                            }`}
                          >
                            {graph.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline ${
                              checked ? 'text-modtree-50' : 'text-gray-500'
                            }`}
                          >
                            <span>{graph.degree}</span>{' '}
                            <span aria-hidden="true">&middot;</span>{' '}
                            <span>{graph.count}</span>
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked && (
                        <div className="shrink-0 text-white">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
