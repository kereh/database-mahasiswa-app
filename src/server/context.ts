import { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { inferAsyncReturnType } from '@trpc/server'
import { getSession } from 'next-auth/react'
import { prisma } from 'src/server/helper/prisma'

export const appContext = async (opts?: CreateNextContextOptions) => {
  const session = await getSession({ req: opts?.req })
  return {
    session,
    prisma
  }
}

export type Context = inferAsyncReturnType<typeof appContext>