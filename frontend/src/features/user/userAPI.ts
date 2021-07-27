import httpClient from '../../app/httpClient'
import { postLoginActionInput } from './userSlice'

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
