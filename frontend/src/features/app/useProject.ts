import { useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { useAppSelector } from '../../app/hooks'
import { selectRootUser } from '../user/userSlice'
import { MY_PROJECTS } from '../../queries/project'
import {
  MyProjectsQuery,
  MyProjectsQueryVariables,
} from '../../generated/graphql'

const useProject = () => {
  const { isAuthenticated } = useAppSelector(selectRootUser)
  const [getMyProjects, { called, loading, data }] = useLazyQuery<
    MyProjectsQuery,
    MyProjectsQueryVariables
  >(MY_PROJECTS, {
    variables: {
      page: 1,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      getMyProjects()
    }
  }, [isAuthenticated])

  return {
    myProjects: data && data.myProjects,
    myProjectsLoading: called && loading,
  }
}

export default useProject
