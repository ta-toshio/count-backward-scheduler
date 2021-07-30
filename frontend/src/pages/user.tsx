import type { NextPage } from 'next'
import Layout from '../components/Layout'
import { useStore } from 'react-redux'
import { selectRootUser } from '../features/user/userSlice'
import { useAppSelector } from '../app/hooks'
import { withStateUserServerSideProps } from '../app/userProvider'

const User: NextPage = () => {
  const { user } = useAppSelector(selectRootUser)

  // eslint-disable-next-line no-console
  console.log('State on render', useStore().getState())

  return (
    <Layout>
      <section>{user && user.email}</section>
    </Layout>
  )
}

export const getServerSideProps = withStateUserServerSideProps(null, {
  secret: true,
})

export default User
