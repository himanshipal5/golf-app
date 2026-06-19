import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Dashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [scores, setScores] = useState([])
  const [newScore, setNewScore] = useState({ score: '', date: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ score: '', date: '' })

  useEffect(() => {
    if (!token) navigate('/login')
    else fetchScores()
  }, [token])

  const fetchScores = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/scores/my-scores`
      )
      setScores(res.data.scores)
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddScore = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/scores/add`,
        { score: parseInt(newScore.score), date: newScore.date }
      )
      setSuccess('Score added successfully!')
      setNewScore({ score: '', date: '' })
      fetchScores()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add score')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/scores/delete/${id}`
      )
      setSuccess('Score deleted!')
      fetchScores()
    } catch (err) {
      setError('Failed to delete score')
    }
  }

  const handleEdit = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/scores/edit/${id}`,
        { score: parseInt(editData.score), date: editData.date }
      )
      setSuccess('Score updated!')
      setEditingId(null)
      fetchScores()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update score')
    }
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto' }}>

      {/* Welcome */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '6px'
        }}>
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color: '#666', fontSize: '15px' }}>
          Here's your GolfGives dashboard
        </p>
      </div>

      {/* Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginBottom: '36px'
      }}>
        <div className="card" style={{ borderTop: '3px solid #00c896' }}>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
            Subscription
          </p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            {user?.subscription_status === 'active' ? '✅ Active' : '⚠️ Inactive'}
          </p>
        </div>
        <div className="card" style={{ borderTop: '3px solid #9b59b6' }}>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
            Scores Entered
          </p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            {scores.length} / 5
          </p>
        </div>
        <div className="card" style={{ borderTop: '3px solid #f1c40f' }}>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
            Draw Status
          </p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            Monthly Draw
          </p>
        </div>
        <div className="card" style={{ borderTop: '3px solid #e74c3c' }}>
          <p style={{ color: '#666', fontSize: '13px', marginBottom: '8px' }}>
            Charity %
          </p>
          <p style={{ color: '#fff', fontWeight: '700', fontSize: '18px' }}>
            10%
          </p>
        </div>
      </div>

      {/* Score Entry */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '6px'
        }}>
          Enter Your Score
        </h2>
        <p style={{ color: '#666', fontSize: '13px', marginBottom: '20px' }}>
          Stableford format · Range 1–45 · Max 5 scores stored
        </p>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleAddScore} style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap',
          alignItems: 'flex-end'
        }}>
          <div style={{ flex: 1, minWidth: '120px' }}>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
              Score (1–45)
            </label>
            <input
              type="number"
              min="1"
              max="45"
              placeholder="e.g. 32"
              value={newScore.score}
              onChange={e => setNewScore({ ...newScore, score: e.target.value })}
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          <div style={{ flex: 1, minWidth: '140px' }}>
            <label style={{ fontSize: '13px', color: '#888', display: 'block', marginBottom: '6px' }}>
              Date Played
            </label>
            <input
              type="date"
              value={newScore.date}
              onChange={e => setNewScore({ ...newScore, date: e.target.value })}
              required
              style={{ marginBottom: 0 }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-green"
            disabled={loading}
            style={{ padding: '11px 24px' }}
          >
            {loading ? 'Adding...' : 'Add Score'}
          </button>
        </form>
      </div>

      {/* My Scores */}
      <div className="card">
        <h2 style={{
          fontSize: '20px',
          fontWeight: '700',
          color: '#fff',
          marginBottom: '20px'
        }}>
          My Scores
        </h2>

        {scores.length === 0 ? (
          <p style={{ color: '#555', fontSize: '14px' }}>
            No scores yet — add your first score above!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {scores.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: '#1e1e1e',
                borderRadius: '8px',
                border: '1px solid #2a2a2a',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {editingId === s.id ? (
                  <>
                    <input
                      type="number"
                      min="1"
                      max="45"
                      value={editData.score}
                      onChange={e => setEditData({ ...editData, score: e.target.value })}
                      style={{ width: '80px', marginBottom: 0 }}
                    />
                    <input
                      type="date"
                      value={editData.date}
                      onChange={e => setEditData({ ...editData, date: e.target.value })}
                      style={{ width: '150px', marginBottom: 0 }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-green"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => handleEdit(s.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{
                        background: '#00c89620',
                        color: '#00c896',
                        borderRadius: '8px',
                        padding: '6px 14px',
                        fontWeight: '700',
                        fontSize: '20px'
                      }}>
                        {s.score}
                      </span>
                      <div>
                        <p style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                          Score #{scores.length - i}
                        </p>
                        <p style={{ color: '#666', fontSize: '13px' }}>
                          {new Date(s.date).toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-outline"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => {
                          setEditingId(s.id)
                          setEditData({ score: s.score, date: s.date })
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-red"
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                        onClick={() => handleDelete(s.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}