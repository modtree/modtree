import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false })

export default function Swagger() {
  return <SwaggerUI url="/openapi-docs.yml" />
}
