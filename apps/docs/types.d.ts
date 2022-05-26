type Header = {
  name: string
  type: string
  description: string
  required?: boolean
}

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
