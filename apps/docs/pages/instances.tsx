import Parameter from '../components/Parameter'
import ParameterList from '../components/ParameterList'
import Response from '../components/Response'

export const ParameterUsage = () => {
  return (
    <>
      <Parameter
        name="paramName"
        type="string"
        required={false}
        description={
          'This is where you can write your description for this parameter. Supports inline code like `src/` as expected.'
        }
      />
      <Parameter
        name="id"
        type="string"
        required={true}
        description="This is a required parameter."
      />
    </>
  )
}

export const ParameterSummaryUsage = () => {
  return (
    <ParameterList
      method="GET"
      path="/user/{userId}/degree/{degreeId}/modules"
      pathParams={[
        {
          name: 'degreeId',
          type: 'string',
          required: true,
          description: 'The ID of a degree',
        },
        {
          name: 'userId',
          type: 'string',
          required: true,
          description: 'The ID of a user',
        },
      ]}
    />
  )
}

export const ResponseUsage = (props: ResponseProps) => {
  const response = {
    code: 200,
    message: 'Success',
  }
  const schema = {
    code: 'int',
    message: 'string',
  }
  return (
    <Response
      fulfilled={response}
      schema={schema}
      rejected={props.rejected}
    />
  )
}
