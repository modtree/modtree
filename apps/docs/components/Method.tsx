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
    <div>
      <p className="mb-6">{props.description}</p>
      <ParameterList {...params} />
    </div>
  )
}

const Right = (props: MethodProps) => {
  return (
    <div className="lg:mt-0 mt-10">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-x-8">
        <Left {...props} />
        <Right {...props} />
      </div>
    </>
  )
}
