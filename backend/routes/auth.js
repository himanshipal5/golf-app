const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const supabase = require('../supabase')
const auth = require('../middleware/auth')
require('dotenv').config()

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password: hashedPassword,
        role: 'user',
        subscription_status: 'inactive'
      }])
      .select()
      .single()

    if (error) throw error

    // Create token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        subscription_status: user.subscription_status
      }
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/me', auth, async (req, res) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('id, name, email, role, subscription_status, subscription_plan, charity_id, charity_percentage')
        .eq('id', req.user.id)
        .single()
  
      if (error) throw error
      res.json({ user })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  })

module.exports = router