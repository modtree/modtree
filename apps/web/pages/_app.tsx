import '@/styles/globals.css'
import { FC } from 'react'
import store from '@/store/redux'
import { Provider } from 'react-redux'

export default function Modtree({ Component, pageProps }: { Component: FC; pageProps: any }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}
