import Parameter from "./Parameter"

export default function ParameterList(props: ParameterList) {
  return (
    <div>
      <div style={header}>
        <span style={requestType}>{props.requestType}</span>
        <code>{props.path}</code>
      </div>
      <h4>Parameters</h4>
      <h5>Path parameters</h5>
      {props.pathParams && props.pathParams.map((one) =>
        <Parameter
          name={one.name}
          dataType={one.dataType}
          required={one.required}
          description={one.description}
        />
      )}
    </div>
  )
}

const header: any = {
  margin: "8px 0"
}

const requestType: any = {
  border: "solid 1px black",
  borderRadius: "25px",
  padding: "4px",
  marginRight: "4px"
}
