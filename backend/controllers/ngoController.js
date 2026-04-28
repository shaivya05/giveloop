const prisma = require('../utils/prismaClient')

// Create NGO profile
const createNGOProfile = async (req, res) => {
  try {
    const { orgName, description, location, acceptedCategories } = req.body
    const userId = req.user.userId

    // Check if profile already exists
    const existing = await prisma.nGO.findUnique({ where: { userId } })
    if (existing) {
      return res.status(400).json({ message: 'NGO profile already exists' })
    }

    const ngo = await prisma.nGO.create({
      data: {
        orgName,
        description,
        location,
        acceptedCategories,
        userId
      }
    })

    res.status(201).json({
      message: 'NGO profile created',
      ngo
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get NGO profile
const getNGOProfile = async (req, res) => {
  try {
    const userId = req.user.userId

    const ngo = await prisma.nGO.findUnique({
      where: { userId },
      include: {
        user: {
          select: { name: true, email: true, phone: true }
        }
      }
    })

    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' })
    }

    res.json({ ngo })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all verified NGOs (for AI matching)
const getAllNGOs = async (req, res) => {
  try {
    const ngos = await prisma.nGO.findMany({
      include: {
        user: {
          select: { name: true, city: true }
        }
      }
    })

    res.json({ ngos })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createNGOProfile, getNGOProfile, getAllNGOs }