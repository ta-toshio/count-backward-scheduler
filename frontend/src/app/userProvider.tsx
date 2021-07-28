import React, { useEffect } from 'react'
import { useAppDispatch } from './hooks'
import { getUserAction } from '../features/user/userSlice'
import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { wrapper } from './store'

const UserProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(getUserAction())
  }, [])

  return <>{children}</>
}

type withAuthServerSidePropsOptions = {
  redirect?: string
  secret?: boolean
  store?: any
}

export const withUserServerSideProps = (
  callback,
  options: withAuthServerSidePropsOptions
) => {
  options.redirect = options.redirect ?? '/login'
  const returnRedirect = {
    redirect: {
      destination: options.redirect,
      permanent: false,
    },
  }
  return async (ctx: GetServerSidePropsContext<ParsedUrlQuery>) => {
    if (!ctx.req.headers.cookie) {
      return returnRedirect
    }

    const getParam = {
      headers: {
        Cookie: ctx.req.headers.cookie,
      },
    }

    const user = options.store
      ? await options.store.dispatch(getUserAction({ getParam }))
      : getUserAction({ getParam })

    if (user.error && options.secret) {
      return returnRedirect
    }

    return callback ? await callback(ctx, user) : { props: { user } }
  }
}

export const withUserAndReduxServerSideProps = (
  callback = () => ({ props: {} }),
  options = {}
) =>
  wrapper.getServerSideProps((store) =>
    withUserServerSideProps(callback, { store, ...options })
  )

export default UserProvider
