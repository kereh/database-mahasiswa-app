import type { GetServerSidePropsContext } from 'next'
import { unstable_getServerSession as serverSession } from 'next-auth/next'
import { authOptions } from 'src/pages/api/auth/[...nextauth]'

export const getServerSession = async (ctx: {
  req: GetServerSidePropsContext['req'],
  res: GetServerSidePropsContext['res']
}) => {
  return await serverSession(ctx.req, ctx.res, authOptions)
}