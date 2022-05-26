type PathParameter = Header

type ApiReferenceProps = {
  title: string
  description: string
  endpoint: string
  parameters: {
    headers: Header[]
    pathParameters: PathParameter[]
  }
}

type ParameterProps = {
  name: string
  type: string
  required: string | boolean
  children: ReactElement[] | ReactElement
}

type Header = {
  name: string
  type: string
  required: string
  content: string
}

type ParameterSummaryProps = {
  name: string
  method: string
  path: string
  pathParams: Header[]
}
