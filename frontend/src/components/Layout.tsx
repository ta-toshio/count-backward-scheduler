import React, { ReactNode } from 'react'
import Link from 'next/link'
import Head from 'next/head'

type Props = {
  children?: ReactNode
  title?: string
}

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item">
            <img
              src="https://bulma.io/images/bulma-logo.png"
              width="112"
              height="28"
            />
          </a>
        </Link>
      </div>

      <div className="navbar-menu">
        <div className="navbar-end">
          <Link href="/login">
            <a className="navbar-item">Login</a>
          </Link>
          <Link href="/logged-in">
            <a className="navbar-item">Logged In</a>
          </Link>
          <Link href="/register">
            <a className="navbar-item">Register</a>
          </Link>
          <Link href="/count">
            <a className="navbar-item">Count</a>
          </Link>
          <Link href="/use-apollo-client-1">
            <a className="navbar-item">Apollo client 1</a>
          </Link>
          <Link href="/use-apollo-client-2">
            <a className="navbar-item">Apollo client 2</a>
          </Link>
          <Link href="/use-apollo-ssg">
            <a className="navbar-item">Apollo SSG</a>
          </Link>
          <Link href="/use-apollo-auth-ssr">
            <a className="navbar-item">Apollo Auth User SSR</a>
          </Link>
          <Link href="/use-redux">
            <a className="navbar-item">Redux</a>
          </Link>
          <Link href="/user">
            <a className="navbar-item">User</a>
          </Link>
          <Link href="/users">
            <a className="navbar-item">Users</a>
          </Link>
        </div>
      </div>
    </nav>
    {children}
    <footer>
      <section className="hero is-medium has-text-centered">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div data-aos="zoom-in-up" className="column is-8">
                <h1 className="title titled is-1 mb-6">
                  Primary bold title <span id="typewriter"></span>
                </h1>
                <h2 className="subtitle subtitled">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Laborum cupiditate dolorum vitae dolores nesciunt totam magni
                  quas. Lorem ipsum, dolor sit amet consectetur adipisicing
                  elit.
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  </>
)

export default Layout
