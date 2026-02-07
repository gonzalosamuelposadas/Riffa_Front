import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

// Build providers array conditionally
const providers: NextAuthOptions['providers'] = [
  // Credentials Provider (email/password)
  CredentialsProvider({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Credenciales requeridas')
      }

      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        })

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.message || 'Credenciales invalidas')
        }

        const data = await res.json()

        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role,
          phone: data.user.phone,
          balance: data.user.balance,
          storeId: data.user.storeId,
          storeName: data.user.storeName,
          storeSlug: data.user.storeSlug,
          accessToken: data.access_token,
        }
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message)
        }
        throw new Error('Error al iniciar sesion')
      }
    },
  }),
]

// Only add Google provider if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.unshift(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  )
}

export const authOptions: NextAuthOptions = {
  providers,

  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, sync user with backend
      if (account?.provider === 'google') {
        try {
          const res = await fetch(`${API_URL}/user-auth/oauth`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              email: user.email,
              name: user.name,
              image: user.image,
            }),
          })

          if (!res.ok) {
            console.error('Failed to sync OAuth user with backend')
            return false
          }

          const data = await res.json()
          // Attach backend data to user object
          user.id = data.user.id
          user.role = data.user.role
          user.phone = data.user.phone
          user.balance = data.user.balance
          user.storeId = data.user.storeId
          user.storeName = data.user.storeName
          user.storeSlug = data.user.storeSlug
          user.accessToken = data.access_token
        } catch (error) {
          console.error('OAuth sync error:', error)
          return false
        }
      }
      return true
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role
        token.phone = user.phone
        token.balance = user.balance
        token.storeId = user.storeId
        token.storeName = user.storeName
        token.storeSlug = user.storeSlug
        token.accessToken = user.accessToken
      }

      // Session update
      if (trigger === 'update' && session) {
        token = { ...token, ...session }
      }

      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.phone = token.phone as string | undefined
        session.user.balance = token.balance as number
        session.user.storeId = token.storeId as string | undefined
        session.user.storeName = token.storeName as string | undefined
        session.user.storeSlug = token.storeSlug as string | undefined
        session.accessToken = token.accessToken as string
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
}

// Export helper to check if Google is configured
export const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
