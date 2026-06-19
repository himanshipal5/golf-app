import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', charity_id: '', charity_percentage: 10 })
  const [charities, setCharities] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCharities()
  }, [])

  const fetchCharities = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/charities`)
      setCharities(res.data.charities)
    } catch (err) {
      console.error(err)
    }
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form.name, form.email, form.password)

      // If charity selected, update it
      if (form.charity_id) {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/charities/select`,
          {
            charity_id: form.charity_id,
            charity_percentage: parseInt(form.charity_percentage)
          }
        )
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
      <div className="card" style={{ width: '100%', maxWidth: '460px' }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '8px'
        }}>
          Create your account
        </h2>
        <p style={{ color: '#666', marginBottom: '28px', fontSize: '14px' }}>
          Join GolfGives and start making an impact
        </p>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="John Smith"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          {/* CHARITY SELECTION */}
          <div style={{
            background: '#00c89608',
            border: '1px solid #00c89620',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <p style={{
              color: '#00c896',
              fontSize: '13px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              🌱 Choose Your Charity (Optional)
            </p>

            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
              Select Charity
            </label>
            <select
              name="charity_id"
              value={form.charity_id}
              onChange={handleChange}
              style={{ marginBottom: '12px' }}
            >
              <option value="">-- Select a charity --</option>
              {charities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
              Contribution % (min 10%)
            </label>
            <input
              type="number"
              name="charity_percentage"
              min="10"
              max="100"
              value={form.charity_percentage}
              onChange={handleChange}
              style={{ marginBottom: 0 }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-green"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666', fontSize: '14px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00c896', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}