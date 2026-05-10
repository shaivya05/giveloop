const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/authMiddleware')
const { createImpactReport, getImpactReport } = require('../controllers/impactController')

// Generate impact report (volunteer after delivery)
router.post('/', protect, restrictTo('volunteer'), createImpactReport)

// Get impact report for an item (donor can see)
router.get('/:itemId', protect, getImpactReport)

module.exports = router