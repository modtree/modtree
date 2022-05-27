import Method from '../components/Method'
import Parameter from '../components/Parameter'
import ParameterList from '../components/ParameterList'
import Response from '../components/Response'

export const ParameterUsage = () => {
  return (
    <>
      <Parameter
        name="paramName"
        dataType="string"
        required={false}
        description={
          'This is where you can write your description for this parameter. Supports inline code like `src/` as expected.'
        }
      />
      <Parameter
        name="id"
        dataType="string"
        required={true}
        description="This is a required parameter."
      />
    </>
  )
}

const pathParams: Parameter[] = [
  {
    name: 'degreeId',
    dataType: 'string',
    required: true,
    description: 'The ID of a degree',
  },
  {
    name: 'userId',
    dataType: 'string',
    required: true,
    description: 'The ID of a user',
  },
]
const method = 'GET'
const path = '/user/{userId}/degree/{degreeId}/modules'

export const ParameterSummaryUsage = () => {
  return (
    <ParameterList
      requestType="GET"
      path="/user/{userId}/degree/{degreeId}/modules"
      pathParams={pathParams}
    />
  )
}

const response = {
  code: 200,
  message: 'Success',
}
const schema = {
  code: 'int',
  message: 'string',
}

export const ResponseUsage = (props: ResponseProps) => {
  return (
    <Response fulfilled={response} schema={schema} rejected={props.rejected} />
  )
}

export const MethodUsage = () => {
  const props: MethodProps = {
    base: 'Module',
    method: 'Get a module',
    requestType: method,
    endpoint: path,
    parameters: {
      pathParams,
      queryParams: [],
    },
    description: 'yes',
    response: {
      fulfilled: response,
      schema,
      rejected: {
        message: 'error',
        error: 'Not found',
      },
    },
  }
  return <Method {...props} />
}
