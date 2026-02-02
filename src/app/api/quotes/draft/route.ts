import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

/**
 * POST /api/quotes/draft
 * 
 * Save partial quote data as a draft. 
 * If `id` is provided in the body, updates the existing draft.
 * Otherwise, creates a new draft.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Parse format if provided
    let formatWidth = 21
    let formatHeight = 29.7
    if (body.format) {
      const formatStr = body.format.replace(',', '.')
      const formatParts = formatStr.split('x')
      formatWidth = parseFloat(formatParts[0]) || 21
      formatHeight = parseFloat(formatParts[1]) || 29.7
    }
    
    const draftData = {
      status: 'draft',
      printMode: body.printMode || 'digital',
      quantity: body.quantity || 1,
      formatWidth: formatWidth,
      formatHeight: formatHeight,
      interiorPages: body.interiorPages || 0,
      coverPages: parseInt(body.coverPages) || 0,
      rabatWidth: body.rabatWidth || null,
      interiorPaperType: body.interiorPaperType || '',
      interiorGrammage: body.interiorGrammage || 0,
      coverPaperType: body.coverPaperType || null,
      coverGrammage: body.coverGrammage || null,
      interiorColors: body.interiorColors || '',
      coverColors: body.coverColors || null,
      bindingType: body.bindingType || 'rien',
      laminationOrientation: body.laminationOrientation || null,
      laminationFinish: body.laminationFinish || null,
      productType: body.productType || null,
      foldType: body.foldType || null,
      foldCount: body.foldCount || null,
      packagingType: body.packagingType || null,
      deliveries: body.deliveries || [],
      currentStep: body.currentStep || 1, // Track which step user was on
      // Default calculated values for drafts
      weightPerCopy: 0,
      totalWeight: 0,
      paperCost: 0,
      printingCost: 0,
      bindingCost: 0,
      laminationCost: 0,
      packagingCost: 0,
      deliveryCost: 0,
      subtotal: 0,
      marginPercent: 0,
      marginAmount: 0,
      total: 0,
      unitPrice: 0,
    }
    
    let savedDraft;
    
    // If id is provided, update existing draft; otherwise create new
    if (body.id) {
      savedDraft = await prisma.quote.update({
        where: { id: body.id },
        data: draftData,
      })
    } else {
      savedDraft = await prisma.quote.create({
        data: draftData,
      })
    }
    
    return NextResponse.json({
      success: true,
      draft: {
        id: savedDraft.id,
        createdAt: savedDraft.createdAt,
      }
    })
    
  } catch (error) {
    console.error('Draft save error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors de la sauvegarde du brouillon',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
