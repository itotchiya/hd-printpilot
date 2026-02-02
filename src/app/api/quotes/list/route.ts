import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * GET /api/quotes/list
 * 
 * Retrieve a list of saved quotes with optional pagination and status filter.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const status = searchParams.get('status') // 'draft', 'completed', or null for all
    
    const whereClause = status ? { status } : {}
    
    const quotes = await prisma.quote.findMany({
      where: whereClause,
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    })
    
    const total = await prisma.quote.count({
      where: whereClause,
    })
    
    return NextResponse.json({
      success: true,
      quotes,
      pagination: {
        total,
        limit,
        offset,
      }
    })
    
  } catch (error) {
    console.error('Error listing quotes:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la récupération des devis' },
      { status: 500 }
    )
  }
}
