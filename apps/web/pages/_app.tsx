import '../styles/globals.css'
import { Container } from '../components/Container'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { store } from '../contexts/redux'

function MyApp({
  Component,
  pageProps,
}: {
  Component: FC
  pageProps: any
}) {
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
