import { initTRPC,TRPCError } from '@trpc/server'
import type { Context } from 'src/server/context'

const t = initTRPC.context<Context>().create()

const admin = t.middleware( async ({ ctx,next }) => {
  if (!ctx.session?.user?.name) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: ctx.session
    }
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(admin)
