const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const auth = require('../middleware/auth')

// GET ALL CHARITIES
router.get('/', async (req, res) => {
  try {
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ charities })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET FEATURED CHARITIES
router.get('/featured', async (req, res) => {
  try {
    const { data: charities, error } = await supabase
      .from('charities')
      .select('*')
      .eq('is_featured', true)
    if (error) throw error
    res.json({ charities })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// SELECT CHARITY (logged in user)
router.post('/select', auth, async (req, res) => {
  try {
    const { charity_id, charity_percentage } = req.body
    const user_id = req.user.id

    if (charity_percentage < 10) {
      return res.status(400).json({ 
        message: 'Minimum charity contribution is 10%' 
      })
    }

    const { data, error } = await supabase
      .from('users')
      .update({ charity_id, charity_percentage })
      .eq('id', user_id)
      .select()
      .single()

    if (error) throw error
    res.json({ message: 'Charity selected successfully', user: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router