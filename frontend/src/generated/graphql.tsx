import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string with format `Y-m-d`, e.g. `2011-05-23`. */
  Date: any;
  /** A datetime string with format `Y-m-d H:i:s`, e.g. `2018-05-23 13:43:32`. */
  DateTime: any;
};

export type Calendar = {
  __typename?: 'Calendar';
  data: Array<ScheduledTask>;
  info: CalendarPageInfo;
};

export type CalendarPageInfo = {
  __typename?: 'CalendarPageInfo';
  next: Scalars['Boolean'];
  prev: Scalars['Boolean'];
};



export type LoginAsGoogleInput = {
  provider: Scalars['String'];
  id_token: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  loginAsSocial?: Maybe<User>;
};


export type MutationLoginAsSocialArgs = {
  input: LoginAsGoogleInput;
};

/** Allows ordering a list of records. */
export type OrderByClause = {
  /** The column that is used for ordering. */
  column: Scalars['String'];
  /** The direction that is used for ordering. */
  order: SortOrder;
};

/** Information about pagination using a Relay style cursor connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** The cursor to continue paginating backwards. */
  startCursor?: Maybe<Scalars['String']>;
  /** The cursor to continue paginating forwards. */
  endCursor?: Maybe<Scalars['String']>;
  /** Total number of nodes in the paginated connection. */
  total: Scalars['Int'];
  /** Number of nodes in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the last available page. */
  lastPage: Scalars['Int'];
};

/** Information about pagination using a fully featured paginator. */
export type PaginatorInfo = {
  __typename?: 'PaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Are there more pages after this one? */
  hasMorePages: Scalars['Boolean'];
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Index of the last available page. */
  lastPage: Scalars['Int'];
  /** Number of items per page. */
  perPage: Scalars['Int'];
  /** Number of total available items. */
  total: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  user?: Maybe<User>;
  me?: Maybe<User>;
  calendar: Calendar;
  users?: Maybe<UserPaginator>;
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['ID']>;
};


export type QueryCalendarArgs = {
  start?: Maybe<Scalars['Date']>;
  end?: Maybe<Scalars['Date']>;
};


export type QueryUsersArgs = {
  first?: Maybe<Scalars['Int']>;
  page?: Maybe<Scalars['Int']>;
};

export type ScheduledTask = {
  __typename?: 'ScheduledTask';
  id: Scalars['ID'];
  user_id: Scalars['Int'];
  project_id: Scalars['Int'];
  task_id: Scalars['Int'];
  the_date: Scalars['Date'];
  point: Scalars['Int'];
  volume: Scalars['Float'];
  created_at?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
  task: Task;
};

/** Information about pagination using a simple paginator. */
export type SimplePaginatorInfo = {
  __typename?: 'SimplePaginatorInfo';
  /** Number of items in the current page. */
  count: Scalars['Int'];
  /** Index of the current page. */
  currentPage: Scalars['Int'];
  /** Index of the first item in the current page. */
  firstItem?: Maybe<Scalars['Int']>;
  /** Index of the last item in the current page. */
  lastItem?: Maybe<Scalars['Int']>;
  /** Number of items per page. */
  perPage: Scalars['Int'];
};

/** The available directions for ordering a list of records. */
export enum SortOrder {
  /** Sort records in ascending order. */
  Asc = 'ASC',
  /** Sort records in descending order. */
  Desc = 'DESC'
}

export type Task = {
  __typename?: 'Task';
  id: Scalars['ID'];
  user_id: Scalars['Int'];
  project_id: Scalars['Int'];
  title: Scalars['String'];
  point: Scalars['Int'];
  org_point: Scalars['Float'];
  volume: Scalars['Int'];
  days: Scalars['String'];
  created_at?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

/** Specify if you want to include or exclude trashed results from a query. */
export enum Trashed {
  /** Only return trashed results. */
  Only = 'ONLY',
  /** Return both trashed and non-trashed results. */
  With = 'WITH',
  /** Only return non-trashed results. */
  Without = 'WITHOUT'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  email_verified_at?: Maybe<Scalars['DateTime']>;
  created_at?: Maybe<Scalars['DateTime']>;
  updated_at?: Maybe<Scalars['DateTime']>;
};

/** A paginated list of User items. */
export type UserPaginator = {
  __typename?: 'UserPaginator';
  /** Pagination information about the list of items. */
  paginatorInfo: PaginatorInfo;
  /** A list of User items. */
  data: Array<User>;
};

export type TaskFragmentFragment = (
  { __typename?: 'Task' }
  & Pick<Task, 'id' | 'user_id' | 'project_id' | 'title' | 'point' | 'org_point' | 'volume' | 'days' | 'created_at' | 'updated_at'>
);

export type ScheduledTaskFragmentFragment = (
  { __typename?: 'ScheduledTask' }
  & Pick<ScheduledTask, 'id' | 'user_id' | 'project_id' | 'task_id' | 'the_date' | 'point' | 'volume' | 'created_at' | 'updated_at'>
);

export type CalendarQueryVariables = Exact<{
  start?: Maybe<Scalars['Date']>;
  end?: Maybe<Scalars['Date']>;
}>;


export type CalendarQuery = (
  { __typename?: 'Query' }
  & { calendar: (
    { __typename?: 'Calendar' }
    & { data: Array<(
      { __typename?: 'ScheduledTask' }
      & { task: (
        { __typename?: 'Task' }
        & TaskFragmentFragment
      ) }
      & ScheduledTaskFragmentFragment
    )>, info: (
      { __typename?: 'CalendarPageInfo' }
      & Pick<CalendarPageInfo, 'prev' | 'next'>
    ) }
  ) }
);

export type UserFragmentFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'name' | 'email' | 'email_verified_at' | 'created_at' | 'updated_at'>
);

