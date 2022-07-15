import '@/styles/globals.css'
import '@/styles/react-flow.css'
import '@/styles/html.css'
import { withTRPC } from '@trpc/next'
import type { AppRouter } from '@modtree/server'
import store from '@/store/redux'
import { Provider } from 'react-redux'
import { UserProvider } from '@auth0/nextjs-auth0'
import { useEffect } from 'react'
import { ReactFlowProvider } from 'react-flow-renderer'
import { AppProps } from 'next/app'

const ModtreeApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    try {
      if (window['Cypress']) {
        window['store'] = store
      }
    } catch {
      // frontend testing things, don't sweat it
    }
  }, [])
  return (
    <UserProvider>
      <Provider store={store}>
        <ReactFlowProvider>
          <Component {...pageProps} />
        </ReactFlowProvider>
      </Provider>
    </UserProvider>
  )
}

export default withTRPC<AppRouter>({
  config() {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND
    const url = envUrl ? envUrl + '/trpc' : 'http://localhost:8080/trpc'
    return { url }
  },
})(ModtreeApp)
