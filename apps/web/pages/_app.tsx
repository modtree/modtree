import '@/styles/globals.css'
import store from '@/store/redux'
import { Provider } from 'react-redux'
import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'

export default function Modtree({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserProvider>
  )
}
