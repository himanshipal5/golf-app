import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      background: '#111',
      borderBottom: '1px solid #222',
      padding: '14px 0',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{
          textDecoration: 'none',
          fontSize: '20px',
          fontWeight: '700',
          color: '#00c896'
        }}>
          GolfGives
        </Link>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{
                color: '#ccc',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                Dashboard
              </Link>
              <Link to="/subscribe" style={{ 
                color: '#00c896', 
                textDecoration: 'none', 
                fontSize: '14px' 
                }}>
            Subscribe
           </Link>


              {user.role === 'admin' && (
                <Link to="/admin" style={{
                  color: '#9b59b6',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}>
                  Admin
                </Link>
              )}
              <span style={{ color: '#555', fontSize: '14px' }}>
                Hi, {user.name?.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{
                color: '#ccc',
                textDecoration: 'none',
                fontSize: '14px'
              }}>
                Login
              </Link>
              <Link to="/register">
                <button className="btn btn-green" style={{
                  padding: '9px 20px',
                  fontSize: '14px'
                }}>
                  Join Now
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}