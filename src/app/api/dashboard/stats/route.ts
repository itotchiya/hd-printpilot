import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

/**
 * GET /api/dashboard/stats
 * 
 * Calculate KPIs based on saved quotes.
 * EXCLUDES drafts from all calculations.
 */
export async function GET() {
  try {
    // Only count completed quotes for KPIs
    const completedFilter: Prisma.QuoteWhereInput = { status: 'completed' }
    
    const totalQuotes = await prisma.quote.count({
      where: completedFilter,
    })
    
    const stats = await prisma.quote.aggregate({
      where: completedFilter,
      _sum: {
        total: true,
      },
      _avg: {
        total: true,
      },
    })
    
    // Get quotes for current month (excluding drafts)
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const quotesThisMonth = await prisma.quote.count({
      where: {
        ...completedFilter,
        createdAt: {
          gte: startOfMonth,
        },
      },
    })
    
    // Count drafts separately for display
    const totalDrafts = await prisma.quote.count({
      where: { status: 'draft' },
    })
    
    return NextResponse.json({
      success: true,
      stats: {
        totalQuotes,
        totalValue: Number(stats._sum.total || 0),
        averageValue: Number(stats._avg.total || 0),
        quotesThisMonth,
        totalDrafts,
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
