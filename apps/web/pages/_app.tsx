import '@/styles/globals.css'
import '@/styles/react-flow.css'
import '@/styles/html.css'
import { SessionProvider } from 'next-auth/react'
import { withTRPC } from '@trpc/next'
import type { AppRouter } from '@modtree/server'
import store from '@/store/redux'
import { Provider as ReduxProvider } from 'react-redux'
import { useEffect } from 'react'
import { ReactFlowProvider } from 'react-flow-renderer'
import { AppProps } from 'next/app'

const ModtreeApp = ({ Component, pageProps }: AppProps) => {
  useEffect(() => {
    /** attach cypress listeners to redux state */
    if ((window as any)['Cypress']) (window as any)['store'] = store
  }, [])

  /**
   * main app structure
   */
  return (
    <SessionProvider>
      <ReduxProvider store={store}>
        <ReactFlowProvider>
          <Component {...pageProps} />
        </ReactFlowProvider>
      </ReduxProvider>
    </SessionProvider>
  )
}

/**
 * gives access to trpc react hooks
 */
export default withTRPC<AppRouter>({
  config() {
    const envUrl = process.env.NEXT_PUBLIC_BACKEND
    const url = envUrl ? envUrl + '/trpc' : 'http://localhost:8080/trpc'
    return { url }
  },
})(ModtreeApp)
