type CustomError = 'Not found' | 'Database Error'

type RequestType = 'POST' | 'GET' | 'DELETE'

type Data = string | number | string[] | number[] | Record<string, any>

type SchemaItem = SchemaObject | SchemaNonObject | Record<string, unknown>

type SchemaNonObject = {
  type: string
  items?: SchemaItem // this param
}

type SchemaObject = {
  // for objects in the schema
  type: string
  properties: Record<string, SchemaItem>
}

type MethodProps = {
  method: string // short description
  description: string
  requestType: RequestType
  endpoint: string
  parameters: {
    pathParams?: Parameter[]
    queryParams?: Parameter[]
  }
  response: ResponseProps
}

type ResponseProps = {
  fulfilled: Record<string, Data>
  schema: SchemaItem
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
  pathParams?: Parameter[]
  queryParams?: Parameter[]
}
