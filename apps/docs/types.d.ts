type Error =
  | 'Not found'
  | 'Database Error'

type ApiReferenceProps = {
  base: string
  action: string // short description
  description: string
  type: 'POST' | 'GET' | 'DELETE'
  endpoint: string
  parameters: {
    pathParams: Parameter[]
    queryParams: Parameter[]
  }
  response: {
    fulfilled: Record<string, any>
    schema: Record<string, any>
    rejected: {
      message: string
      error: Error
    }
  }
}

type Parameter = {
  name: string
  type: string
  required: boolean
  description: string
}
