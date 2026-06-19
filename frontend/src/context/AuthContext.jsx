import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      const savedUser = localStorage.getItem('user')
      if (savedUser) setUser(JSON.parse(savedUser))
    }
  }, [token])

  const login = async (email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
      { email, password }
    )
    setToken(res.data.token)
    setUser(res.data.user)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
      { name, email, password }
    )
    setToken(res.data.token)
    setUser(res.data.user)
    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    return res.data
  }

  const refreshUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/me`
      )
      setUser(res.data.user)
      localStorage.setItem('user', JSON.stringify(res.data.user))
    } catch (err) {
      console.error(err)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth  =  () => useContext(AuthContext)