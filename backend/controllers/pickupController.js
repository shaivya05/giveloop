const prisma = require('../utils/prismaClient')

// NGO accepts a donation → creates pickup
const createPickup = async (req, res) => {
  try {
    const { itemId, scheduledTime, notes } = req.body
    const userId = req.user.userId

    // Get NGO profile
    const ngo = await prisma.nGO.findUnique({ where: { userId } })
    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' })
    }

    // Check item exists and is still listed
    const item = await prisma.item.findUnique({ where: { id: itemId } })
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }
    if (item.status !== 'listed') {
      return res.status(400).json({ message: 'Item is no longer available' })
    }

    // Create pickup and update item status in one transaction
    const [pickup] = await prisma.$transaction([
      prisma.pickup.create({
        data: {
          itemId,
          ngoId: ngo.id,
          scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
          notes
        }
      }),
      prisma.item.update({
        where: { id: itemId },
        data: { status: 'matched' }
      })
    ])

    res.status(201).json({
      message: 'Pickup created successfully',
      pickup
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Volunteer assigns themselves to a pickup
const assignVolunteer = async (req, res) => {
  try {
    const { id } = req.params
    const volunteerId = req.user.userId

    const pickup = await prisma.pickup.findUnique({ where: { id } })
    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' })
    }

    if (pickup.volunteerId) {
      return res.status(400).json({ message: 'Volunteer already assigned' })
    }

    const updated = await prisma.pickup.update({
      where: { id },
      data: {
        volunteerId,
        status: 'confirmed'
      }
    })

    await prisma.item.update({
      where: { id: pickup.itemId },
      data: { status: 'pickup_scheduled' }
    })

    res.json({
      message: 'Volunteer assigned successfully',
      pickup: updated
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Volunteer marks pickup as completed
const completePickup = async (req, res) => {
  try {
    const { id } = req.params
    const volunteerId = req.user.userId

    const pickup = await prisma.pickup.findUnique({ where: { id } })

    if (!pickup) {
      return res.status(404).json({ message: 'Pickup not found' })
    }

    if (pickup.volunteerId !== volunteerId) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const [updated] = await prisma.$transaction([
      prisma.pickup.update({
        where: { id },
        data: { status: 'completed' }
      }),
      prisma.item.update({
        where: { id: pickup.itemId },
        data: { status: 'delivered' }
      })
    ])

    res.json({
      message: 'Pickup completed!',
      pickup: updated
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get all pickups for an NGO
const getNGOPickups = async (req, res) => {
  try {
    const userId = req.user.userId
    const ngo = await prisma.nGO.findUnique({ where: { userId } })

    if (!ngo) {
      return res.status(404).json({ message: 'NGO profile not found' })
    }

    const pickups = await prisma.pickup.findMany({
      where: { ngoId: ngo.id },
      include: {
        item: true,
        volunteer: {
          select: { name: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    res.json({ pickups })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { 
  createPickup, 
  assignVolunteer, 
  completePickup,
  getNGOPickups
}