import NextAuth from "next-auth"
import NeonAdapter from "@auth/neon-adapter"
import { Pool } from "@neondatabase/serverless"
import Google from "next-auth/providers/google"

// *DO NOT* create a `Pool` here, outside the request handler.
 
export const { handlers, auth, signIn, signOut } = NextAuth(() => {
  // Create a `Pool` inside the request handler.
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  return {
    callbacks: {
        authorized: async ({ auth, request: { nextUrl } }) => {
          // Logged in users are authenticated, otherwise redirect to login page
          if (nextUrl.pathname === "/") {
            return true
          }
          return !!auth
        },
      },
    adapter: NeonAdapter(pool),
    providers: [Google],
  }
})
