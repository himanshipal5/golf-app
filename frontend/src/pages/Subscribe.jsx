import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Subscribe() {
    const { token, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubscribe = async (plan) => {
    if (!token) return navigate('/login')
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subscriptions/subscribe`,
        { plan }
      )
      await refreshUser()
setSuccess(`🎉 ${plan} subscription activated successfully!`)
setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to subscribe')
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
      <div style={{ maxWidth: '700px', width: '100%' }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: '800',
          color: '#fff',
          textAlign: 'center',
          marginBottom: '12px'
        }}>
          Choose Your Plan
        </h1>
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '16px',
          fontSize: '16px'
        }}>
          Every plan includes charity contribution and monthly prize draw entry
        </p>

        {/* Demo notice */}
        <div style={{
          background: '#f1c40f15',
          border: '1px solid #f1c40f30',
          borderRadius: '8px',
          padding: '10px 16px',
          textAlign: 'center',
          marginBottom: '36px'
        }}>
          <p style={{ color: '#f1c40f', fontSize: '13px' }}>
            🧪 Demo Mode — No real payment required
          </p>
        </div>

        {error && <p className="error-msg" style={{ textAlign: 'center' }}>{error}</p>}
        {success && <p className="success-msg" style={{ textAlign: 'center' }}>{success}</p>}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {/* Monthly */}
          <div className="card" style={{ textAlign: 'center', padding: '36px 24px' }}>
            <h2 style={{ color: '#fff', fontSize: '22px', marginBottom: '8px' }}>Monthly</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
              Flexible, cancel anytime
            </p>
            <div style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#00c896',
              marginBottom: '8px'
            }}>
              799 INR
            </div>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>per month</p>
            <ul style={{ listStyle: 'none', marginBottom: '32px', textAlign: 'left' }}>
              {[
                'Monthly prize draw entry',
                'Score tracking (5 scores)',
                '10% to your charity',
                'Winner notifications'
              ].map(f => (
                <li key={f} style={{
                  color: '#888',
                  fontSize: '14px',
                  padding: '6px 0',
                  borderBottom: '1px solid #222'
                }}>
                  <span style={{ color: '#00c896', marginRight: '8px' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="btn btn-outline"
              style={{ width: '100%' }}
              onClick={() => handleSubscribe('monthly')}
              disabled={loading}
            >
              {loading ? 'Activating...' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Yearly */}
          <div className="card" style={{
            textAlign: 'center',
            padding: '36px 24px',
            border: '2px solid #00c896',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: '#00c896',
              color: '#000',
              padding: '4px 16px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              BEST VALUE
            </div>
            <h2 style={{ color: '#fff', fontSize: '22px', marginBottom: '8px' }}>Yearly</h2>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
              Save 2 months free
            </p>
            <div style={{
              fontSize: '48px',
              fontWeight: '800',
              color: '#00c896',
              marginBottom: '8px'
            }}>
              6999 INR
            </div>
            <p style={{ color: '#555', fontSize: '14px', marginBottom: '32px' }}>per year</p>
            <ul style={{ listStyle: 'none', marginBottom: '32px', textAlign: 'left' }}>
              {[
                'All monthly features',
                '12 draw entries per year',
                'Priority winner verification',
                'Increased charity impact'
              ].map(f => (
                <li key={f} style={{
                  color: '#888',
                  fontSize: '14px',
                  padding: '6px 0',
                  borderBottom: '1px solid #222'
                }}>
                  <span style={{ color: '#00c896', marginRight: '8px' }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="btn btn-green"
              style={{ width: '100%' }}
              onClick={() => handleSubscribe('yearly')}
              disabled={loading}
            >
              {loading ? 'Activating...' : 'Subscribe Yearly'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}