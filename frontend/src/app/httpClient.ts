import axios from 'axios'
import { isServer } from '../utils/envHelper'

const option = {
  baseURL: isServer()
    ? process.env.API_SERVER_URI_FROM_SERVER
    : process.env.API_SERVER_URI_FROM_BROWSER,
  withCredentials: true,
  headers: {
    // 'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
}

if (isServer()) {
  option.headers['Referer'] = process.env.APP_URL
}

const httpClient = axios.create(option)

export default httpClient
