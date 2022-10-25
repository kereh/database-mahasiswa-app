import type { GetServerSideProps,GetServerSidePropsContext } from 'next'
import { getServerSession } from 'src/server/helper/get-session'
import { trpc } from 'src/utils/trpc'
import { useState } from 'react'
import NextHead from 'next/head'
import Swal from 'sweetalert2'
import Router from 'next/router'

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

export default function tambah() {

  const jurusan = trpc.mahasiswa.semuaJurusan.useQuery()
  const baru = trpc.mahasiswa.tambahDataMahasiswa.useMutation({
    onSuccess: (data) => {
      Swal.fire({
        title: 'Berhasil :)',
        text: `Data mahasiswa dengan nama ${data.tambah.nama} berhasil disimpan`,
        icon: 'success',
        confirmButtonText: 'OK'
      })
    },
    onError: (err) => {
      Swal.fire({
        title: 'Oopps :(',
        text: `Terjadi Kesalahan ${err.message}`,
        icon: 'error',
        confirmButtonText: 'OK'
      })
    }
  })

  const [nama, setnama] = useState('')
  const [nim, setnim] = useState('')
  const [jurusanId, setjrs] = useState('')

  const submitHandler = (e: any) => {
    e.preventDefault()
    baru.mutate({nama,nim,jurusanId})
    setnama('')
    setnim('')
    setjrs('')
  }
  
  return (
    <div>
      <NextHead>
        <title>Tambah data mahasiswa</title>
      </NextHead>
      <div className='container p-4 mx-auto pt-32 md:pt-20 md:w-2/5 md:mb-5'>
        <div>
          <h1 className='text-xl font-bold text-slate-900 mb-2'>Form tambah data</h1>
          <p className='text-base text-slate-800'>Silahkan masukan data dari mahasiswa yang akan ditambahkan ke database.</p>
        </div>
        <div className='border rounded-lg shadow-lg p-4 mt-5'>
          <form onSubmit={submitHandler}>
            <div className="my-2">
              <label htmlFor="nama" className='block mb-2'>Nama Lengkap</label>
              <input type="text" className='border rounded-lg p-2 w-full bg-gray-100' autoComplete='false' placeholder='John Doe' onChange={(e) => setnama(e.currentTarget.value)} value={nama}/>
            </div>
            <div className="my-2">
              <label htmlFor="nim" className='block mb-2'>NIM</label>
              <input type="text" className='border rounded-lg p-2 w-full bg-gray-100' autoComplete='false' placeholder='291123' onChange={(e) => setnim(e.currentTarget.value)} value={nim} />
            </div>
            <div className="my-2">
              <label htmlFor="jurusan" className='block mb-2'>JURUSAN</label>
              {!jurusan?.data
                ? 'Memuat Jurusan...'
                : <select className='bg-gray-100 border p-4 rounded-lg w-full focus:border-0' onChange={(e) => setjrs(e.currentTarget.value)} value={jurusanId}>
                    <option selected>Pilih Jurusan</option>
                    {jurusan.data.jurusan.map((jr) => (
                      <option key={jr.id} value={jr.id}>{jr.nama}</option>
                    ))}
                  </select>
              }
            </div>
            <div className="mt-5 flex flex-col space-y-3">
              <button className="px-4 py-2 rounded-lg w-full bg-green-500 text-white hover:bg-gray-100 hover:text-green-500 transition duration-500" type='submit' disabled={baru.isLoading}>Simpan Data</button>
              <button className="px-4 py-2 rounded-lg w-full bg-red-500 text-white hover:bg-gray-100 hover:text-red-500 transition duration-500" onClick={(e) => {
                e.preventDefault()
                Router.push('/')
              }}>Kembali</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
