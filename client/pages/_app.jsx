import Head from 'next/head'
import React, { useEffect } from 'react'
import Header from '../components/Header'
import { AuthProvider } from '../contexts/Auth.context'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  useEffect(() => (document.documentElement.lang = 'en-us'), [])

  return (
    <React.Fragment>
      <Head>
        <meta charSet='utf-8' />
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
        <title>Next.js app</title>
      </Head>
      <Header />
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </React.Fragment>
  )
}

export default MyApp
