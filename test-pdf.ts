import { generateQuotePdfBuffer } from './src/lib/pdf/quote-pdf';
import fs from 'fs';

const mockQuote = {
  id: 'test-123',
  createdAt: new Date(),
  printMode: 'digital',
  formatWidth: 210,
  formatHeight: 297,
  quantity: 100,
  interiorPages: 32,
  totalWeight: 1.5,
  interiorPaperType: 'Silk',
  interiorGrammage: 135,
  paperCost: 50,
  printingCost: 100,
  bindingCost: 30,
  deliveryCost: 20,
  packagingCost: 5,
  unitPrice: 2.05,
  total: 205
};

async function test() {
  try {
    console.log('Starting PDF generation test...');
    const buffer = await generateQuotePdfBuffer(mockQuote);
    fs.writeFileSync('test-quote.pdf', buffer);
    console.log('PDF generated successfully: test-quote.pdf');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

test();
