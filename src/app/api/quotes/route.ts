import { NextRequest, NextResponse } from 'next/server'
import { quoteSchema } from '@/lib/schemas/quote-schema'
import { prisma } from '@/lib/db'
import { 
  calculateDigitalQuote, 
  calculateOffsetQuote,
  type DigitalQuoteInput,
  type OffsetQuoteInput,
  type QuoteBreakdown
} from '@/lib/pricing'

/**
 * POST /api/quotes
 * 
 * Calculate a print quote based on form data and SAVE it to the database.
 * Uses the complete pricing engine with real values from the Excel workbook.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = quoteSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides',
          details: result.error.flatten()
        },
        { status: 400 }
      )
    }
    
    const data = result.data
    
    // Parse format string to get dimensions
    const formatStr = data.format.replace(',', '.')
    const formatParts = formatStr.split('x')
    const formatWidth = parseFloat(formatParts[0]) || 21
    const formatHeight = parseFloat(formatParts[1]) || 29.7
    
    // Prepare input for calculators
    const quoteInput: DigitalQuoteInput & OffsetQuoteInput = {
      quantity: data.quantity,
      formatWidth,
      formatHeight,
      rabatWidth: data.rabatWidth,
      interiorPages: data.interiorPages,
      coverPages: (parseInt(data.coverPages) || 0) as 0 | 2 | 4,
      interiorPaperType: data.interiorPaperType,
      interiorGrammage: data.interiorGrammage,
      coverPaperType: data.coverPaperType,
      coverGrammage: data.coverGrammage,
      interiorColors: data.interiorColors,
      coverColors: data.coverColors,
      bindingType: data.bindingType,
      laminationOrientation: data.laminationOrientation,
      laminationFinish: data.laminationFinish,
      productType: data.productType,
      foldType: data.foldType,
      foldCount: data.foldCount,
      packagingType: data.packagingType,
      deliveries: data.deliveries.map(d => ({
        quantity: d.quantity,
        department: d.department,
        tailLift: d.tailLift || false,
      })),
    }
    
    // Calculate digital quote
    const digitalBreakdown = calculateDigitalQuote(quoteInput)
    
    // Calculate offset quote for comparison (if qty > 300 or offset selected)
    let offsetBreakdown: QuoteBreakdown | null = null
    if (data.printMode === 'offset' || data.quantity > 300) {
      offsetBreakdown = calculateOffsetQuote(quoteInput)
    }
    
    // Determine which breakdown to use
    const primaryBreakdown = data.printMode === 'digital' ? digitalBreakdown : (offsetBreakdown || digitalBreakdown)
    const effectivePrintMode = (data.printMode === 'offset' || (data.quantity > 300 && offsetBreakdown && offsetBreakdown.totalPrice < digitalBreakdown.totalPrice)) 
      ? 'offset' 
      : 'digital'
    
    // SAVE QUOTE TO DATABASE
    const savedQuote = await prisma.quote.create({
      data: {
        printMode: data.printMode,
        quantity: data.quantity,
        formatWidth: formatWidth,
        formatHeight: formatHeight,
        interiorPages: data.interiorPages,
        coverPages: parseInt(data.coverPages) || 0,
        rabatWidth: data.rabatWidth,
        interiorPaperType: data.interiorPaperType,
        interiorGrammage: data.interiorGrammage,
        coverPaperType: data.coverPaperType,
        coverGrammage: data.coverGrammage,
        interiorColors: data.interiorColors,
        coverColors: data.coverColors,
        bindingType: data.bindingType,
        laminationOrientation: data.laminationOrientation,
        laminationFinish: data.laminationFinish,
        productType: data.productType,
        foldType: data.foldType,
        foldCount: data.foldCount,
        packagingType: data.packagingType || "non",
        deliveries: data.deliveries as any,
        
        weightPerCopy: primaryBreakdown.weightPerCopy,
        totalWeight: primaryBreakdown.totalWeight,
        paperCost: primaryBreakdown.paperCost,
        printingCost: primaryBreakdown.printingCost,
        bindingCost: primaryBreakdown.bindingCost,
        laminationCost: primaryBreakdown.laminationCost,
        packagingCost: primaryBreakdown.packagingCost,
        deliveryCost: primaryBreakdown.deliveryCost,
        subtotal: primaryBreakdown.subtotal,
        marginPercent: primaryBreakdown.marginRate,
        marginAmount: primaryBreakdown.marginAmount,
        total: primaryBreakdown.totalPrice,
        unitPrice: primaryBreakdown.pricePerUnit,
      }
    });
    
    // Determine recommended mode (most economical)
    const recommendedMode = offsetBreakdown && offsetBreakdown.totalPrice < digitalBreakdown.totalPrice 
      ? 'offset' 
      : 'digital'
    
    // Calculate savings if applicable
    const savings = offsetBreakdown 
      ? Math.round((digitalBreakdown.totalPrice - offsetBreakdown.totalPrice) * 100) / 100
      : 0
    
    // Build response
    const response = {
      success: true,
      quote: {
        id: savedQuote.id,
        // Main results
        totalPrice: primaryBreakdown.totalPrice,
        pricePerUnit: primaryBreakdown.pricePerUnit,
        recommendedMode,
        selectedMode: data.printMode,
        
        // Weight information
        weightPerCopy: primaryBreakdown.weightPerCopy,
        totalWeight: primaryBreakdown.totalWeight,
        
        // Comparison (for qty > 300)
        comparison: data.quantity > 300 && offsetBreakdown ? {
          digital: {
            totalPrice: digitalBreakdown.totalPrice,
            pricePerUnit: digitalBreakdown.pricePerUnit,
            marginRate: '5%',
          },
          offset: {
            totalPrice: offsetBreakdown.totalPrice,
            pricePerUnit: offsetBreakdown.pricePerUnit,
            marginRate: '7%',
          },
          savings: savings > 0 ? savings : 0,
          mostEconomical: recommendedMode,
        } : null,
        
        // Full breakdown
        breakdown: {
          paperCost: primaryBreakdown.paperCost,
          printingCost: primaryBreakdown.printingCost,
          bindingCost: primaryBreakdown.bindingCost,
          laminationCost: primaryBreakdown.laminationCost,
          foldingCost: primaryBreakdown.foldingCost,
          packagingCost: primaryBreakdown.packagingCost,
          deliveryCost: primaryBreakdown.deliveryCost,
          subtotal: primaryBreakdown.subtotal,
          marginRate: data.printMode === 'digital' ? '5%' : '7%',
          marginAmount: primaryBreakdown.marginAmount,
        },
        
        // Meta
        quantity: data.quantity,
        format: data.format,
        interiorPages: data.interiorPages,
        coverPages: data.coverPages,
        printMode: data.printMode,
        bindingType: data.bindingType,
        createdAt: savedQuote.createdAt,
      }
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Quote calculation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur lors du calcul du devis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
