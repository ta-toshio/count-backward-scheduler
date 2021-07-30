import React from 'react'
import type { NextPage } from 'next'
import classNames from 'classnames'

import useLogin from '../containers/Login'
import Layout from '../../../components/Layout'
import ScreenSpinner from '../../../components/spinner/Spinner'

const Login: NextPage = () => {
  const {
    ready,
    loginLoading,
    loginError,
    register,
    handleSubmit,
    formErrors,
    submit,
    loginAsGoogle,
    loginErrorAsSocial,
  } = useLogin()

  if (!ready) return <ScreenSpinner />

  return (
    <Layout>
      <section className="hero is-fullheight">
        <div className="hero-body">
          <div className="login-container container has-text-centered">
            <div className="column is-4 is-offset-4">
              <h3 className="title has-text-black">Login</h3>
              <hr className="login-hr" />
              {loginError && <p>{loginError}</p>}
              <div className="box">
                <form onSubmit={handleSubmit(submit)}>
                  <div className="field">
                    <div className="control">
                      <input
                        {...register('email')}
                        type="text"
                        className="input"
                        placeholder="Your email address..."
                        autoFocus
                      />
                      <p>{formErrors && formErrors.email?.message}</p>
                    </div>
                  </div>

                  <div className="field">
                    <div className="control">
                      <input
                        {...register('password')}
                        type="password"
                        className="input"
                        placeholder="Your password..."
                      />
                      <p>{formErrors && formErrors.password?.message}</p>
                    </div>
                  </div>
                  <div className="field">
                    <label className="checkbox">
                      <input {...register('remember')} type="checkbox" />{' '}
                      Remember me
                    </label>
                  </div>
                  <button
                    className={classNames(
                      {
                        'is-loading': loginLoading,
                      },
                      'button is-block is-info is-large is-fullwidth'
                    )}
                  >
                    Login
                    <i className="fa fa-sign-in" />
                  </button>
                </form>
              </div>
              <div>
                {loginErrorAsSocial && <p>{loginErrorAsSocial}</p>}
                <button
                  onClick={loginAsGoogle}
                  className={classNames(
                    'button is-block is-info is-large is-fullwidth'
                  )}
                >
                  Login as Google
                  <i className="fa fa-sign-in" />
                </button>
              </div>
              <p className="has-text-grey">
                <a href="../">Sign Up</a> &nbsp;·&nbsp;
                <a href="../">Forgot Password</a> &nbsp;·&nbsp;
                <a href="../">Need Help?</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

export default Login
