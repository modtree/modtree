import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      modtreeId: string
    } & DefaultSession['user']
  }
}
