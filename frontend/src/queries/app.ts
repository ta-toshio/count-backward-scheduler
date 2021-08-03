import { gql } from '@apollo/client'

export const paginatorInfoFragment = gql`
  fragment paginatorInfoFragment on PaginatorInfo {
    count
    currentPage
    firstItem
    hasMorePages
    lastItem
    lastPage
    perPage
    total
  }
`

export const configFragment = gql`
  fragment configFragment on Config {
    id
    user_id
    start_date
    sprint
    hour_of_day
    point_of_day
    project_of_day
    holidays
    created_at
    updated_at
  }
`

export const MY_CONFIG = gql`
  query MyConfig {
    myConfig {
      ...configFragment
    }
  }
  ${configFragment}
`
