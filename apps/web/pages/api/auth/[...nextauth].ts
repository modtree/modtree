import 'dotenv/config'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { trpc } from '@/utils/trpc'
import { log } from '@/utils/env'
import { devEnv } from '@/utils/env'

const secrets = {
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  facebook: {
    clientId: process.env.FACEBOOK_CLIENT_ID || '',
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET || '',
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  },
}

export default NextAuth({
  providers: [
    GoogleProvider(secrets.google),
    FacebookProvider(secrets.facebook),
    GithubProvider(secrets.github),
    CredentialsProvider({
      credentials: {},
      authorize: async () => ({
        email: 'default@test.com',
        id: 'test-provider-id',
      }),
    }),
  ].filter((p) => devEnv || p.type !== 'credentials'),
  callbacks: {
    /**
     * on user sign in
     */
    async signIn({ user, account, profile }): Promise<boolean> {
      return trpc
        .mutation('user/login', {
          provider: account.provider,
          providerId: user.id,
          email: user.email || profile.email || '',
        })
        .then((user) => {
          log.ok('/api/auth: Successfully created new user', user)
          return true
        })
        .catch(() => {
          log.err('/api/auth: Failed to create user')
          return false
        })
    },

    /**
     * on page load
     */
    async session({ session, user, token }) {
      /**
       * Currently, it seems that the only persisting id is the user's email.
       */
      const email = session.user.email || user.email || token.email || ''
      if (!email) {
        log.warn('/api/auth: No session found to refresh')
        return session
      }
      return trpc
        .query('user/get-by-email', { email })
        .then((user) => {
          /** reload the user's id here */
          session.user.modtreeId = user.id
          log.ok('/api/auth: Successfully refreshed session')
          return session
        })
        .catch(() => {
          log.err('/api/auth: Failed to refresh session')
          return session
        })
    },
  },
})
