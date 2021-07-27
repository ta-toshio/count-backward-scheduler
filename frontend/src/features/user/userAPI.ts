import httpClient from '../../app/httpClient'
import { postLoginActionInput } from './userSlice'

export async function postLogin(credential: postLoginActionInput) {
  await httpClient.get('/sanctum/csrf-cookie')
  await httpClient.post('/login', credential)
  const response = await httpClient.get('/api/user')
  return response.data
}
