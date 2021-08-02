import React, { ReactElement } from 'react'
import { CircleLoadingIcon } from '../icon/SvgIcon'
import { Props as SvgIconProps } from './../icon/SvgIcon'
import Layout from '../Layout'

const ScreenSpinner: React.FC = (): ReactElement => {
  return (
    <Layout>
      <div className="full-content content-center">
        <CircleLoadingIcon size="lg" />
      </div>
    </Layout>
  )
}

export default ScreenSpinner

type LoadingProps = {
  loading: boolean
  size?: SvgIconProps['size']
}

export const Loading: React.FC<LoadingProps> = ({ loading, size = 'md' }) => (
  <>{loading && <CircleLoadingIcon size={size} />}</>
)
