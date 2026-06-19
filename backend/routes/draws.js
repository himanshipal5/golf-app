const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const auth = require('../middleware/auth')

// GET ALL PUBLISHED DRAWS
router.get('/', async (req, res) => {
  try {
    const { data: draws, error } = await supabase
      .from('draws')
      .select('*')
      .eq('status', 'published')
      .order('draw_date', { ascending: false })
    if (error) throw error
    res.json({ draws })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET LATEST DRAW
router.get('/latest', async (req, res) => {
  try {
    const { data: draw, error } = await supabase
      .from('draws')
      .select('*')
      .eq('status', 'published')
      .order('draw_date', { ascending: false })
      .limit(1)
      .single()
    if (error) throw error
    res.json({ draw })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// CHECK MY RESULTS
router.get('/my-results', auth, async (req, res) => {
  try {
    const user_id = req.user.id
    const { data: winners, error } = await supabase
      .from('winners')
      .select('*, draws(*)')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ winners })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router