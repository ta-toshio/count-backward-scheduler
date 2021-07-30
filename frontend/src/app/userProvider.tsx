import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from './hooks'
import { getUserAction, selectRootUser } from '../features/user/userSlice'
import { GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { wrapper } from './store'
import { useRouter } from 'next/router'
import ScreenSpinner from '../components/spinner/Spinner'

interface AuthRedirect {
  require: boolean
  redirect?: string
  redirectIfLoggedIn?: string
}

const UserProvider: React.FC = ({ children }) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(getUserAction())
  }, [])

  return <>{children}</>
}

const useRedirectOnAuthentication = (auth: AuthRedirect) => {
  const router = useRouter()
  const { isAuthenticated, getUserLoaded } = useAppSelector(selectRootUser)

  useEffect(() => {
    if (!auth) {
      return
    }

    if (getUserLoaded) {
      if (auth.require && auth.redirect && !isAuthenticated) {
        router.push(auth.redirect)
      }

      if (auth.redirectIfLoggedIn && isAuthenticated) {
        router.replace(auth.redirectIfLoggedIn)
      }
    }
  }, [getUserLoaded])
}

export const redirectHoc =
  (auth: AuthRedirect) => (WrappedComponent) => (props) => {
    const { getUserLoaded } = useAppSelector(selectRootUser)
    useRedirectOnAuthentication(auth)
    if (!getUserLoaded) return <ScreenSpinner />
    return <WrappedComponent {...props} />
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

export const withStateUserServerSideProps = (
  callback = () => ({ props: {} }),
  options = {}
) =>
  wrapper.getServerSideProps((store) =>
    withUserServerSideProps(callback, { store, ...options })
  )

export default UserProvider
