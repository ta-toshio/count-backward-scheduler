import { gql, useQuery } from '@apollo/client'

import Layout from '../components/Layout'
import { initializeApollo } from '../app/apollo'

export const USERS_QUERY = gql`
  query users($page: Int!) {
    users(page: $page) {
      data {
        id
        name
      }
      paginatorInfo {
        count
      }
    }
  }
`
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

  if (error) return <div>error</div>
  if (loading) return <div>Loading</div>

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

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
    revalidate: 1,
  }
}

export default ApolloPage
