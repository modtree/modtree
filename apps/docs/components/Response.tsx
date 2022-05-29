import { useState } from 'react'
import Prism from 'prismjs'

enum ResponseState {
  fulfilled = 'fulfilled',
  schema = 'schema',
}

export default function Response(props: ResponseProps) {
  Prism.manual = true
  const [showSchema, setShowSchema] = useState(ResponseState.fulfilled)

  const ResponseTab = (props: { title: string; target: ResponseState }) => {
    const selected = showSchema === props.target
    const border = selected ? 'border-b-orange-400' : 'border-b-transparent'
    return (
      <div
        className={`p-4 border-b-2 ${border} cursor-pointer`}
        onClick={() => setShowSchema(props.target)}
      >
        {props.title}
      </div>
    )
  }

  return (
    <div>
      <h3 className="mt-0 mb-4">Response</h3>
      <div>
        <div className="flex flex-row text-sm gap-x-1 border border-gray-300 rounded-t-lg">
          <ResponseTab
            target={ResponseState.fulfilled}
            title="Example response"
          />
          <ResponseTab target={ResponseState.schema} title="Response schema" />
        </div>
        <div className="max-h-96 overflow-y-auto border border-gray-300">
          <pre className="m-0 text-sm overflow-x-auto rounded-none bg-neutral-50">
            <code
              className="lang-js"
              data-manual
              dangerouslySetInnerHTML={{
                __html: Prism.highlight(
                  JSON.stringify(props[showSchema], null, 2),
                  Prism.languages.js,
                  'js'
                ),
              }}
            ></code>
          </pre>
        </div>
      </div>
    </div>
  )
}
