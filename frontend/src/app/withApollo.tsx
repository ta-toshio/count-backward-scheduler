import {
  ApolloClient,
  NormalizedCacheObject,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getCsrfToken, isServer } from '../utils/envHelper'

export const withApollo = (Comp) => (props: any) => {
  return (
    <ApolloProvider client={getApolloClient(null, props.apolloState)}>
      <Comp {...props} />
    </ApolloProvider>
  )
}

export const getApolloClient = (
  ctx?: any,
  initialState?: NormalizedCacheObject
) => {
  const csrfLink = setContext((_, { headers }) => {
    const myHeaders = {
      ...headers,
    }

    if (ctx) {
      myHeaders['Cookie'] = ctx.req.headers.cookie
      myHeaders['Referer'] = process.env.APP_URL
      myHeaders['X-XSRF-TOKEN'] = getCsrfToken(ctx.req.headers.cookie)
    } else {
      myHeaders['X-Requested-With'] = 'XMLHttpRequest'
      myHeaders['X-XSRF-TOKEN'] =
        typeof document !== 'undefined' ? getCsrfToken(document.cookie) : ''
    }

    return {
      headers: myHeaders,
    }
  })

  const httpLink = new HttpLink({
    uri: (() => {
      return isServer
        ? process.env.API_SERVER_URI_FROM_SERVER + '/graphql'
        : process.env.API_SERVER_URI_FROM_BROWSER + '/graphql'
    })(),
    credentials: 'include',
  })

  const cache = new InMemoryCache().restore(initialState || {})
  return new ApolloClient({
    link: csrfLink.concat(httpLink),
    cache,
  })
}
