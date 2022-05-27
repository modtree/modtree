import { useEffect, useState } from 'react'
import Prism from 'prismjs'

enum ResponseState {
  fulfilled = 'fulfilled',
  schema = 'schema',
  // rejected = 'rejected',
}

export default function Response(props: ResponseProps) {
  const [showSchema, setShowSchema] = useState(ResponseState.fulfilled)

  useEffect(() => {
    Prism.highlightAll()
  }, [showSchema])

  const ResponseTab = (props: { title: string; target: ResponseState }) => {
    const selected = showSchema === props.target
    const border = selected ? 'border-b-orange-400' : 'border-b-transparent'
    return (
      <div
        className={`p-2 border-b-2 ${border} cursor-pointer`}
        onClick={() => setShowSchema(props.target)}
        children={props.title}
      />
    )
  }

  return (
    <div>
      <h3 className="mt-0 mb-4">Response</h3>
      <div>
        <div className="flex flex-row text-sm gap-x-1">
          <ResponseTab
            target={ResponseState.fulfilled}
            title="Example response"
          />
          <ResponseTab target={ResponseState.schema} title="Response schema" />
        </div>
        <div className='h-96 overflow-y-auto'>
        <pre className="m-0 rounded-sm border border-gray-300 text-sm overflow-x-scroll">
          <code className="language-js">
          {JSON.stringify(props[showSchema], null, 4)}
          </code>
        </pre>
        </div>
      </div>
    </div>
  )
}
