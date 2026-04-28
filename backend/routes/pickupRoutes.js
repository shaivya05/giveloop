const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/authMiddleware')
const {
  createPickup,
  assignVolunteer,
  completePickup,
  getNGOPickups
} = require('../controllers/pickupController')

// NGO creates pickup
router.post('/', protect, restrictTo('ngo'), createPickup)

// NGO sees their pickups
router.get('/my', protect, restrictTo('ngo'), getNGOPickups)

// Volunteer assigns themselves
router.patch('/:id/assign', protect, restrictTo('volunteer'), assignVolunteer)

// Volunteer completes pickup
router.patch('/:id/complete', protect, restrictTo('volunteer'), completePickup)

module.exports = router