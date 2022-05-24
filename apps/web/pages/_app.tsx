import '../styles/globals.css'
import { Container } from '@/components/Container'
import { useRouter } from 'next/router'
import { FC } from 'react'
import store from '@/store/redux'
import { Provider } from 'react-redux'

function MyApp({ Component, pageProps }: { Component: FC; pageProps: any }) {
  const router = useRouter()
  console.log(router.route)
  const noContainerList = ['/']
  const noContainer = noContainerList.includes(router.route)
  return (
    <Provider store={store}>
      {noContainer ? (
        <Component {...pageProps} />
      ) : (
        <Container>
          <Component {...pageProps} />
        </Container>
      )}
    </Provider>
  )
}

export default MyApp
