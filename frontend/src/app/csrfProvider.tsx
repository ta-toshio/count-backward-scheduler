import react, { useEffect, useState } from 'react'
import { getCsrfCookie } from '../features/user/userAPI'

const CsrfProvider: React.FC = ({ children }) => {
  const [loaded, setLoaded] = useState<boolean>(false)

  const staticValue = 1
  useEffect(() => {
    getCsrfCookie().finally(() => {
      setLoaded(true)
    })
  }, [staticValue])

  if (!loaded) return <></>
  return <>{children}</>
}

export default CsrfProvider
