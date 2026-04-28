const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

const itemRoutes = require('./routes/itemRoutes')
app.use('/api/items', itemRoutes)

const ngoRoutes = require('./routes/ngoRoutes')
app.use('/api/ngos', ngoRoutes)

const pickupRoutes = require('./routes/pickupRoutes')
app.use('/api/pickups', pickupRoutes)
// Test route
app.get('/', (req, res) => {
  res.json({ message: 'GiveLoop API is running 🚀' })
})

// Protected test route
const { protect } = require('./middleware/authMiddleware')

app.get('/api/protected', protect, (req, res) => {
  res.json({ 
    message: 'You are authorized!', 
    user: req.user 
  })
})
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})