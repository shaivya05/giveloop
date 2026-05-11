const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://giveloop-git-main-shaivyas-projects.vercel.app'
  ],
  credentials: true
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