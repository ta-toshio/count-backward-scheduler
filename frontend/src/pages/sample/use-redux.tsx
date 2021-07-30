import Layout from '../../components/Layout'
import { useAppDispatch, useInterval } from '../../app/hooks'
import Clock from '../../features/clock/Clock'
import { tick } from '../../features/clock/clockSlice'
import { wrapper } from '../../app/store'
import { useStore } from 'react-redux'

function ReduxPage() {
  // eslint-disable-next-line no-console
  console.log('State on render', useStore().getState())
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

export const getStaticProps = wrapper.getStaticProps((store) => () => {
  store.dispatch(tick(Date.now()))
  return {
    props: {},
  }
})

export default ReduxPage
