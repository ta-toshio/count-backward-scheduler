import Layout from '../components/Layout'
import { useAppDispatch, useInterval } from '../app/hooks'
import { initializeStore } from '../app/store'
import Clock from '../features/clock/Clock'
import { tick } from '../features/clock/clockSlice'

function ReduxPage() {
  // Tick the time every second
  const dispatch = useAppDispatch()

  useInterval(() => {
    dispatch(tick(Date.now()))
  }, 1000)

  return (
    <Layout>
      <Clock />
    </Layout>
  )
}

export async function getStaticProps() {
  const reduxStore = initializeStore()
  const { dispatch } = reduxStore

  dispatch(tick(Date.now()))

  return {
    props: {
      initialReduxState: reduxStore.getState(),
    },
    revalidate: 1,
  }
}

export default ReduxPage
