import { useQuery } from '@apollo/client'

import Layout from '../components/Layout'
import { USERS_QUERY } from '../queries/user'

export const allPostsQueryVars = {
  page: 1,
}

const ApolloPage = () => {
  const { loading, error, data } = useQuery(USERS_QUERY, {
    variables: allPostsQueryVars,
  })

  if (error) return <Layout>error</Layout>
  if (loading) return <Layout>Loading</Layout>

  const { users: queryResult } = data
  const { data: users } = queryResult

  return (
    <Layout>
      <section>
        <ul>
          {users &&
            users.map((user, index) => (
              <li key={user.id}>
                <div>
                  <span>{index + 1}. </span>
                  <span>{user.name}</span>
                </div>
              </li>
            ))}
        </ul>
      </section>
    </Layout>
  )
}

export default ApolloPage
