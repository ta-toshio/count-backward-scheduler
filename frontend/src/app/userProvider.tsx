import React, { useEffect } from 'react'
import { useAppDispatch } from './hooks'
import { getUserAction } from '../features/user/userSlice'
import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

const UserProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getUserAction())
  }, [])

  return <>{children}</>
}

type withAuthServerSidePropsOptions = {
  redirect?: string
  store: any
}

export function withUserServerSideProps(
  callback,
  options: withAuthServerSidePropsOptions
) {
  if (!options.redirect) {
    options.redirect = '/login'
  }
  return async (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {
    if (!ctx.req.headers.cookie) {
      return {
        redirect: {
          destination: options.redirect,
          permanent: false,
        },
      }
    }

    const getParam = {
      headers: {
        Cookie: ctx.req.headers.cookie,
      },
    }

    const user = await options.store.dispatch(getUserAction({ getParam }))

    return callback ? await callback(ctx, user) : { props: { user } }
  }
}

export default UserProvider
