import type { GetServerSideProps,GetServerSidePropsContext } from 'next'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { getServerSession } from 'src/server/helper/get-session'
import Router from 'next/router'
import Swal from 'sweetalert2'
import NextHead from 'next/head'

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx)
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {
      session
    }
  }
}

export default function signin() {

  const [user, setUser] = useState({ username: '', password: '' })

  const submitHandler = (e: any) => {
    e.preventDefault()
    signIn('credential-login', {
      username: user.username,
      password: user.password,
      redirect: false
    }).then((data) => {
      if (data?.ok) {
        Swal.fire({
          title: 'Login Berhasil :)',
          text: `Login sebagai admin berhasil`,
          icon: 'success',
          confirmButtonText: 'OK'
        })
        Router.push('/')
      } else {
        Swal.fire({
          title: 'Login Gagal :(',
          text: 'Username atau Password salah',
          icon: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
    setUser({ ...user, username: '', password: '' })
  }

  return (
    <div className="container mx-auto p-4">
      <NextHead>
        <title>Halaman Login</title>
      </NextHead>
      <div className="flex flex-col md:items-center md:justify-center">
        <div className="pt-36 md:pt-20">
          <h1 className="text-2xl text-slate-900 mb-3">Database Mahasiswa</h1>
          <p>Silahkan masukan username dan password untuk login.</p>
          <div className="p-4 border rounded-lg mt-10 shadow-lg bg-gray-100">
            <form onSubmit={submitHandler}>
              <div className="my-3">
                <label htmlFor="username">Username</label>
                <input 
                  className="p-2 border rounded-md w-full"
                  type="text" 
                  name="username" 
                  id="username" 
                  placeholder="masukan username" 
                  onChange={(e) => setUser({ ...user, username: e.currentTarget.value })}
                  value={user.username}
                />
              </div>
              <div className="my-3">
                <label htmlFor="password">Password</label>
                <input 
                  className="p-2 border rounded-md w-full"
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="masukan password" 
                  onChange={(e) => setUser({ ...user, password: e.currentTarget.value })}
                  value={user.password}
                />
              </div>
              <div className="my-3">
                <button className="w-full py-2 px-4 bg-sky-500 text-white rounded-lg hover:border hover:border-sky-500 hover:bg-white hover:text-sky-500 transition-all duration-300 ease-in-out">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}