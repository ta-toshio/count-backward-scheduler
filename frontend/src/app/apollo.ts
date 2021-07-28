import { useMemo } from 'react'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import { isServer } from '../utils/envHelper'

let apolloClient

function createApolloClient() {
  const csrfLink = setContext((_, { headers }) => {
    let token = ''
    if (!isServer()) {
      const r = RegExp('XSRF-TOKEN[^;]+').exec(document.cookie)
      token = decodeURIComponent(r ? r.toString().replace(/^[^=]+./, '') : '')
    }
    return {
      headers: {
        ...headers,
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': token,
      },
    }
  })

  const httpLink = new HttpLink({
    uri: (() => {
      return isServer
        ? process.env.API_SERVER_URI_FROM_SERVER + '/graphql'
        : process.env.API_SERVER_URI_FROM_BROWSER + '/graphql'
    })(),
    // credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    credentials: 'include',
  })

  return new ApolloClient({
    ssrMode: isServer(),
    link: csrfLink.concat(httpLink),
    cache: new InMemoryCache(),
  })
}

export const initializeApollo = (initialState = null) => {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // get hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    })

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data)
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}

export const useApollo = (initialState) => {
  return useMemo(() => initializeApollo(initialState), [initialState])
}
