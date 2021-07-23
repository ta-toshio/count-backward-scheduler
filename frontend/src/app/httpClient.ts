import axios from 'axios'

const httpClient = axios.create({
  baseURL: 'http://api.scheduler.me:8140/',
  // baseURL:
  //   typeof window === 'undefined'
  //     ? 'http://api-server:8080/graphql'
  //     : 'http://api.scheduler.me:8140/graphql', // Server URL (must be absolute)
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export default httpClient
