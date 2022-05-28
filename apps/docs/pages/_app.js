import '@/styles/styles.css'
import 'nextra-theme-docs/style.css'
import '@/styles/custom.css'
import '@/styles/prism-github.css'

import { SSRProvider } from '@react-aria/ssr'

// Shim requestIdleCallback in Safari
if (typeof window !== 'undefined' && !('requestIdleCallback' in window)) {
  window.requestIdleCallback = (fn) => setTimeout(fn, 1)
  window.cancelIdleCallback = (e) => clearTimeout(e)
}

export default function Nextra({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(
    <>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </>
  )
}
