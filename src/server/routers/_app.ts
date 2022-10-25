import { router } from 'src/server/trpc'
import { routerMahasiswa } from 'src/server/routers/sub/mahasiswa'

export const appRouter = router({
  mahasiswa: routerMahasiswa
})

export type AppRouter = typeof appRouter