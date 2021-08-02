import { useMemo } from 'react'
import { ApolloClient, concat, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'
import nookies from 'nookies'
import { isServer } from '../utils/envHelper'
import { getCsrfCookie } from '../features/user/userAPI'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient

function createApolloClient(options) {
  const csrfLink = setContext(async (_, { headers }) => {
    let token = ''

    if (!isServer()) {
      token = await getCsrfCookie()
    }
    if (options && options.ctx) {
      const cookies = nookies.get(options.ctx)
      token = cookies['XSRF-TOKEN'] ?? ''
    }

    return {
      headers: {
        ...headers,
        'X-Requested-With': 'XMLHttpRequest',
        ...(token ? { 'X-XSRF-TOKEN': token } : {}),
        // ...(options && options.ctx
        //   ? {
        //       Referer: process.env.APP_URL,
        //     }
        //   : {}),
        ...(options && options.headers ? options.headers : {}),
      },
    }
  })

  const httpLink = new HttpLink({
    uri: (() => {
      return isServer()
        ? process.env.API_SERVER_URI_FROM_SERVER + '/graphql'
        : process.env.API_SERVER_URI_FROM_BROWSER + '/graphql'
    })(),
    // credentials: 'same-origin', // Additional fetch() options like `credentials` or `headers`
    credentials: 'include',
  })

  return new ApolloClient({
    ssrMode: isServer(),
    link: concat(csrfLink, httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            // calendar: {
            //   keyArgs: false,
            //   merge(existing = [], incoming) {
            //   },
            // },
          },
        },
      },
    }),
  })
}

export const initializeApollo = (initialState = null, options = {}) => {
  const _apolloClient = apolloClient ?? createApolloClient(options)

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

export const useApollo = (pageProps) => {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const store = useMemo(() => initializeApollo(state), [state])
  return store
}

export const addApolloState = (client, pageProps) => {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }

  return pageProps
}
