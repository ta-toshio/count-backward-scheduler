import axios from 'axios'

const httpClient = axios.create({
  baseURL:
    typeof window === 'undefined'
      ? process.env.API_SERVER_URI_FROM_SERVER
      : process.env.API_SERVER_URI_FROM_BROWSER,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export default httpClient
