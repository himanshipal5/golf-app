import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Admin() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('users')
  const [users, setUsers] = useState([])
  const [charities, setCharities] = useState([])
  const [winners, setWinners] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [draws, setDraws] = useState([])
  const [newCharity, setNewCharity] = useState({ name: '', description: '', image_url: '', is_featured: false })
  const [drawDate, setDrawDate] = useState('')
  const [drawResult, setDrawResult] = useState(null)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) navigate('/login')
    else if (user?.role !== 'admin') navigate('/dashboard')
    else {
      fetchUsers()
      fetchCharities()
      fetchWinners()
      fetchAnalytics()
      fetchDraws()
    }
  }, [token, user])

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/users`)
      setUsers(res.data.users)
    } catch (err) { console.error(err) }
  }

  const fetchCharities = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/charities`)
      setCharities(res.data.charities)
    } catch (err) { console.error(err) }
  }

  const fetchWinners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/winners`)
      setWinners(res.data.winners)
    } catch (err) { console.error(err) }
  }

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/analytics`)
      setAnalytics(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchDraws = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/draws`)
      setDraws(res.data.draws)
    } catch (err) { console.error(err) }
  }

  const handleAddCharity = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/charities`, newCharity)
      setMsg('Charity added!')
      setNewCharity({ name: '', description: '', image_url: '', is_featured: false })
      fetchCharities()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add charity')
    }
  }

  const handleDeleteCharity = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/charities/${id}`)
      setMsg('Charity deleted!')
      fetchCharities()
    } catch (err) {
      setError('Failed to delete charity')
    }
  }

  const handleRunDraw = async () => {
    if (!drawDate) return setError('Please select a draw date')
    setError('')
    setMsg('')
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/admin/draws/run`, { draw_date: drawDate })
      setDrawResult(res.data)
      setMsg('Draw completed successfully!')
      fetchDraws()
    } catch (err) {
      setError(err.response?.data?.message || 'Draw failed')
    }
  }

  const handlePublishDraw = async (id) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/draws/${id}/publish`)
      setMsg('Draw published!')
      fetchDraws()
    } catch (err) {
      setError('Failed to publish draw')
    }
  }

  const handleVerifyWinner = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/winners/${id}/verify`, { status })
      setMsg(`Winner marked as ${status}!`)
      fetchWinners()
    } catch (err) {
      setError('Failed to update winner')
    }
  }

  const tabs = ['users', 'charities', 'draws', 'winners', 'analytics']

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>
        Admin Panel
      </h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '15px' }}>
        Manage users, draws, charities and winners
      </p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setMsg(''); setError('') }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              background: tab === t ? '#00c896' : '#1a1a1a',
              color: tab === t ? '#000' : '#888',
              border: '1px solid',
              borderColor: tab === t ? '#00c896' : '#333',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {msg && <p className="success-msg">{msg}</p>}
      {error && <p className="error-msg">{error}</p>}

      {/* USERS TAB */}
      {tab === 'users' && (
        <div className="card">
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
            All Users ({users.length})
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  {['Name', 'Email', 'Role', 'Subscription', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', color: '#666', textAlign: 'left', fontWeight: '600' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1e1e1e' }}>
                    <td style={{ padding: '12px', color: '#fff' }}>{u.name}</td>
                    <td style={{ padding: '12px', color: '#888' }}>{u.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span className={`tag ${u.role === 'admin' ? 'tag-purple' : 'tag-green'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`tag ${u.subscription_status === 'active' ? 'tag-green' : 'tag-red'}`}>
                        {u.subscription_status}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: '#666' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CHARITIES TAB */}
      {tab === 'charities' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
              Add New Charity
            </h2>
            <form onSubmit={handleAddCharity}>
              <input
                type="text"
                placeholder="Charity name"
                value={newCharity.name}
                onChange={e => setNewCharity({ ...newCharity, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newCharity.description}
                onChange={e => setNewCharity({ ...newCharity, description: e.target.value })}
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={newCharity.image_url}
                onChange={e => setNewCharity({ ...newCharity, image_url: e.target.value })}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#888', fontSize: '14px', marginBottom: '16px' }}>
                <input
                  type="checkbox"
                  checked={newCharity.is_featured}
                  onChange={e => setNewCharity({ ...newCharity, is_featured: e.target.checked })}
                  style={{ width: 'auto', marginBottom: 0 }}
                />
                Featured charity
              </label>
              <button type="submit" className="btn btn-green">
                Add Charity
              </button>
            </form>
          </div>

          <div className="card">
            <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
              All Charities ({charities.length})
            </h2>
            {charities.length === 0 ? (
              <p style={{ color: '#555' }}>No charities yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {charities.map(c => (
                  <div key={c.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    background: '#1e1e1e',
                    borderRadius: '8px',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: '600', fontSize: '15px' }}>{c.name}</p>
                      <p style={{ color: '#666', fontSize: '13px' }}>{c.description}</p>
                      {c.is_featured && <span className="tag tag-yellow" style={{ marginTop: '6px' }}>Featured</span>}
                    </div>
                    <button
                      className="btn btn-red"
                      style={{ padding: '6px 14px', fontSize: '13px' }}
                      onClick={() => handleDeleteCharity(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DRAWS TAB */}
      {tab === 'draws' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
              Run Monthly Draw
            </h2>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
              Draw Date
            </label>
            <input
              type="date"
              value={drawDate}
              onChange={e => setDrawDate(e.target.value)}
              style={{ maxWidth: '220px' }}
            />
            <button className="btn btn-green" onClick={handleRunDraw}>
              Run Draw
            </button>

            {drawResult && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: '#00c89610',
                borderRadius: '10px',
                border: '1px solid #00c89630'
              }}>
                <p style={{ color: '#00c896', fontWeight: '700', marginBottom: '10px' }}>
                  Draw Results
                </p>
                <p style={{ color: '#fff', fontSize: '14px' }}>
                  Winning Numbers: <strong>{JSON.parse(drawResult.winning_numbers || '[]').join(', ') || drawResult.winning_numbers}</strong>
                </p>
                <p style={{ color: '#fff', fontSize: '14px' }}>
                  Total Winners: <strong>{drawResult.total_winners}</strong>
                </p>
                <p style={{ color: '#fff', fontSize: '14px' }}>
                  Prize Pool: <strong>£{drawResult.prize_pool}</strong>
                </p>
              </div>
            )}
          </div>

          <div className="card">
            <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
              All Draws ({draws.length})
            </h2>
            {draws.length === 0 ? (
              <p style={{ color: '#555' }}>No draws yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {draws.map(d => (
                  <div key={d.id} style={{
                    padding: '14px 16px',
                    background: '#1e1e1e',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div>
                      <p style={{ color: '#fff', fontWeight: '600' }}>
                        {new Date(d.draw_date).toLocaleDateString()}
                      </p>
                      <p style={{ color: '#666', fontSize: '13px' }}>
                        Numbers: {d.winning_numbers}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className={`tag ${d.status === 'published' ? 'tag-green' : 'tag-yellow'}`}>
                        {d.status}
                      </span>
                      {d.status !== 'published' && (
                        <button
                          className="btn btn-green"
                          style={{ padding: '6px 14px', fontSize: '13px' }}
                          onClick={() => handlePublishDraw(d.id)}
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* WINNERS TAB */}
      {tab === 'winners' && (
        <div className="card">
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '20px' }}>
            Winners ({winners.length})
          </h2>
          {winners.length === 0 ? (
            <p style={{ color: '#555' }}>No winners yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {winners.map(w => (
                <div key={w.id} style={{
                  padding: '14px 16px',
                  background: '#1e1e1e',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <p style={{ color: '#fff', fontWeight: '600' }}>
                      {w.users?.name || 'Unknown'}
                    </p>
                    <p style={{ color: '#666', fontSize: '13px' }}>{w.users?.email}</p>
                    <p style={{ color: '#f1c40f', fontSize: '13px' }}>
                      {w.match_type} · £{w.prize_amount}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className={`tag ${w.status === 'paid' ? 'tag-green' : w.status === 'approved' ? 'tag-yellow' : 'tag-red'}`}>
                      {w.status}
                    </span>
                    {w.status === 'pending' && (
                      <button
                        className="btn btn-green"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => handleVerifyWinner(w.id, 'approved')}
                      >
                        Approve
                      </button>
                    )}
                    {w.status === 'approved' && (
                      <button
                        className="btn btn-green"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => handleVerifyWinner(w.id, 'paid')}
                      >
                        Mark Paid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {tab === 'analytics' && analytics && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}>
          {[
            { label: 'Total Users', value: analytics.totalUsers, color: '#00c896' },
            { label: 'Active Subscribers', value: analytics.activeSubscribers, color: '#9b59b6' },
            { label: 'Total Draws', value: analytics.totalDraws, color: '#f1c40f' },
            { label: 'Total Prize Pool', value: `£${analytics.totalPrizePool}`, color: '#e74c3c' },
            { label: 'Total Paid Out', value: `£${analytics.totalPaidOut}`, color: '#00c896' },
          ].map(stat => (
            <div key={stat.label} className="card" style={{ textAlign: 'center', borderTop: `3px solid ${stat.color}` }}>
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '10px' }}>{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '28px', fontWeight: '700' }}>{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}