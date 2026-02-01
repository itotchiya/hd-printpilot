import { renderToBuffer } from '@react-pdf/renderer';
import { QuotePDFTemplate } from '@/components/pdf/QuotePDFTemplate';
import React from 'react';

export async function generateQuotePdfBuffer(quote: any) {
  try {
    // Generate the PDF buffer
    // Using JSX directly since we are in a .tsx file
    const buffer = await renderToBuffer(<QuotePDFTemplate quote={quote} />);
    
    return buffer;
  } catch (error) {
    console.error('Error generating PDF buffer:', error);
    throw error;
  }
}
