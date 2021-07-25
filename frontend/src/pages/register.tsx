import { useRouter } from 'next/router'
import React, { useState } from 'react'
import httpClient from '../app/httpClient'
import Layout from '../components/Layout'

const Register = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<{
    name: string
    email: string
    password: string
    password_confirmation: string
    emailError: string
    passwordError: string
  }>({
    name: 'test2',
    email: 'test2@test.com',
    password: 'password',
    password_confirmation: 'password',
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

  const requestRegister = (): Promise<void> => {
    const { name, email, password, password_confirmation } = formData

    return httpClient.get('/sanctum/csrf-cookie').then((_) => {
      // Login...
      httpClient
        .post('/register', {
          name,
          email,
          password,
          password_confirmation,
        })
        .then((_) => {
          router.push('/')
        })
        .catch((e) => {
          console.error(e)
        })
    })
  }

  const requestResendEmailVerification = (): Promise<void> => {
    return httpClient
      .post('/email/verification-notification')
      .then((_) => {
        router.push('/')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  return (
    <Layout>
      <div>
        <input
          type="text"
          value={formData.name}
          placeholder="Your name..."
          onChange={(e) => {
            handleInputChange(e)
          }}
          name="name"
        />
      </div>
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
        <input
          type="text"
          value={formData.password_confirmation}
          placeholder="Your password..."
          onChange={(e) => {
            handleInputChange(e)
          }}
          name="password_confirmation"
        />
      </div>

      <div>
        <button
          onClick={() => {
            requestRegister()
          }}
        >
          Register
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            requestResendEmailVerification()
          }}
        >
          Resend email verification
        </button>
      </div>
    </Layout>
  )
}

export default Register
