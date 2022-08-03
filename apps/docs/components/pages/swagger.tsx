import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'
import docs from '../../public/openapi-docs.json'

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false })

export default function Swagger() {
  /**
   * only allow try it out on GET
   * needs to be lowercase
   */
  const supportedMethods = ['get']

  /**
   * update the base url
   */
  docs.servers[0] = {
    url: process.env.NEXT_PUBLIC_SWAGGER,
  }

  return <SwaggerUI spec={docs} supportedSubmitMethods={supportedMethods} />
}
