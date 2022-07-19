import 'dotenv/config'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { trpc } from '@/utils/trpc'

const secrets = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
}

export default NextAuth({
  providers: [GoogleProvider(secrets.google)],
  callbacks: {
    async signIn({ user, account, profile }) {
      const provider = account.provider
      const providerId = user.id
      const packet = { [provider]: providerId }
      const databaseUser = await trpc.mutation('user/login', {
        authZeroId: 'auth0|123456789012345678901234',
        email: user.email || profile.email || '',
      })
      console.log(packet, databaseUser)
      return true
    },
    async session({ session, user, token }) {
      const email = session.user?.email || user.email || token.email || ''
      if (!email) return session
      const databaseUser = await trpc.mutation('user/login', {
        authZeroId: 'auth0|123456789012345678901234',
        email,
      })
      session.user.modtreeId = databaseUser.id
      return session
    },
  },
})
