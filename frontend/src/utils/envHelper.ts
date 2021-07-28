export const isServer = () => {
  return typeof window === 'undefined'
}

export const getCsrfToken = (cookie) => {
  if (!cookie) return ''
  const r = RegExp('XSRF-TOKEN[^;]+').exec(cookie)
  return decodeURIComponent(r ? r.toString().replace(/^[^=]+./, '') : '')
}
