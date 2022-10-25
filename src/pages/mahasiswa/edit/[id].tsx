import type { GetServerSidePropsContext,InferGetServerSidePropsType } from 'next'
import { getServerSession } from 'src/server/helper/get-session'
import { trpc } from 'src/utils/trpc'
import { useState } from 'react'
import Head from 'next/head'
import Router from 'next/router'
import Swal from 'sweetalert2'

export async function getServerSideProps(context: GetServerSidePropsContext<{ id: string }>) {
  const session = await getServerSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/signin',
        permanent: false
      }
    }
  }
  const { id } = context.query
  return {
    props: {
      id
    }
  }
}

export default function edit(props: InferGetServerSidePropsType<typeof getServerSideProps>) {

  const { id } = props
  var [nama, setNama] = useState('')
  var [nim, setNim] = useState('')
  var [jurusanId, setJurusanId] = useState('')

  const client = trpc.useContext()
  const mahasiswa = trpc.mahasiswa.mahasiswaById.useQuery({ id })
  const jurusan = trpc.mahasiswa.semuaJurusan.useQuery()
  const mutate = trpc.mahasiswa.ubahDataMahasiswa.useMutation({
    onSuccess(data) {
      Swal.fire({
        title: 'Berhasil :)',
        text: `Data dari ${data.ubah.nama} berhasil diubah`,
        icon: 'success'
      })
      client.mahasiswa.mahasiswaById.invalidate({ id })
    },
    onError(err) {
      Swal.fire({
        title: 'Gagal :(',
        text: `${err.message}`,
        icon: 'error'
      })
    }
  })
  
  const submitHandler = (e: any) => {
    e.preventDefault()
    const old_nama = mahasiswa.data?.byid?.nama as string
    const old_nim = mahasiswa.data?.byid?.nim as string
    const old_jurusanId = mahasiswa.data?.byid?.jurusanId as string
    if (!nama.length) nama = old_nama
    if (!nim.length) nim = old_nim
    if (!jurusanId.length) jurusanId = old_jurusanId
    mutate.mutate({ id, nama, nim, jurusanId })
  }

  if (!mahasiswa.data) return (
    <div className='min-h-screen flex flex-col justify-center items-center'>
      <h1 className="text-2xl">Memuat...</h1>
    </div>
  )

  return (
    <div className='container p-4'>
      <Head>
        <title>Edit {mahasiswa.data.byid?.nama}</title>
      </Head>
      <div className="flex flex-column">
        <div className="pt-36 md:pt-20 mx-auto">
          <div>
            <h1 className='text-slate-900 text-2xl font-bold'>{mahasiswa.data.byid?.nama}</h1>
            <p className='text-slate-800'>
              Edit data dari mahasiswa {mahasiswa.data.byid?.nama}.
            </p>
          </div>
          <div className='mt-6'>
            <div className="p-4 border rounded-xl shadow-lg">
              <form onSubmit={submitHandler}>
                <div className='my-4'>
                  <label className='block'>Nama</label>
                  <input 
                    type="text" 
                    className='px-4 py-2 rounded-lg border w-full' 
                    value={nama}
                    onChange={(e) => setNama(e.currentTarget.value)}
                    placeholder={mahasiswa.data.byid?.nama}
                  />
                </div>
                <div className='my-4'>
                  <label className='block'>NIM</label>
                  <input 
                    type="text" 
                    className='px-4 py-2 rounded-lg border w-full' 
                    value={nim}
                    onChange={(e) => setNim(e.currentTarget.value)}
                    placeholder={mahasiswa.data.byid?.nim}
                  />
                </div>
                <div className="my-4">
                  <label className='block'>Jurusan</label>
                  <select 
                    className='border px-4 py-2 rounded-lg w-full focus:border-0' 
                    value={jurusanId} 
                    onChange={(e) => setJurusanId(e.currentTarget.value)}
                  >
                    <option selected>{mahasiswa.data.byid?.jurusan.nama}</option>
                    {jurusan.data?.jurusan.filter((e) => {
                        return e.nama !== mahasiswa.data.byid?.jurusan.nama
                      }).map((j) => (
                        <option value={j.id}>{j.nama}</option>
                      ))
                    }
                  </select>
                </div>
                <div className='space-y-3'>
                  <button 
                    className='px-4 py-2 bg-green-500 rounded-lg text-white w-full hover:bg-gray-100 hover:text-green-500 transition duration-500'
                    type="submit"
                  >
                    Simpan Pembaruan
                  </button>
                  <button 
                    className='px-4 py-2 bg-red-500 rounded-lg text-white w-full hover:bg-gray-100 hover:text-red-500 transition duration-500'
                    onClick={(e) => {
                      e.preventDefault()
                      Router.push('/')
                    }}
                  >
                    Kembali
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}