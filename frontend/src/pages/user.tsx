import type { NextPage } from 'next'
import { wrapper } from '../app/store'
import Layout from '../components/Layout'
import { useStore } from 'react-redux'
import { getUserAction, selectRootUser } from '../features/user/userSlice'
import { useAppSelector } from '../app/hooks'

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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    if (!ctx.req.headers.cookie) {
      return {
        props: {},
      }
    }
    const getParam = {
      headers: {
        Cookie: ctx.req.headers.cookie,
      },
    }
    await store.dispatch(getUserAction({ getParam }))

    console.log('State on server', store.getState())

    return {
      props: {},
    }
  }
)

export default User
