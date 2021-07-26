import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'

import { wrapper } from '../app/store'
import { useApollo } from '../app/apollo'

import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}

export default wrapper.withRedux(MyApp)
