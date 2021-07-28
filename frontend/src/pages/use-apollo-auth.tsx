import { useQuery } from '@apollo/client'

import Layout from '../components/Layout'
import { USER_QUERY } from '../queries/user'

const UseApolloAuth = () => {
  const { loading, error, data } = useQuery(USER_QUERY, {
    variables: { id: 1 },
  })

  if (error) return <div>error</div>
  if (loading) return <div>Loading</div>
  console.log(data)

  return (
    <Layout>
      <section></section>
    </Layout>
  )
}

export default UseApolloAuth
