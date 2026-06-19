const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const auth = require('../middleware/auth')

// Admin check middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' })
  }
  next()
}

// GET ALL USERS
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// ADD CHARITY
router.post('/charities', auth, adminOnly, async (req, res) => {
  try {
    const { name, description, image_url, is_featured } = req.body
    const { data, error } = await supabase
      .from('charities')
      .insert([{ name, description, image_url, is_featured }])
      .select()
      .single()
    if (error) throw error
    res.status(201).json({ message: 'Charity added', charity: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// DELETE CHARITY
router.delete('/charities/:id', auth, adminOnly, async (req, res) => {
  try {
    const { error } = await supabase
      .from('charities')
      .delete()
      .eq('id', req.params.id)
    if (error) throw error
    res.json({ message: 'Charity deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// RUN DRAW (Random)
router.post('/draws/run', auth, adminOnly, async (req, res) => {
  try {
    const { draw_date } = req.body

    // Get all active users with scores
    const { data: users } = await supabase
      .from('users')
      .select('id')
      .eq('subscription_status', 'active')

    if (!users || users.length === 0) {
      return res.status(400).json({ message: 'No active subscribers' })
    }

    // Generate 5 random winning numbers (1-45)
    const winningNumbers = []
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1
      if (!winningNumbers.includes(num)) {
        winningNumbers.push(num)
      }
    }

    // Get all scores
    const { data: allScores } = await supabase
      .from('scores')
      .select('*')

    // Check each user's scores against winning numbers
    const winners = []
    for (const user of users) {
      const userScores = allScores
        .filter(s => s.user_id === user.id)
        .map(s => s.score)

      const matches = userScores.filter(s => 
        winningNumbers.includes(s)
      ).length

      if (matches >= 3) {
        const matchType = matches === 5 ? '5-match' : 
                         matches === 4 ? '4-match' : '3-match'
        winners.push({ user_id: user.id, match_type: matchType })
      }
    }

    // Calculate prize pool (mock - $10 per subscriber)
    const prizePool = users.length * 10
    const jackpot = prizePool * 0.40
    const fourMatch = prizePool * 0.35
    const threeMatch = prizePool * 0.25

    // Create draw record
    const { data: draw, error } = await supabase
      .from('draws')
      .insert([{
        draw_date,
        winning_numbers: JSON.stringify(winningNumbers),
        status: 'pending',
        jackpot_amount: jackpot
      }])
      .select()
      .single()

    if (error) throw error

    // Save winners
    for (const winner of winners) {
      const prizeAmount = winner.match_type === '5-match' ? jackpot :
                         winner.match_type === '4-match' ? fourMatch :
                         threeMatch
      await supabase.from('winners').insert([{
        user_id: winner.user_id,
        draw_id: draw.id,
        match_type: winner.match_type,
        prize_amount: prizeAmount / 
          winners.filter(w => w.match_type === winner.match_type).length
      }])
    }

    res.json({
      message: 'Draw completed!',
      winning_numbers: winningNumbers,
      total_winners: winners.length,
      prize_pool: prizePool,
      draw_id: draw.id
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// PUBLISH DRAW
router.put('/draws/:id/publish', auth, adminOnly, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('draws')
      .update({ status: 'published' })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ message: 'Draw published!', draw: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ALL WINNERS
router.get('/winners', auth, adminOnly, async (req, res) => {
  try {
    const { data: winners, error } = await supabase
      .from('winners')
      .select('*, users(name, email), draws(draw_date, winning_numbers)')
      .order('created_at', { ascending: false })
    if (error) throw error
    res.json({ winners })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// VERIFY WINNER
router.put('/winners/:id/verify', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body
    const { data, error } = await supabase
      .from('winners')
      .update({ status })
      .eq('id', req.params.id)
      .select()
      .single()
    if (error) throw error
    res.json({ message: 'Winner updated', winner: data })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET ANALYTICS
router.get('/analytics', auth, adminOnly, async (req, res) => {
  try {
    const { data: users } = await supabase
      .from('users').select('id, subscription_status')
    
    const { data: draws } = await supabase
      .from('draws').select('id, jackpot_amount')
    
    const { data: winners } = await supabase
      .from('winners').select('prize_amount')

    const totalUsers = users?.length || 0
    const activeSubscribers = users?.filter(
      u => u.subscription_status === 'active'
    ).length || 0
    const totalPrizePool = draws?.reduce(
      (sum, d) => sum + d.jackpot_amount, 0
    ) || 0
    const totalPaidOut = winners?.reduce(
      (sum, w) => sum + w.prize_amount, 0
    ) || 0

    res.json({
      totalUsers,
      activeSubscribers,
      totalPrizePool,
      totalPaidOut,
      totalDraws: draws?.length || 0
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router