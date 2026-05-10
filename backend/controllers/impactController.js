const prisma = require('../utils/prismaClient')
const { generateImpactReport } = require('../utils/aiHelper')

const createImpactReport = async (req, res) => {
  try {
    const { itemId } = req.body

    // Get item with full details
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: {
        pickup: {
          include: {
            ngo: true,
            volunteer: {
              select: { name: true }
            }
          }
        }
      }
    })

    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }

    if (item.status !== 'delivered') {
      return res.status(400).json({ 
        message: 'Impact report can only be generated after delivery' 
      })
    }

    // Check if report already exists
    const existing = await prisma.impactReport.findUnique({
      where: { itemId }
    })

    if (existing) {
      return res.status(400).json({ 
        message: 'Impact report already exists',
        report: existing
      })
    }

    // Generate report using AI
    const reportText = await generateImpactReport(
      item,
      item.pickup.ngo,
      item.pickup.volunteer
    )

    // Save to database
    const report = await prisma.impactReport.create({
      data: {
        itemId,
        reportText
      }
    })

    res.status(201).json({
      message: 'Impact report generated',
      report
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get impact report for an item
const getImpactReport = async (req, res) => {
  try {
    const { itemId } = req.params

    const report = await prisma.impactReport.findUnique({
      where: { itemId },
      include: {
        item: {
          select: {
            title: true,
            category: true,
            status: true
          }
        }
      }
    })

    if (!report) {
      return res.status(404).json({ message: 'No impact report found' })
    }

    res.json({ report })

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { createImpactReport, getImpactReport }