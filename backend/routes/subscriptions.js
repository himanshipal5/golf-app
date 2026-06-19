const express = require('express')
const router = express.Router()
const supabase = require('../supabase')
const auth = require('../middleware/auth')

// MOCK SUBSCRIBE
router.post('/subscribe', auth, async (req, res) => {
  try {
    const { plan } = req.body
    const user_id = req.user.id

    const endDate = plan === 'yearly'
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    // Save subscription
    await supabase.from('subscriptions').insert([{
      user_id,
      plan,
      status: 'active',
      stripe_customer_id: 'mock_' + user_id,
      end_date: endDate.toISOString()
    }])

    // Update user status
    await supabase.from('users')
      .update({ 
        subscription_status: 'active', 
        subscription_plan: plan 
      })
      .eq('id', user_id)

    res.json({ 
      message: 'Subscription activated successfully!',
      plan,
      status: 'active'
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// GET MY SUBSCRIPTION
router.get('/my-subscription', auth, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) throw error
    res.json({ subscription: data })
  } catch (error) {
    res.status(404).json({ message: 'No subscription found' })
  }
})

module.exports = router