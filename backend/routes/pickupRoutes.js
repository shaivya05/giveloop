const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/authMiddleware')
const {
  createPickup,
  assignVolunteer,
  completePickup,
  getNGOPickups
} = require('../controllers/pickupController')
const prisma = require('../utils/prismaClient')

// NGO creates pickup
router.post('/', protect, restrictTo('ngo'), createPickup)

// NGO sees their pickups
router.get('/my', protect, restrictTo('ngo'), getNGOPickups)

// Volunteer sees their own pickups
router.get('/volunteer/my', protect, restrictTo('volunteer'), async (req, res) => {
  try {
    const volunteerId = req.user.userId
    const pickups = await prisma.pickup.findMany({
      where: { volunteerId },
      include: { item: true },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ pickups })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Volunteer assigns themselves
router.patch('/:id/assign', protect, restrictTo('volunteer'), assignVolunteer)

// Volunteer completes pickup
router.patch('/:id/complete', protect, restrictTo('volunteer'), completePickup)

// Get all pending pickups (no volunteer assigned yet)
router.get('/pending', protect, restrictTo('volunteer'), async (req, res) => {
  try {
    const pickups = await prisma.pickup.findMany({
      where: { 
        volunteerId: null,
        status: 'pending'
      },
      include: { 
        item: true,
        ngo: true
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json({ pickups })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})
module.exports = router