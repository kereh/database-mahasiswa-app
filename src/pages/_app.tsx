import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { trpc } from 'src/utils/trpc'
import { SessionProvider } from 'next-auth/react'
import 'src/styles/globals.css'

function MyApp({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)