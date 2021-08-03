import React from 'react'
import useProject from '../features/app/useProject'
import useConfig from '../features/app/useConfig'

const AppProvider: React.FC = ({ children }) => {
  useProject()
  useConfig()

  return <>{children}</>
}

export default AppProvider
