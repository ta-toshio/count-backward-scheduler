import { gql } from '@apollo/client'

export const userFragment = gql`
  fragment userFragment on User {
    id
    name
    email
    email_verified_at
    created_at
    updated_at
  }
`

export const USERS_QUERY = gql`
  query users($page: Int!) {
    users(page: $page) {
      data {
        ...userFragment
      }
      paginatorInfo {
        count
      }
    }
  }
  ${userFragment}
`

export const USER_QUERY = gql`
  query user($id: ID!) {
    user(id: $id) {
      ...userFragment
    }
  }
  ${userFragment}
`
