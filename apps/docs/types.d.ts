type CustomError = 'Not found' | 'Database Error'

type RequestType = 'POST' | 'GET' | 'DELETE'

type MethodProps = {
  base: string
  method: string // short description
  description: string
  requestType: RequestType
  endpoint: string
  parameters: {
    pathParams: Parameter[]
    queryParams: Parameter[]
  }
  response: ResponseProps
}

type ResponseProps = {
  fulfilled: Record<string, any>
  schema: Record<string, any>
  rejected: {
    message: string
    error: CustomError
  }
}

type Parameter = {
  name: string
  dataType: string
  required: boolean
  description: string
}

type ParameterList = {
  requestType: RequestType
  path: string
  pathParams: Parameter[]
}
