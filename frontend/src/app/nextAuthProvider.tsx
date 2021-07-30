import React, { useEffect } from 'react'
import { Provider, useSession } from 'next-auth/client'

type nextAuthProviderProps = {
  propsSession: any
}

const NextAuthProvider: React.FC<nextAuthProviderProps> = ({
  propsSession,
  children,
}) => {
  return (
    <Provider session={propsSession}>
      <NextAuthConsume>{children}</NextAuthConsume>
    </Provider>
  )
}

const NextAuthConsume: React.FC = ({ children }) => {
  const [session] = useSession()
  useEffect(() => {
    if (session) {
      console.warn(session)
    }
  }, [session])
  return <>{children}</>
}

export default NextAuthProvider
