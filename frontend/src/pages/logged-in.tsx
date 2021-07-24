import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import httpClient from '../app/httpClient'

const LoggedInPage: NextPage = () => {
  const router = useRouter()
  const [user, setUser] = useState(null)
  useEffect(() => {
    // httpClient
    //   .get('/api/user')
    //   .then((res) => {
    //     console.log(res)
    //   })
    //   .catch((e) => {
    //     console.log(e)
    //     router.replace('/')
    //   })
  }, [])
  return (
    <Layout>
      <div>{(user && user.email) || ''}</div>
      <div>
        <button
          onClick={() => {
            httpClient
              .get('/api/user')
              .then((res) => {
                setUser(res.data)
              })
              .catch((e) => {
                console.error(e)
              })
          }}
        >
          Fetcu User
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            httpClient
              .post('/logout')
              .then((_) => {
                router.push('/')
              })
              .catch((e) => {
                console.error(e)
              })
          }}
        >
          Logout
        </button>
      </div>
    </Layout>
  )
}

export default LoggedInPage
