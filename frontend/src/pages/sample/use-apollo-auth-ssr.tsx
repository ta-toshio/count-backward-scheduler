import { GetServerSideProps } from 'next'
import { useQuery } from '@apollo/client'

import Layout from '../../components/Layout'
import { ME_QUERY } from '../../queries/user'
import { addApolloState, initializeApollo } from '../../app/withApollo'

const UseApolloAuthSsr = () => {
  const { loading, error, data } = useQuery(ME_QUERY)

  if (error) return <Layout>error</Layout>
  if (loading) return <Layout>Loading</Layout>

  return (
    <Layout>
      <section>{data.me.email}</section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const headers = {}
  headers['Cookie'] = ctx.req.headers.cookie
  headers['Referer'] = process.env.APP_URL
  const apolloClient = initializeApollo(null, { ctx, headers })
  try {
    await apolloClient.query({
      query: ME_QUERY,
    })
    return addApolloState(apolloClient, { props: {} })
  } catch (e) {
    console.warn(e)
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }
}

export default UseApolloAuthSsr
