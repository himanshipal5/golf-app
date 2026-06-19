const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

app.use('/api/subscriptions/webhook', express.raw({ type: 'application/json' }))

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/scores', require('./routes/scores'))
app.use('/api/draws', require('./routes/draws'))
app.use('/api/charities', require('./routes/charities'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/subscriptions', require('./routes/subscriptions'))

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Golf App API is running!' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})