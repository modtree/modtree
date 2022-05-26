import Parameter from "../components/Parameter"
import ParameterSummary from "../components/ParameterSummary"
import Response from "../components/Response"

export const ParameterUsage = () => {
  return (<>
    <Parameter
      name="paramName"
      type="string"
      required={false}
    >
      This is where you can write your description for this parameter. Supports inline code like <code>src/</code> as expected.
    </Parameter>
    <Parameter
        name="id"
        type="string"
        required={true}
    >
        This is a required parameter.
    </Parameter>
  </>)
}

export const ParameterSummaryUsage = () => {
  return (
    <ParameterSummary
      method="GET"
      path="/user/{userId}/degree/{degreeId}/modules"
      pathParams={[
        {
          name: "degreeId",
          type: "string",
          required: "true",
          content: "The ID of a degree"
        },
        {
          name: "userId",
          type: "string",
          required: "true",
          content: "The ID of a user"
        }
      ]}
    />
  )
}

export const ResponseUsage = () => {
  const response = {
    code: 200,
    message: "Success",
  }
  const schema = {
    code: "int",
    message: "string",
  }
  return (
    <Response
response={`{
    code: 200,
    message: "Success",
}`}
schema={`{
    code: "int",
    message: "string",
}`}
    />
  )
}
