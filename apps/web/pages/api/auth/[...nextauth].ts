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
    async signIn({ user, account, profile }): Promise<boolean> {
      return trpc
        .mutation('user/login2', {
          provider: account.provider,
          providerId: user.id,
          email: user.email || profile.email || '',
        })
        .then(() => true)
        .catch(() => {
          console.error('/api/auth/signIn: Failed to create user')
          return false
        })
    },
    async session({ session, user, token }) {
      const email = session.user?.email || user.email || token.email || ''
      if (!email) return session
      const databaseUser = await trpc.query('user/get-by-email', email)
      session.user.modtreeId = databaseUser.id
      return session
    },
  },
})
