import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateQuotePdfBuffer } from '@/lib/pdf/quote-pdf'
import fs from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const logFile = 'pdf-debug.log';
  fs.appendFileSync(logFile, `\n--- NEW REQUEST ${new Date().toISOString()} ---\n`);
  try {
    const { id } = await params;
    fs.appendFileSync(logFile, `Fetching quote ID: ${id}\n`);
    
    // Fetch the quote from DB
    const quote = await prisma.quote.findUnique({
      where: { id },
    })

    if (!quote) {
      fs.appendFileSync(logFile, `Quote not found\n`);
      return NextResponse.json({ error: 'Devis non trouvé' }, { status: 404 })
    }

    fs.appendFileSync(logFile, `Quote found, generating PDF...\n`);

    // Serialize Prisma object to plain JSON to avoid Decimal/Date issues with react-pdf
    const plainQuote = JSON.parse(JSON.stringify(quote));

    // Generate PDF Buffer
    try {
      const pdfBuffer = await generateQuotePdfBuffer(plainQuote)
      fs.appendFileSync(logFile, `PDF generated, size: ${pdfBuffer.length}\n`);

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
      fs.appendFileSync(logFile, `RENDER ERROR: ${renderErr.message}\n${renderErr.stack}\n`);
      throw renderErr;
    }

  } catch (error: any) {
    fs.appendFileSync(logFile, `GENERAL ERROR: ${error.message}\n${error.stack}\n`);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF', details: error.message },
      { status: 500 }
    )
  }
}
