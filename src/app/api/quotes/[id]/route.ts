import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * DELETE /api/quotes/[id]
 * 
 * Delete a quote (typically a draft) by ID.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Check if quote exists
    const quote = await prisma.quote.findUnique({
      where: { id }
    })
    
    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Devis non trouvé' },
        { status: 404 }
      )
    }
    
    // Delete the quote
    await prisma.quote.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'Devis supprimé avec succès'
    })
    
  } catch (error) {
    console.error('Delete quote error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la suppression du devis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/quotes/[id]
 * 
 * Get a single quote by ID (for loading drafts).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const quote = await prisma.quote.findUnique({
      where: { id }
    })
    
    if (!quote) {
      return NextResponse.json(
        { success: false, error: 'Devis non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      quote
    })
    
  } catch (error) {
    console.error('Get quote error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la récupération du devis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
