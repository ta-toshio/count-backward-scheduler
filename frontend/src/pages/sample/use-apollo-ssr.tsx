import { GetServerSideProps } from 'next'
import { useQuery } from '@apollo/client'

import Layout from '../../components/Layout'
import { USER_QUERY } from '../../queries/user'
import { addApolloState, initializeApollo } from '../../app/withApollo'

const UseApolloAuthSsr = () => {
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { id: 1 },
  })

  if (error) return <Layout>error</Layout>
  if (loading) return <Layout>Loading</Layout>

  return (
    <Layout>
      <section>{data.user.email}</section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apolloClient = initializeApollo(null, { ctx })
  try {
    await apolloClient.query({
      query: USER_QUERY,
      variables: { id: 1 },
    })
    return addApolloState(apolloClient, { props: {} })
  } catch (e) {
    console.warn(e)
    return {
      notFound: true,
    }
  }
}

export default UseApolloAuthSsr
