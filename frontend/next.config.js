const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

module.exports = (phase) => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

  return {
    env: {
      appHost: process.env.APP_HOST,
      API_SERVER_URI_FROM_BROWSER: (() => {
        if (process.env.APP_HOST === 'localhost') return 'http://localhost:8142'
        if (process.env.APP_HOST.includes('schedule')) {
          if (isDev) return 'http://api.scheduler.me:8140'
          if (isDev) return 'http://api.scheduler.com:8140'
          if (isDev) return 'http://api.scheduler-stg.com:8140'
        }
        return 'API_SERVER_FROM_BROWSER:not (isDev,isProd && !isStaging,isProd && isStaging)'
      })(),
      API_SERVER_URI_FROM_SERVER: (() => {
        if (process.env.APP_HOST === 'localhost') return 'http://localhost:8142'
        if (process.env.APP_HOST.includes('schedule')) {
          if (isDev) return 'http://api-server:8080'
          if (isProd) return 'http://api-server:8080'
          if (isStaging) return 'http://api-server:8080'
        }
        return 'API_SERVER_FROM_SERVER:not (isDev,isProd && !isStaging,isProd && isStaging)'
      })(),
    },
  }
}
