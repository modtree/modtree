import ParameterList from './ParameterList'
import Response from './Response'

const Left = (props: MethodProps) => {
  const foo: ParameterList = {
    requestType: props.requestType,
    path: props.endpoint,
    pathParams: props.parameters.pathParams,
  }
  return (
    <div className="w-1/2 bg-green-100">
      <ParameterList {...foo} />
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
      <div className="flex flex-row gap-x-2">
        <Left {...props} />
        <Right {...props} />
      </div>
    </>
  )
}
