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
  query Users($page: Int!) {
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
  query User($id: ID!) {
    user(id: $id) {
      ...userFragment
    }
  }
  ${userFragment}
`

export const ME_QUERY = gql`
  query Me {
    me {
      ...userFragment
    }
  }
  ${userFragment}
`
