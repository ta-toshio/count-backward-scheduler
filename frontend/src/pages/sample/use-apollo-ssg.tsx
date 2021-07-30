import { useQuery } from '@apollo/client'

import Layout from '../../components/Layout'
import { USERS_QUERY } from '../../queries/user'
import { addApolloState, initializeApollo } from '../../app/withApollo'

export const allPostsQueryVars = {
  page: 1,
}

const ApolloPage = () => {
  const { loading, error, data } = useQuery(USERS_QUERY, {
    variables: allPostsQueryVars,
    // Setting this value to true will make the component rerender when
    // the "networkStatus" changes, so we are able to know if it is fetching
    // more data
    notifyOnNetworkStatusChange: true,
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

export async function getStaticProps() {
  const apolloClient = initializeApollo()

  await apolloClient.query({
    query: USERS_QUERY,
    variables: allPostsQueryVars,
  })

  return addApolloState(apolloClient, { props: {}, revalidate: 1 })
}

export default ApolloPage
