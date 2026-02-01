import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/dashboard/stats
 * 
 * Calculate KPIs based on saved quotes.
 */
export async function GET() {
  try {
    const totalQuotes = await prisma.quote.count()
    
    const stats = await prisma.quote.aggregate({
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
    })
    
    // Get quotes for current month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const quotesThisMonth = await prisma.quote.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    })
    
    return NextResponse.json({
      success: true,
      stats: {
        totalQuotes,
        totalValue: Number(stats._sum.total || 0),
        averageValue: Number(stats._avg.total || 0),
        quotesThisMonth,
      }
    })
    
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du calcul des statistiques' },
      { status: 500 }
    )
  }
}
