import type { NextAuthOptions, Session } from 'next-auth'
import NextAuth from 'next-auth/next'
import Credential from 'next-auth/providers/credentials'
import { prisma } from 'src/server/helper/prisma'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credential({
      id: 'credential-login',
      credentials: {
        username: { type: 'text' },
        password: { type: 'password' }
      },
      async authorize(credentials, req) {
        const checkUser = await prisma.user.findFirst({ where: { username: req.body?.username } })
        if (checkUser) {
          const checkPass = checkUser.password == req.body?.password
          if (checkPass) {
            return checkUser
          }
          return null
        }
        return null
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session,token,user }) {
      const sess: Session = {
        ...session,
        user: {
          ...session.user,
          role: token.role as string
        }
      }
      return sess
    }
  },
  pages: {
    signIn: '/signin'
  }
}

export default NextAuth(authOptions)