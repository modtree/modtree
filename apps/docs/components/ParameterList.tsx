import Parameter from './Parameter'

export default function ParameterList(props: ParameterList) {
  const SomeParams = (props: { title: string; data: Parameter[] }) => {
    return (
      <>
        <h5 className="mt-6">{props.title}</h5>
        {props.data.map((one, i) => (
          <Parameter
            key={`${one.name}-${i}`}
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
      <h3 className="my-0">Parameters</h3>
      {has(props.pathParams) && (
        <SomeParams title="Path Parameters" data={props.pathParams} />
      )}
      {has(props.queryParams) && (
        <SomeParams title="Query Parameters" data={props.queryParams} />
      )}
    </div>
  )
}
