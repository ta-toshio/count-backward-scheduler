import { gql } from '@apollo/client'
import { paginatorInfoFragment } from './app'

export const projectFragment = gql`
  fragment projectFragment on Project {
    id
    user_id
    slug
    title
    start_date
    end_date
    ratio
    coef
    color
    created_at
    updated_at
  }
`

export const MY_PROJECTS = gql`
  query MyProjects($page: Int!) {
    myProjects(page: $page) {
      data {
        ...projectFragment
      }
      paginatorInfo {
        ...paginatorInfoFragment
      }
    }
  }
  ${projectFragment}
  ${paginatorInfoFragment}
`