export type UsersQueryVariables = Exact<{
  page: Scalars['Int'];
}>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<(
    { __typename?: 'UserPaginator' }
    & { data: Array<(
      { __typename?: 'User' }
      & UserFragmentFragment
    )>, paginatorInfo: (
      { __typename?: 'PaginatorInfo' }
      & Pick<PaginatorInfo, 'count'>
    ) }
  )> }
);

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = (
  { __typename?: 'Query' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export type LoginAsSocialMutationVariables = Exact<{
  input: LoginAsGoogleInput;
}>;


export type LoginAsSocialMutation = (
  { __typename?: 'Mutation' }
  & { loginAsSocial?: Maybe<(
    { __typename?: 'User' }
    & UserFragmentFragment
  )> }
);

export const TaskFragmentFragmentDoc = gql`
    fragment taskFragment on Task {
  id
  user_id
  project_id
  title
  point
  org_point
  volume
  days
  created_at
  updated_at
}
    `;
export const ScheduledTaskFragmentFragmentDoc = gql`
    fragment scheduledTaskFragment on ScheduledTask {
  id
  user_id
  project_id
  task_id
  the_date
  point
  volume
  created_at
  updated_at
}
    `;
export const UserFragmentFragmentDoc = gql`
    fragment userFragment on User {
  id
  name
  email
  email_verified_at
  created_at
  updated_at
}
    `;
export const CalendarDocument = gql`
    query Calendar($start: Date, $end: Date) {
  calendar(start: $start, end: $end) {
    data {
      ...scheduledTaskFragment
      task {
        ...taskFragment
      }
    }
    info {
      prev
      next
    }
  }
}
    ${ScheduledTaskFragmentFragmentDoc}
${TaskFragmentFragmentDoc}`;

/**
 * __useCalendarQuery__
 *
 * To run a query within a React component, call `useCalendarQuery` and pass it any options that fit your needs.
 * When your component renders, `useCalendarQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCalendarQuery({
 *   variables: {
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useCalendarQuery(baseOptions?: Apollo.QueryHookOptions<CalendarQuery, CalendarQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CalendarQuery, CalendarQueryVariables>(CalendarDocument, options);
      }
export function useCalendarLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CalendarQuery, CalendarQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CalendarQuery, CalendarQueryVariables>(CalendarDocument, options);
        }
export type CalendarQueryHookResult = ReturnType<typeof useCalendarQuery>;
export type CalendarLazyQueryHookResult = ReturnType<typeof useCalendarLazyQuery>;
export type CalendarQueryResult = Apollo.QueryResult<CalendarQuery, CalendarQueryVariables>;
export const UsersDocument = gql`
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
    ${UserFragmentFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      page: // value for 'page'
 *   },
 * });
 */
export function useUsersQuery(baseOptions: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
export const UserDocument = gql`
    query User($id: ID!) {
  user(id: $id) {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const LoginAsSocialDocument = gql`
    mutation LoginAsSocial($input: LoginAsGoogleInput!) {
  loginAsSocial(input: $input) {
    ...userFragment
  }
}
    ${UserFragmentFragmentDoc}`;
export type LoginAsSocialMutationFn = Apollo.MutationFunction<LoginAsSocialMutation, LoginAsSocialMutationVariables>;

/**
 * __useLoginAsSocialMutation__
 *
 * To run a mutation, you first call `useLoginAsSocialMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginAsSocialMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginAsSocialMutation, { data, loading, error }] = useLoginAsSocialMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginAsSocialMutation(baseOptions?: Apollo.MutationHookOptions<LoginAsSocialMutation, LoginAsSocialMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginAsSocialMutation, LoginAsSocialMutationVariables>(LoginAsSocialDocument, options);
      }
export type LoginAsSocialMutationHookResult = ReturnType<typeof useLoginAsSocialMutation>;
export type LoginAsSocialMutationResult = Apollo.MutationResult<LoginAsSocialMutation>;
export type LoginAsSocialMutationOptions = Apollo.BaseMutationOptions<LoginAsSocialMutation, LoginAsSocialMutationVariables>;