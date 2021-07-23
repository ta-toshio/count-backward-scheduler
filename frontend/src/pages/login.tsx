import React, { useState } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import Layout from '../components/Layout'
import httpClient from '../app/httpClient'

const Login: NextPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<{
    email: string
    password: string
    emailError: string
    passwordError: string
  }>({
    email: 'test@test.com',
    password: 'password',
    emailError: '',
    passwordError: '',
  })

  /**
   * Handle input change.
   *
   * @param {object} e
   *   The event object.
   */
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.currentTarget.name]: e.currentTarget.value,
      emailError: '',
      passwordError: '',
    })
  }

  /**
   * Submit the form.
   */
  const submit = (): Promise<void> => {
    const { email, password } = formData

    // Check for valid email address.
    if (!email) {
      setFormData({
        ...formData,
        emailError: 'Please provide a valid email address',
      })
      return
    }

    // Check for valid password.
    if (!password) {
      setFormData({
        ...formData,
        passwordError: 'Please provide a valid password',
      })
      return
    }

    // Make API call if everything is fine.
    // props.login(email, password);
    httpClient.get('/sanctum/csrf-cookie').then((_) => {
      // Login...
      httpClient
        .post('/login', {
          email: email,
          password: password,
        })
        .then((_) => {
          router.push('/')
        })
        .catch((e) => {
          console.error(e)
        })
    })
  }

  return (
    <Layout>
      <div>
        <input
          type="text"
          value={formData.email}
          placeholder="Your email address..."
          onChange={(e) => {
            handleInputChange(e)
          }}
          name="email"
        />
        {formData.emailError && <div>{formData.emailError}</div>}
      </div>
      <div>
        <input
          type="password"
          value={formData.password}
          placeholder="Your password..."
          onChange={(e) => {
            handleInputChange(e)
          }}
          name="password"
        />
        {formData.passwordError && <div>{formData.passwordError}</div>}
      </div>

      <div>
        <button
          onClick={() => {
            submit()
          }}
        >
          Login
        </button>
      </div>
    </Layout>
  )
}

export default Login
