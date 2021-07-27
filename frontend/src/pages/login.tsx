import React from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import Layout from '../components/Layout'
import Yup from '../app/yup'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { postLoginAction } from '../features/user/userSlice'
import { AppState } from '../app/store'
import classNames from 'classnames'

const schema = Yup.object().shape({
  email: Yup.string().required().email(),
  password: Yup.string().required().min(6),
})

const Login: NextPage = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { loginLoading, loginError } = useAppSelector(
    (state: AppState) => state.user
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  /**
   * Submit the form.
   */
  const submit = (data) => {
    const postData = {
      email: data.email,
      password: data.password,
    }
    dispatch(postLoginAction(postData)).then((data) => {
      if (data.payload && data.payload.id) {
        router.push('/')
      }
    })
  }

  return (
    <Layout>
      <section className="hero is-success is-fullheight">
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
                      <p>{errors && errors.email?.message}</p>
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
                      <p>{errors && errors.password?.message}</p>
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
