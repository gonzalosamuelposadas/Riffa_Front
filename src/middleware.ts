import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // JWT tokens are stored in localStorage (client-side)
  // Auth protection is handled client-side in the layout components
  // and server-side by the NestJS API

  // The actual role-based protection happens in:
  // - /admin/layout.tsx (requires ADMIN or SUPER_ADMIN)
  // - /super-admin/layout.tsx (requires SUPER_ADMIN)
  // - /mi-cuenta/layout.tsx (requires authenticated user)

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/super-admin/:path*', '/mi-cuenta/:path*']
}
