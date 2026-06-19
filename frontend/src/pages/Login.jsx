import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '8px'
        }}>
          Welcome back
        </h2>
        <p style={{ color: '#666', marginBottom: '28px', fontSize: '14px' }}>
          Sign in to your GolfGives account
        </p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '13px', color: '#888', marginBottom: '6px', display: 'block' }}>
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <label style={{ fontSize: '13px', color: '#888', marginBottom: '6px', display: 'block' }}>
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="btn btn-green"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#00c896', textDecoration: 'none' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}