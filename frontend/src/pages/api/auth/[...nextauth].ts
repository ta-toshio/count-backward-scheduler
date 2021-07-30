import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    // OAuth authentication providers...
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  // Optional SQL or MongoDB database to persist users
  database: process.env.DATABASE_URL,
  callbacks: {
    async signIn(user, account) {
      user.accessToken = account.accessToken
      user.provider = account.provider
      return Promise.resolve(true)
    },
  },
})
