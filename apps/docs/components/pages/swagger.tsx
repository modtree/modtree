import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false })

export default function Swagger() {
  /**
   * only allow try it out on GET
   * needs to be lowercase
   */
  const supportedMethods = ['get']

  return (
    <SwaggerUI
      url="/openapi-docs.yml"
      supportedSubmitMethods={supportedMethods}
    />
  )
}
