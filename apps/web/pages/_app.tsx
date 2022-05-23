import '../styles/globals.css'
import { AppProps } from 'next/app'
import { Container } from '../components/Container'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  console.log(router.route)
  const noContainerList = ['/flow']
  const noContainer = noContainerList.includes(router.route)
  return noContainer ? (
    <Component {...pageProps} />
  ) : (
    <Container>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp
