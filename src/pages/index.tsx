import type { GetServerSideProps,GetServerSidePropsContext } from 'next'
import { signOut,useSession } from 'next-auth/react'
import { getServerSession } from 'src/server/helper/get-session'
import { trpc } from 'src/utils/trpc'
import NextHead from 'next/head'
import Router from 'next/router'
import Swal from 'sweetalert2'

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
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

export default function index() {

  const client = trpc.useContext()
  const mahasiswa = trpc.mahasiswa.semuaDataMahasiswa.useQuery()
  const hapus = trpc.mahasiswa.hapusDataMahasiswa.useMutation({
    onSuccess: (data) => {
      Swal.fire({
        title: 'Berhasil',
        text: `Mahasiswa dengan nama ${data.hapus.nama} berhasil di hapus`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
      client.mahasiswa.invalidate()
    }
  })

  const {data} = useSession()
  const now = new Date().getFullYear()

  const hapusMahasiswa = (id: string) => {
    hapus.mutate({ id })
  }

  if (!mahasiswa.data) return (
    <div className='flex flex-column justify-center items-center min-h-screen'>
      <h1 className='text-2xl'>Memuat data...</h1>
    </div>
  )

  return (
    <div className='container p-4 mx-auto w-full'>
      <NextHead>
        <title>Dashboard Admin</title>
      </NextHead>
      <div className="pt-20 md:flex md:w-2/3 md:mx-auto justify-center">
        <div className='md:text-center'>
          <h1 className='text-2xl'>Hi ✋ <span className='font-bold'>{data?.user.name}</span></h1>
          <p className='text-base mt-2'>Selamat datang di Dashboard!</p>
          <button className='px-4 py-2 bg-red-600 text-white rounded-lg mt-2 md:w-2/3 hover:bg-gray-100 hover:text-red-600 transition duration-500' onClick={() => signOut()}>Log out</button>
        </div>
      </div>
      <div className='mt-10 md:w-2/3 md:mx-auto'>
        <div className='flex flex-col'>
          <h1 className='text-xl text-slate-900 font-semibold'>Tabel mahasiswa</h1>
          <p className='text-base text-slate-700'>Daftar mahasiswa yang sudah terdata di database mahasiswa UNSRIT.</p>
          <button className='px-4 py-2 bg-blue-500 rounded-lg my-5 text-white w-1/2 md:w-1/6 hover:bg-gray-100 hover:text-blue-600 transition duration-500' onClick={() => Router.push('/mahasiswa/tambah')}>Tambah Data</button>
        </div>
        <div className="overflow-auto rounded-lg mt-3">
          <table className='shadow-lg w-full mb-3'>
            <thead className='bg-gray-200 w-full'>
              <tr className='text-left'>
                <th className='px-4 py-2 tracking-wide'>Nama</th>
                <th className='px-4 py-2 tracking-wide'>NIM</th>
                <th className='px-4 py-2 tracking-wide'>Jurusan</th>
                <th className='px-4 py-2 tracking-wide'>Opsi</th>
              </tr>
            </thead>
            <tbody className='border'>
              {!mahasiswa.data?.mahasiswa.length
                ? <tr>
                    <td className='px-4 py-2 whitespace-nowrap'>kosong</td>
                    <td className='px-4 py-2 whitespace-nowrap'>kosong</td>
                    <td className='px-4 py-2 whitespace-nowrap'>kosong</td>
                    <td className='px-4 py-2 whitespace-nowrap'>kosong</td>
                  </tr>
                : mahasiswa.data.mahasiswa.map((mhs) => (
                  <tr className='text-left' key={mhs.id}>
                    <td className='px-4 py-2 whitespace-nowrap'>{mhs.nama}</td>
                    <td className='px-4 py-2 whitespace-nowrap'>{mhs.nim}</td>
                    <td className='px-4 py-2 whitespace-nowrap'>{mhs.jurusan.nama}</td>
                    <td className='px-4 py-2 whitespace-nowrap flex flex-row space-x-4 items-center justify-center'>
                      <span className='px-4 py-2 whitespace-nowrap bg-teal-500 text-white rounded-lg my-2 hover:bg-gray-100 hover:text-teal-600 transition duration-500 cursor-pointer' onClick={() => Router.push(`/mahasiswa/${mhs.id}`)}>Info</span>
                      <span className='px-4 py-2 whitespace-nowrap bg-green-500 text-white rounded-lg my-2 hover:bg-gray-100 hover:text-green-600 transition duration-500 cursor-pointer' onClick={() => Router.push(`/mahasiswa/edit/${mhs.id}`)}>Edit</span>
                      <span className='px-4 py-2 whitespace-nowrap bg-red-500 text-white rounded-lg my-2 hover:bg-gray-100 hover:text-red-600 transition duration-500 cursor-pointer' onClick={() => hapusMahasiswa(mhs.id)}>Hapus</span>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <footer className='pt-48 flex flex-row justify-center md:mb-3'>
        <h1>RKereh @ {now} | <a href="https://github.com/kereh" target='_blank' className='text-blue-700 outline-1'>Download Source Code</a></h1>
      </footer>
    </div>
  )
}