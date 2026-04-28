const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/authMiddleware')
const { 
  createNGOProfile, 
  getNGOProfile,
  getAllNGOs
} = require('../controllers/ngoController')

router.post('/profile', protect, restrictTo('ngo'), createNGOProfile)
router.get('/profile', protect, restrictTo('ngo'), getNGOProfile)
router.get('/', protect, getAllNGOs)

module.exports = router