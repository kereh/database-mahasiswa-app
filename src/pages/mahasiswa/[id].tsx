import type { GetServerSidePropsContext } from "next"
import { getServerSession } from "src/server/helper/get-session"
import { useRouter } from "next/router"
import { trpc } from "src/utils/trpc"
import NextHead from "next/head"

export async function getServerSideProps (ctx: GetServerSidePropsContext) {
  const session = await getServerSession(ctx)
  if (!session) return {
    redirect: {
      destination: '/signin',
      permanent: false
    }
  }
  return {
    props: {}
  }
}

export default function detail() {

  const router = useRouter()
  const { id } = router.query 

  const mhsQuery = trpc.mahasiswa.mahasiswaById.useQuery({ id })

  if (mhsQuery.status !== 'success') return (
    <div className='flex flex-column justify-center items-center min-h-screen'>
      <h1 className='text-2xl'>Memuat data...</h1>
    </div>
  )

  const { data } = mhsQuery
  const now = new Date().getFullYear()

  return (
    <div className="container p-4 mx-auto w-full md:w-1/2">
      <NextHead>
        <title>{data.byid?.nama}</title>
      </NextHead>
      <div className="pt-40 flex flex-col">
        <h1 className="text-2xl text-slate-900 font-normal mb-5">Informasi tentang <span className="block font-bold">{data.byid?.nama}</span></h1>
        <p className="text-slate-800">Dengan NIM <span className="font-bold">{data.byid?.nim}</span></p>
        <p className="leading-relaxed text-base text-slate-800 mt-5">
          {data.byid?.nama} merupakan mahasiswa dari Universitas Sariputra Indonesia Tomohon, {data.byid?.nama} mengambil jurusan {data.byid?.jurusan.nama}.
        </p>
        <div className="mt-7">
          <button className="px-4 py-2 bg-red-500 rounded-lg text-white w-1/3 md:w-1/4 mx-auto hover:bg-gray-100 hover:text-red-500 transition duration-500" onClick={() => router.push('/')}>Kembali</button>
        </div>
      </div>
      <footer className='pt-60 flex flex-row justify-center md:mb-3 md:pt-52'>
        <h1>RKereh @ {now} | <a href="https://github.com/kereh" target='_blank' className='text-blue-700 outline-1'>Download Source Code</a></h1>
      </footer>
    </div>
  )
}