import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'

import { wrapper } from '../app/store'
import UserProvider from '../app/userProvider'
import { useApollo } from '../app/withApollo'

import '../styles/global.scss'
import CsrfProvider from '../app/csrfProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)
  return (
    <CsrfProvider>
      <ApolloProvider client={apolloClient}>
        <UserProvider>
          <Component {...pageProps} />
        </UserProvider>
      </ApolloProvider>
    </CsrfProvider>
  )
}

export default wrapper.withRedux(MyApp)
