import '../styles/globals.css'
import { AppProps } from 'next/app'
import { Container } from '../components/Container'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Container>
      <Component {...pageProps} />
    </Container>
  )
}

export default MyApp
