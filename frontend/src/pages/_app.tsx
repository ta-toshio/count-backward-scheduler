import { Provider } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'

import store from '../app/store'
import { useApollo } from '../app/apollo'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps.initialApolloState)
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  )
}

export default MyApp
