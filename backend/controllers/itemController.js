const prisma = require('../utils/prismaClient')
const { categorizeItem, matchNGO } = require('../utils/aiHelper')
// Create a new donation item (donor only)
const createItem = async (req, res) => {
  try {
    const { title, description, category } = req.body
    const donorId = req.user.userId

    const item = await prisma.item.create({
      data: {
        title,
        description,
        category,
        donorId
      }
    })

    res.status(201).json({
      message: 'Item listed successfully',
      item
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all listed items (NGO can see these)
const getAllItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      where: { status: 'listed' },
      include: {
        donor: {
          select: {
            name: true,
            city: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ items })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get donor's own items
const getMyItems = async (req, res) => {
  try {
    const donorId = req.user.userId

    const items = await prisma.item.findMany({
      where: { donorId },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ items })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get single item by id
const getItemById = async (req, res) => {
  try {
    const { id } = req.params

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        donor: {
          select: {
            name: true,
            city: true,
            phone: true
          }
        },
        pickup: true
      }
    })

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    res.json({ item })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete an item (donor only, only if still listed)
const deleteItem = async (req, res) => {
  try {
    const { id } = req.params
    const donorId = req.user.userId

    const item = await prisma.item.findUnique({ where: { id } })

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    if (item.donorId !== donorId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (item.status !== 'listed') {
      return res.status(400).json({ 
        message: 'Cannot delete item that is already in progress' 
      })
    }

    await prisma.item.delete({ where: { id } })

    res.json({ message: 'Item deleted successfully' })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AI categorize item
const aiCategorize = async (req, res) => {
  try {
    const { title, description } = req.body

    const result = await categorizeItem(title, description)

    res.json({
      message: 'AI categorization complete',
      result
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// AI match item to best NGO
const aiMatchNGO = async (req, res) => {
  try {
    const { id } = req.params

    // Get item with donor info
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        donor: {
          select: { city: true }
        }
      }
    })

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    // Get all NGOs
    const ngos = await prisma.nGO.findMany()

    if (ngos.length === 0) {
      return res.status(404).json({ message: 'No NGOs available' })
    }

    // Ask AI to match
    const match = await matchNGO(item, ngos)

    res.json({
      message: 'AI matching complete',
      match
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { 
  createItem, 
  getAllItems, 
  getMyItems, 
  getItemById, 
  deleteItem,
  aiCategorize,
  aiMatchNGO
}