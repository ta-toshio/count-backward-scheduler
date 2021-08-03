import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { ToastContainer } from 'react-toastify'

import { wrapper } from '../app/store'
import CsrfProvider from '../app/csrfProvider'
import UserProvider from '../app/userProvider'
import { useApollo } from '../app/withApollo'

import '../styles/global.scss'
import 'react-toastify/dist/ReactToastify.css'
import AppProvider from '../app/appProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps)
  return (
    <>
      <CsrfProvider>
        <ApolloProvider client={apolloClient}>
          <UserProvider>
            <AppProvider>
              <Component {...pageProps} />
            </AppProvider>
          </UserProvider>
        </ApolloProvider>
      </CsrfProvider>
      <ToastContainer />
    </>
  )
}

export default wrapper.withRedux(MyApp)
