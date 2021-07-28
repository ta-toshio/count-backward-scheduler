import { GetServerSideProps } from 'next'
import { useQuery } from '@apollo/client'

import Layout from '../components/Layout'
import { ME_QUERY } from '../queries/user'
import { ssrMe } from '../generated/page'
import { withApollo } from '../app/withApollo'

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
  try {
    return await ssrMe.getServerPage({}, ctx)
  } catch (e) {
    console.log(e)
    return {
      redirect: {
        permanent: false,
        destination: '/login',
      },
    }
  }
}

export default withApollo(UseApolloAuthSsr)
