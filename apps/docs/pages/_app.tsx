import 'nextra-theme-docs/style.css'
import { FC } from 'react'

export default function Nextra({
  Component,
  pageProps,
}: {
  Component: FC;
  pageProps: any;
}) {
  return <Component {...pageProps} />
}
