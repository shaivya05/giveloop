const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

// CORS — must be before everything else
const allowedOrigins = [
  'http://localhost:3000',
  'https://giveloop-six.vercel.app',
  'https://giveloop-git-main-shaivyas-projects.vercel.app'
]

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  next()
})

app.use(cors({
  origin: '*'
}))

app.use(express.json())

const authRoutes = require('./routes/authRoutes')
const itemRoutes = require('./routes/itemRoutes')
const ngoRoutes = require('./routes/ngoRoutes')
const pickupRoutes = require('./routes/pickupRoutes')
const impactRoutes = require('./routes/impactRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/ngos', ngoRoutes)
app.use('/api/pickups', pickupRoutes)
app.use('/api/impact', impactRoutes)

const { protect } = require('./middleware/authMiddleware')

app.get('/', (req, res) => {
  res.json({ message: 'GiveLoop API is running 🚀' })
})

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