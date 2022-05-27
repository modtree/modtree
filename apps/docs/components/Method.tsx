import ParameterList from './ParameterList'
import Response from './Response'

const Left = (props: MethodProps) => {
  const params: ParameterList = {
    requestType: props.requestType,
    path: props.endpoint,
    pathParams: props.parameters.pathParams,
    queryParams: props.parameters.queryParams
  }
  return (
    <div className="flex-1">
      <ParameterList {...params} />
    </div>
  )
}

const Right = (props: MethodProps) => {
  return (
    <div className="w-1/2">
      <Response {...props.response} />
    </div>
  )
}

export default function Method(props: MethodProps) {
  return (
    <>
      <h2>{props.method}</h2>
      <div className="flex flex-row my-4 mx-2">
        <div>
          <span className="text-sm rounded-full bg-blue-500 text-white px-2.5 py-1 font-mono font-semibold mr-2">
            {props.requestType}
          </span>
        </div>
        <code className="break-all">{props.endpoint}/foo-bar-baz</code>
      </div>
      <div className="flex flex-row w-full gap-x-8">
        <Left {...props} />
        <Right {...props} />
      </div>
    </>
  )
}
