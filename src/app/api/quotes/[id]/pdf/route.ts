import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateQuotePdfBuffer } from '@/lib/pdf/quote-pdf'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(`[PDF] Requesting PDF for quote ID: ${id}`);
    
    // Fetch the quote from DB
    const quote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!quote) {
      console.warn(`[PDF] Quote not found: ${id}`);
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    }

    // Serialize Prisma object to plain JSON to avoid Decimal/Date issues with react-pdf
    // Decimal from Prisma (Prisma.Decimal) can cause issues when passed to components
    const plainQuote = JSON.parse(JSON.stringify(quote));

    // Generate PDF Buffer
    try {
      const pdfBuffer = await generateQuotePdfBuffer(plainQuote)
      console.log(`[PDF] Generated buffer for ${id}, size: ${pdfBuffer.length} bytes`);

      // Return the PDF response
      const filename = `Devis_QT-${id.slice(-8).toUpperCase()}.pdf`
      
      return new NextResponse(pdfBuffer as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Cache-Control': 'no-cache',
        },
      })
    } catch (renderErr: any) {
      console.error(`[PDF] Render error:`, renderErr);
      throw renderErr;
    }

  } catch (error: any) {
    console.error(`[PDF] General error in route:`, error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF', details: error.message },
      { status: 500 }
    )
  }
}
