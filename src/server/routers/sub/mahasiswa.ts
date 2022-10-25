import { router,publicProcedure,protectedProcedure } from 'src/server/trpc'
import { z } from 'zod'

export const routerMahasiswa = router({
  hitungData: publicProcedure
    .query( async ({ ctx }) => {
      const jumlah = await ctx.prisma.user.count()
      return { 
        jumlah 
      }
    }),
  semuaDataMahasiswa: protectedProcedure
    .query( async ({ ctx }) => {
      const mahasiswa = await ctx.prisma.mahasiswa.findMany({
        include: { 
          jurusan: true 
        } 
      })
      return { 
        mahasiswa 
      }
    }),
  mahasiswaById: protectedProcedure
    .input(
      z.object({
        id: z.any()
      })
    )
    .query( async ({ input,ctx }) => {
      const byid = await ctx.prisma.mahasiswa.findFirst({
        where: {
          id: input.id
        },
        include: {
          jurusan: true
        }
      })
      return { byid }
    }),
  semuaJurusan: publicProcedure
    .query( async ({ ctx }) => {
      const jurusan = await ctx.prisma.jurusan.findMany()
      return {
        jurusan
      }
    }),
  tambahDataMahasiswa: protectedProcedure
    .input(
      z.object({
        nama: z.string().max(25),
        nim: z.string().min(8).max(8),
        jurusanId: z.string().max(25)
      })
    )
    .mutation( async ({ input,ctx }) => {
      const tambah = await ctx.prisma.mahasiswa.create({
        data: {
          nama: input.nama,
          nim: input.nim,
          jurusanId: input.jurusanId
        }
      })
      return { tambah }
    }),
  hapusDataMahasiswa: protectedProcedure
    .input(
      z.object({
        id: z.string().max(25)
      })
    )
    .mutation( async ({ input,ctx }) => {
      const hapus = await ctx.prisma.mahasiswa.delete({
        where: {
          id: input.id
        }
      })
      return { hapus }
    }),
  ubahDataMahasiswa: protectedProcedure
    .input(
      z.object({
        id: z.any(),
        nama: z.string().max(25),
        nim: z.string().min(8).optional(),
        jurusanId: z.string().max(25)
      })
    )
    .mutation( async ({ input,ctx }) => {
      const ubah = await ctx.prisma.mahasiswa.update({
        where: {
          id: input.id
        },
        data: {
          nama: input.nama,
          nim: input.nim,
          jurusanId: input.jurusanId
        }
      })
      return { ubah }
    })
})