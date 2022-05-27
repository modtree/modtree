import { useState } from 'react'

enum ResponseState {
  fulfilled = 'fulfilled',
  schema = 'schema',
  rejected = 'rejected',
}

export default function Response(props: ResponseProps) {
  const [showSchema, setShowSchema] = useState(ResponseState.fulfilled)

  return (
    <div>
      <h5>Response</h5>
      <div>
        <div>
          <button
            style={menuitem}
            onClick={() => setShowSchema(ResponseState.fulfilled)}
          >
            Sample response
          </button>
          <button
            style={menuitem}
            onClick={() => setShowSchema(ResponseState.schema)}
          >
            Response schema
          </button>
          <button
            style={menuitem}
            onClick={() => setShowSchema(ResponseState.rejected)}
          >
            Rejected response
          </button>
        </div>
        <div>
          <div>
            <pre>{JSON.stringify(props[showSchema], null, 4)}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

const menuitem: any = {
  padding: '4px',
  border: 'solid black 1px',
  borderRadius: '15px',
}
