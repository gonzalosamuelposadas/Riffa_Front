import 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    email: string
    name: string
    role: string
    phone?: string
    balance?: number
    storeId?: string
    storeName?: string
    storeSlug?: string
    accessToken?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: string
      phone?: string
      balance?: number
      storeId?: string
      storeName?: string
      storeSlug?: string
    }
    accessToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name: string
    role: string
    phone?: string
    balance?: number
    storeId?: string
    storeName?: string
    storeSlug?: string
    accessToken?: string
  }
}
