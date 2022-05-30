import '@/styles/globals.css'
import { FC } from 'react'
import store from '@/store/redux'
import { Provider } from 'react-redux'
import { UserProvider } from '@auth0/nextjs-auth0'

export default function Modtree({
  Component,
  pageProps,
}: {
  Component: FC
  pageProps: any
}) {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserProvider>
  )
}
