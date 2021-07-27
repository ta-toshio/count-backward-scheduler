import React, { useEffect } from 'react'
import { useAppDispatch } from './hooks'
import { getUserAction } from '../features/user/userSlice'

const UserProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getUserAction())
  }, [])

  return <>{children}</>
}

export default UserProvider
