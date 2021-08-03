import React, { ReactNode, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import httpClient from '../app/httpClient'
import firebase from '../services/firebase'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logoutAction, selectRootUser } from '../features/user/userSlice'
import { toast } from 'react-toastify'
import { CircleLoadingIcon } from './icon/SvgIcon'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector(selectRootUser)
  const [isLogout, setIsLogout] = useState<boolean>(false)

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="container">
          <div className="navbar-brand">
            <Link href="/">
              <a className="navbar-item">Count Backward Schedule</a>
            </Link>
          </div>

          <div className="navbar-menu">
            <div className="navbar-end">
              {!isAuthenticated && (
                <Link href="/login">
                  <a className="navbar-item">Login</a>
                </Link>
              )}
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">Sample</a>
                <div className="navbar-dropdown">
                  <Link href="/sample/logged-in">
                    <a className="navbar-item">Logged In</a>
                  </Link>
                  <Link href="/register">
                    <a className="navbar-item">Register</a>
                  </Link>
                  <Link href="/sample/count">
                    <a className="navbar-item">Count</a>
                  </Link>
                  <Link href="/sample/use-apollo-client-1">
                    <a className="navbar-item">Apollo client 1</a>
                  </Link>
                  <Link href="/sample/use-apollo-client-2">
                    <a className="navbar-item">Apollo client 2</a>
                  </Link>
                  <Link href="/sample/use-apollo-ssg">
                    <a className="navbar-item">Apollo SSG</a>
                  </Link>
                  <Link href="/sample/use-apollo-ssr">
                    <a className="navbar-item">Apollo U SSR</a>
                  </Link>
                  <Link href="/sample/use-apollo-auth-ssr">
                    <a className="navbar-item">Apollo A U SSR</a>
                  </Link>
                  <Link href="/sample/use-redux">
                    <a className="navbar-item">Redux</a>
                  </Link>
                  <Link href="/sample/user">
                    <a className="navbar-item">User</a>
                  </Link>
                  <Link href="/sample/users">
                    <a className="navbar-item">Users</a>
                  </Link>
                </div>
              </div>
              {isAuthenticated && (
                <div className="navbar-item has-dropdown is-hoverable">
                  <a className="navbar-link">Account</a>
                  <div className="navbar-dropdown">
                    {!isLogout && (
                      <a
                        className="navbar-item"
                        onClick={async (e) => {
                          e.preventDefault()
                          if (isLogout) {
                            return
                          }
                          setIsLogout(true)
                          try {
                            await httpClient.post('/logout')
                            dispatch(logoutAction())
                            toast('ログアウトしました')
                            await firebase.auth().signOut()
                          } catch (e) {
                            console.error(e)
                          }
                          setIsLogout(false)
                        }}
                      >
                        ログアウト
                      </a>
                    )}
                    {isLogout && (
                      <a
                        className="navbar-item dropdown-item-center"
                        onClick={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <CircleLoadingIcon />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  )
}

export default Layout
