import Parameter from './Parameter'

export default function ParameterList(props: ParameterList) {

  const PathParams = () => {
    return (
      <>
        <h5>Path Parameters</h5>
        {props.pathParams.map((one) => (
          <Parameter
            name={one.name}
            dataType={one.dataType}
            required={one.required}
            description={one.description}
          />
        ))}
      </>
    )
  }

  const QueryParams = () => {
    return (
      <>
        <h5>Query Parameters</h5>
        {props.queryParams.map((one) => (
          <Parameter
            name={one.name}
            dataType={one.dataType}
            required={one.required}
            description={one.description}
          />
        ))}
      </>
    )
  }

  function has(arr: any[]) {
    if (!arr) return false
    if (arr.length === 0) return false
    return true
  }

  return (
    <div>
      <h3 className="mt-0 mb-4">Parameters</h3>
      {has(props.pathParams) && <PathParams/>}
      {has(props.queryParams) && <QueryParams/>}
    </div>
  )
}
