import ParameterList from './ParameterList'
import Response from './Response'

const Left = (props: MethodProps) => {
  const params: ParameterList = {
    requestType: props.requestType,
    path: props.endpoint,
    pathParams: props.parameters.pathParams,
    queryParams: props.parameters.queryParams,
  }
  return (
    <div className="flex-1">
      <p className="mb-6">{props.description}</p>
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
      <div className="flex flex-row my-4 mx-2">
        <div>
          <span
            style={{
              backgroundColor: 'hsl(var(--nextra-primary-hue), 100%, 60%)',
            }}
            className="text-sm rounded-full text-white px-2.5 py-1 font-mono font-semibold mr-2"
          >
            {props.requestType}
          </span>
        </div>
        <code className="break-all">{props.endpoint}</code>
      </div>
      <div className="flex flex-row w-full gap-x-8">
        <Left {...props} />
        <Right {...props} />
      </div>
    </>
  )
}
