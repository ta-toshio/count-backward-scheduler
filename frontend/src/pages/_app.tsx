import type { AppProps } from 'next/app'

import { wrapper } from '../app/store'
import UserProvider from '../app/userProvider'

import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <Component {...pageProps} />
    </UserProvider>
  )
}

export default wrapper.withRedux(MyApp)
