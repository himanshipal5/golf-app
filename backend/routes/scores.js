const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const auth = require('../middleware/auth')

// ADD SCORE
router.post('/add', auth, async (req, res) => {
  try {
    const { score, date } = req.body
    const user_id = req.user.id

    if (score < 1 || score > 45) {
      return res.status(400).json({ 
        message: 'Score must be between 1 and 45' 
      })
    }

    const { data: existingScore } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user_id)
      .eq('date', date)
      .single()

    if (existingScore) {
      return res.status(400).json({ 
        message: 'Score already exists for this date' 
      })
    }

    const { data: currentScores } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: true })

    if (currentScores && currentScores.length >= 5) {
      const oldest = currentScores[0]
      await supabase
        .from('scores')
        .delete()
        .eq('id', oldest.id)
    }

    const { data: newScore, error } = await supabase
      .from('scores')
      .insert([{ user_id, score, date }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({ 
      message: 'Score added successfully', 
      score: newScore 
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET MY SCORES
router.get('/my-scores', auth, async (req, res) => {
  try {
    const user_id = req.user.id

    const { data: scores, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', user_id)
      .order('date', { ascending: false })

    if (error) throw error

    res.json({ scores })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// EDIT SCORE
router.put('/edit/:id', auth, async (req, res) => {
  try {
    const { score, date } = req.body
    const user_id = req.user.id

    if (score < 1 || score > 45) {
      return res.status(400).json({ 
        message: 'Score must be between 1 and 45' 
      })
    }

    const { data: updated, error } = await supabase
      .from('scores')
      .update({ score, date })
      .eq('id', req.params.id)
      .eq('user_id', user_id)
      .select()
      .single()

    if (error) throw error

    res.json({ 
      message: 'Score updated successfully', 
      score: updated 
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE SCORE
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const user_id = req.user.id

    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', user_id)

    if (error) throw error

    res.json({ message: 'Score deleted successfully' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router