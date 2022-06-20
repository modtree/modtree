import '@/styles/globals.css'
import '@/styles/react-flow.css'
import '@/styles/html.css'
import store from '@/store/redux'
import { Provider } from 'react-redux'
import { UserProvider } from '@auth0/nextjs-auth0'
import { AppProps } from 'next/app'
import { FC } from 'react'

export default function Modtree({
  Component,
  pageProps,
}: AppProps & { Component: FC }) {
  return (
    <UserProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </UserProvider>
  )
}
