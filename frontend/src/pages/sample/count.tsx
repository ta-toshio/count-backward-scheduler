import type { NextPage } from 'next'

import Counter from '../../features/counter/Counter'
import Layout from '../../components/Layout'

const CounterPage: NextPage = () => {
  return (
    <Layout title="About | Next.js + TypeScript Example">
      <Counter />
    </Layout>
  )
}

export default CounterPage
