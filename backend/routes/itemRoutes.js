const express = require('express')
const router = express.Router()
const { protect, restrictTo } = require('../middleware/authMiddleware')
const {
  createItem,
  getAllItems,
  getMyItems,
  getItemById,
  deleteItem
} = require('../controllers/itemController')

// Donor creates item
router.post('/', protect, restrictTo('donor'), createItem)

// NGO sees all listed items
router.get('/', protect, restrictTo('ngo'), getAllItems)

// Donor sees their own items
router.get('/my', protect, restrictTo('donor'), getMyItems)

// Anyone authenticated can see single item
router.get('/:id', protect, getItemById)

// Donor deletes their item
router.delete('/:id', protect, restrictTo('donor'), deleteItem)

module.exports = router