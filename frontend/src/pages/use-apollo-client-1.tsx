import Layout from '../components/Layout'
import { withApollo } from '../app/withApollo'
import { ssrUser } from '../generated/page'

const ApolloPage = () => {
  const { loading, error, data } = ssrUser.usePage((_) => ({
    variables: { id: '1' },
  }))

  if (error) return <Layout>error</Layout>
  if (loading) return <Layout>Loading</Layout>

  return (
    <Layout>
      <section>{data.user.email}</section>
    </Layout>
  )
}

export default withApollo(ApolloPage)
