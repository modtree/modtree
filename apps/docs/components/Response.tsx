import { useState } from "react"

export default function Response(props: any) {
  const [showSchema, setShowSchema] = useState(false)

  return (
    <div>
      <h5>Response</h5>
      <div>
        <div>
          <button style={menuitem} onClick={() => setShowSchema(false)}>Sample response</button>
          <button style={menuitem} onClick={() => setShowSchema(true)}>Response schema</button>
        </div>
        <div>
          {!showSchema ? (
            // sample response
            <div>
              <pre>{JSON.parse(JSON.stringify(props.response, null, 2))}</pre>
            </div>
          ) : (
            // response schema
            <div>
              <pre>{JSON.parse(JSON.stringify(props.schema, null, 2))}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const menuitem: any = {
  padding: "4px",
  border: "solid black 1px",
  borderRadius: "15px",
}
