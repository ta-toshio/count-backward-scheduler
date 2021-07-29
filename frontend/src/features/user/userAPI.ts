import httpClient from '../../app/httpClient'
import { postLoginActionInput } from './userSlice'
import { parseCookies } from 'nookies'

export const postLogin = async (credential: postLoginActionInput) => {
  await httpClient.get('/sanctum/csrf-cookie')
  await httpClient.post('/login', credential)
  const response = await httpClient.get('/api/user')
  return response.data
}

export const getUser = async (params) => {
  const response = await httpClient.get('/api/user', {
    headers: params?.headers ? params.headers : {},
  })
  return response.data
}

export const updateCsrfCookie = async () => {
  await httpClient.get('/sanctum/csrf-cookie')
}

export const getCsrfCookie = async () => {
  const cookies = parseCookies()
  let token = cookies['XSRF-TOKEN'] ?? ''
  if (!token) {
    await updateCsrfCookie()
    const cookies = parseCookies()
    token = cookies['XSRF-TOKEN'] ?? ''
  }
  return token
}
