import React, { ReactElement } from 'react'
import Layout from '../Layout'

const ScreenSpinner: React.FC = (): ReactElement => {
  return (
    <Layout>
      <div className="full-content content-center">Loading</div>
    </Layout>
  )
}

export default ScreenSpinner
