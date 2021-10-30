import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import getConfig from 'next/config'
import { useRouter } from 'next/dist/client/router'

const { publicRuntimeConfig } = getConfig()
const AuthContext = createContext()

export async function getUser() {
  try {
    return await axios
      .get('/api/auth', {
        withCredentials: true,
      })
      .then(res => res.data)
  } catch (err) {
    if (err) return { status: 'SIGNED_OUT', user: null }
  }
}

export const AuthProvider = props => {
  const [auth, setAuth] = useState({ status: 'SIGNED_OUT', user: null })
  const router = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const authRoutes = ['/signin', '/signup']
  const privateRoutes = ['/profile', '/dashboard']
  const authCondition = authRoutes.includes(router.pathname) && auth.status === 'SIGNED_IN'
  const privateCondition = privateRoutes.includes(router.pathname) && auth.status === 'SIGNED_OUT'
  const routeCondition = authCondition || privateCondition || router.pathname.includes('/admin')

  useEffect(() => checkAuth(), [])

  async function checkAuth() {
    return await getUser().then(res => {
      setAuth(res)
      setAuthChecked(true)
    })
  }

  function checkRoute() {
    if (routeCondition) {
      if (authCondition) {
        router.replace('/').then(
          setTimeout(() => {
            alert('You are already logged in')
          }, 200)
        )
      }

      if (privateCondition) {
        router.replace('/signin').then(
          setTimeout(() => {
            alert('You are not authorized')
          }, 200)
        )
      }
    }
    console.log('test')
  }

  useEffect(() => {
    if (routeCondition && authChecked) checkRoute()
  }, [router.pathname, authChecked && authChecked])

  async function login(email, password) {
    try {
      const response = await axios.post(
        `${publicRuntimeConfig.baseUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      )

      if (response) router.push('/')
      return checkAuth()
    } catch (err) {
      console.error(err, 'Incorrect email or password entered')
    }
  }

  async function register({ email, password, firstName, lastName }) {
    try {
      const response = await axios.post(`${publicRuntimeConfig.baseUrl}/api/auth/signup`, {
        firstName,
        lastName,
        email,
        password,
      })

      if (response) router.push('/')
      return checkAuth()
    } catch (err) {
      console.error(err)
    }
  }

  async function logout() {
    try {
      const response = await axios.delete(`${publicRuntimeConfig.baseUrl}/api/auth/logout`, {
        withCredentials: true,
      })

      if (response) router.push('/')
      return checkAuth()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        checkAuth,
        logout,
        register,
        login,
      }}
      {...props}
    >
      {props.children}
    </AuthContext.Provider>
  )
}
export const useAuth = () => React.useContext(AuthContext)