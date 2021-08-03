import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useAppSelector } from '../../app/hooks'
import { selectRootUser } from '../user/userSlice'
import { MY_CONFIG } from '../../queries/app'
import {
  MyConfigQuery,
  MyProjectsQueryVariables,
} from '../../generated/graphql'

const useConfig = () => {
  const { isAuthenticated } = useAppSelector(selectRootUser)
  const [getMyConfig, { called, loading, data }] = useLazyQuery<
    MyConfigQuery,
    MyProjectsQueryVariables
  >(MY_CONFIG)

  useEffect(() => {
    if (isAuthenticated) {
      getMyConfig()
    }
  }, [isAuthenticated])

  return {
    myConfig: data && data.myConfig,
    myConfigLoading: called && loading,
  }
}

export default useConfig
