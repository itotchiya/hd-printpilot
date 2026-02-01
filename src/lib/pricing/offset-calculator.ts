/**
 * Offset Printing Quote Calculator
 * 
 * Calculates quotes for offset printing based on the documented
 * formulas from the Havet/IMB Excel workbook.
 * 
 * Offset printing includes:
 * - Signature/imposition calculation
 * - Make-ready costs
 * - Plate costs
 * - Running costs with waste factor
 * - 7% margin (vs 5% for digital)
 */

import {
  CONSTANTS,
  PAPER_PRICES,
  DEFAULT_PAPER_PRICE,
  OFFSET_SHEET_PRICES,
  OFFSET_MAKE_READY,
  OFFSET_BINDING_COSTS,
  OFFSET_LAMINATION,
  OFFSET_SUPPLEMENTS,
  DIGITAL_BINDING_COSTS,
  DIGITAL_BINDING_SETUP,
  TRANSPORT_ZONES,
  TRANSPORT_COSTS,
  type PaperType,
  type BindingType,
  type OffsetFormat,
  type LaminationOrientation,
  type LaminationFinish,
  type PackagingType,
} from './pricing-data';

import { type QuoteBreakdown } from './digital-calculator';

// =============================================================================
// TYPES
// =============================================================================

export interface OffsetQuoteInput {
  quantity: number;
  formatWidth: number;  // cm
  formatHeight: number; // cm
  rabatWidth?: number;  // cm - for brochures with flaps
  interiorPages: number;
  coverPages: 0 | 2 | 4;
  interiorPaperType: string;
  interiorGrammage: number;
  coverPaperType?: string;
  coverGrammage?: number;
  interiorColors: 'quadrichromie' | 'quadrichromie_vernis' | 'bichromie' | 'noir';
  coverColors?: 'quadrichromie' | 'quadrichromie_vernis' | 'bichromie' | 'noir';
  bindingType: BindingType;
  laminationOrientation: LaminationOrientation;
  laminationFinish?: LaminationFinish;
  productType: 'brochure' | 'flyer_poster' | 'carte_visite' | 'depliant';
  foldType?: string;
  foldCount?: number;
  packagingType: PackagingType;
  deliveries: Array<{
    quantity: number;
    department: string;
    tailLift: boolean;
  }>;
}

interface SignatureInfo {
  pages16: number;
  pages12: number;
  pages8: number;
  pages6: number;
  pages4: number;
  totalSignatures: number;
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Normalize paper type string to enum key
 */
function normalizePaperType(paperType: string): PaperType {
  const normalized = paperType
    .toLowerCase()
    .replace(/é/g, 'e')
    .replace(/\s+/g, '_')
    .replace(/couché mat/i, 'couche_mat')
    .replace(/couché_mat/i, 'couche_mat')
    .replace(/couché satin/i, 'couche_satin')
    .replace(/couché_satin/i, 'couche_satin')
    .replace(/brillant/i, 'brillant')
    .replace(/recyclé/i, 'recycle')
    .replace(/offset/i, 'offset')
    .replace(/bouffant blanc/i, 'bouffant_blanc')
    .replace(/bouffant munken blanc/i, 'bouffant_munken_blanc')
    .replace(/bouffant munken creme/i, 'bouffant_munken_creme')
    .replace(/bouffant munken crème/i, 'bouffant_munken_creme');
  
  if (normalized in PAPER_PRICES) {
    return normalized as PaperType;
  }
  
  return 'autre';
}

/**
 * Get paper price per kg
 */
function getPaperPrice(paperType: string, grammage: number): number {
  const normalized = normalizePaperType(paperType);
  const prices = PAPER_PRICES[normalized];
  
  if (!prices) return DEFAULT_PAPER_PRICE;
  
  if (prices[grammage] !== undefined && prices[grammage] !== null) {
    return prices[grammage] as number;
  }
  
  // Find closest grammage
  const availableGrammages = Object.keys(prices)
    .map(Number)
    .filter(g => prices[g] !== null)
    .sort((a, b) => a - b);
  
  if (availableGrammages.length === 0) return DEFAULT_PAPER_PRICE;
  
  const closest = availableGrammages.reduce((prev, curr) => 
    Math.abs(curr - grammage) < Math.abs(prev - grammage) ? curr : prev
  );
  
  return prices[closest] ?? DEFAULT_PAPER_PRICE;
}

/**
 * Determine optimal offset format based on finished size
 */
function determineOffsetFormat(widthCm: number, heightCm: number): OffsetFormat {
  // Calculate which format wastes least paper
  const formats: OffsetFormat[] = ['64x90', '65x92', '70x102', '72x102'];
  
  // Simple heuristic: use smallest format that fits
  if (widthCm <= 32 && heightCm <= 45) return '64x90';
  if (widthCm <= 32.5 && heightCm <= 46) return '65x92';
  if (widthCm <= 35 && heightCm <= 51) return '70x102';
  return '72x102';
}

/**
 * Calculate signature breakdown for interior pages
 * Offset printing uses signatures (folded sheets)
 */
function calculateSignatures(pages: number): SignatureInfo {
  let remaining = pages;
  const signatures: SignatureInfo = {
    pages16: 0,
    pages12: 0,
    pages8: 0,
    pages6: 0,
    pages4: 0,
    totalSignatures: 0,
  };
  
  // Use 16-page signatures first (most efficient)
  signatures.pages16 = Math.floor(remaining / 16);
  remaining = remaining % 16;
  
  // Then 12-page
  if (remaining >= 12) {
    signatures.pages12 = 1;
    remaining -= 12;
  }
  
  // Then 8-page
  if (remaining >= 8) {
    signatures.pages8 = 1;
    remaining -= 8;
  }
  
  // Then 6-page
  if (remaining >= 6) {
    signatures.pages6 = 1;
    remaining -= 6;
  }
  
  // Finally 4-page
  if (remaining >= 4) {
    signatures.pages4 = Math.ceil(remaining / 4);
  }
  
  signatures.totalSignatures = 
    signatures.pages16 + signatures.pages12 + 
    signatures.pages8 + signatures.pages6 + signatures.pages4;
  
  return signatures;
}

/**
 * Calculate number of printing plates needed
 */
function calculatePlateCount(
  colorMode: string,
  signatures: SignatureInfo,
  hasCover: boolean,
  coverColorMode?: string
): number {
  // Plates per side based on color mode
  const platesPerSide: Record<string, number> = {
    quadrichromie: 4,        // CMYK
    quadrichromie_vernis: 5, // CMYK + Varnish
    bichromie: 2,
    noir: 1,
  };
  
  const interiorPlates = platesPerSide[colorMode] || 4;
  
  // Each signature needs plates for both sides
  const totalInteriorPlates = signatures.totalSignatures * interiorPlates * 2;
  
  // Cover plates
  let coverPlates = 0;
  if (hasCover && coverColorMode) {
    const coverPlatesPerSide = platesPerSide[coverColorMode] || 4;
    coverPlates = coverPlatesPerSide * 2; // Both sides of cover
  }
  
  return totalInteriorPlates + coverPlates;
}

/**
 * Get transport zone from department
 */
function getTransportZone(department: string): 'A' | 'B' | 'C' | 'D' {
  const match = department.match(/^(\d{2})/);
  if (!match) return 'D';
  
  const deptCode = match[1];
  return TRANSPORT_ZONES[deptCode] || 'D';
}

/**
 * Get transport weight bracket
 */
function getWeightBracket(weight: number): string {
  if (weight <= 5) return '0-5';
  if (weight <= 10) return '5-10';
  if (weight <= 20) return '10-20';
  if (weight <= 30) return '20-30';
  if (weight <= 50) return '30-50';
  if (weight <= 100) return '50-100';
  if (weight <= 200) return '100-200';
  if (weight <= 500) return '200-500';
  return '500+';
}

// =============================================================================
// CALCULATION FUNCTIONS
// =============================================================================

/**
 * Calculate weight per copy and total weight
 */
function calculateWeight(input: OffsetQuoteInput): { weightPerCopy: number; totalWeight: number } {
  const area = input.formatWidth * input.formatHeight;
  
  // Interior weight (grams)
  const interiorSheets = input.interiorPages / 2;
  const interiorWeight = (area * interiorSheets * input.interiorGrammage) / CONSTANTS.WEIGHT_DIVISOR;
  
  // Cover weight (grams)
  let coverWeight = 0;
  if (input.coverPages > 0 && input.coverGrammage) {
    const coverSheets = input.coverPages / 2;
    // For covers with rabat (flaps), add extra width
    const coverArea = input.rabatWidth 
      ? (input.formatWidth + input.rabatWidth) * input.formatHeight
      : area;
    coverWeight = (coverArea * coverSheets * input.coverGrammage) / CONSTANTS.WEIGHT_DIVISOR;
  }
  
  const weightPerCopy = (interiorWeight + coverWeight) / 1000;
  const totalWeight = weightPerCopy * input.quantity;
  
  return { weightPerCopy, totalWeight };
}

/**
 * Calculate paper cost for offset (uses sheet format pricing)
 */
function calculatePaperCost(input: OffsetQuoteInput): number {
  const format = determineOffsetFormat(input.formatWidth, input.formatHeight);
  
  // Get sheet price for the grammage
  const sheetPrices = OFFSET_SHEET_PRICES[input.interiorGrammage];
  const sheetPrice = sheetPrices?.[format] ?? 50; // Default if not found
  
  // Calculate number of sheets needed
  const signatures = calculateSignatures(input.interiorPages);
  
  // Each 16-page signature = 1 sheet, 8-page = 0.5 sheet, etc.
  const sheetsNeeded = 
    signatures.pages16 * 1 +
    signatures.pages12 * 0.75 +
    signatures.pages8 * 0.5 +
    signatures.pages6 * 0.375 +
    signatures.pages4 * 0.25;
  
  // Total sheets for entire run (+ 10% waste)
  const totalSheets = Math.ceil(sheetsNeeded * input.quantity * 1.10);
  
  // Calculate cost (price is per 1000 sheets)
  const interiorCost = (totalSheets / 1000) * sheetPrice;
  
  // Cover paper cost
  let coverCost = 0;
  if (input.coverPages > 0 && input.coverGrammage) {
    const coverSheetPrices = OFFSET_SHEET_PRICES[input.coverGrammage];
    const coverSheetPrice = coverSheetPrices?.[format] ?? 60;
    // 1 cover sheet per copy (+ 10% waste)
    const coverSheets = Math.ceil(input.quantity * 1.10);
    coverCost = (coverSheets / 1000) * coverSheetPrice;
  }
  
  return interiorCost + coverCost;
}

/**
 * Calculate make-ready cost (setup cost for offset)
 */
function calculateMakeReadyCost(input: OffsetQuoteInput): number {
  let makeReady = OFFSET_MAKE_READY.interiorBase; // 500€ base
  
  // Apply varnish factor if using varnish
  if (input.interiorColors === 'quadrichromie_vernis') {
    makeReady *= OFFSET_MAKE_READY.varnishFactor; // 0.65
  }
  
  // Add cover make-ready
  if (input.coverPages === 2) {
    makeReady += OFFSET_MAKE_READY.cover2Pages; // 200€
  } else if (input.coverPages === 4) {
    makeReady += OFFSET_MAKE_READY.cover4Pages; // 300€
  }
  
  return makeReady;
}

/**
 * Calculate printing/running cost
 */
function calculatePrintingCost(input: OffsetQuoteInput): number {
  const signatures = calculateSignatures(input.interiorPages);
  const plateCount = calculatePlateCount(
    input.interiorColors,
    signatures,
    input.coverPages > 0,
    input.coverColors
  );
  
  // Plate cost: ~25€ per plate
  const plateCost = plateCount * 25;
  
  // Running cost: ~0.01€ per impression (sheet × colors)
  const colorsPerSide = input.interiorColors === 'noir' ? 1 :
    input.interiorColors === 'bichromie' ? 2 : 4;
  
  const impressions = signatures.totalSignatures * input.quantity * colorsPerSide * 2;
  const runningCost = impressions * 0.01;
  
  return plateCost + runningCost;
}

/**
 * Calculate binding cost for offset
 */
function calculateBindingCost(input: OffsetQuoteInput): number {
  if (input.bindingType === 'rien') return 0;
  
  const signatures = calculateSignatures(input.interiorPages);
  const cahiers = signatures.totalSignatures + (input.coverPages > 0 ? 1 : 0);
  
  // Lookup offset binding costs
  const bindingCosts = OFFSET_BINDING_COSTS[Math.min(cahiers, 6)];
  
  if (bindingCosts) {
    const setup = bindingCosts.setup;
    const running = (input.quantity / 1000) * bindingCosts.running;
    return setup + running;
  }
  
  // Fallback to digital-style calculation
  const pageRange = input.interiorPages <= 72 ? '32-72' : 
    input.interiorPages <= 152 ? '76-152' : '>152';
  
  const qtyBracket = input.quantity <= 50 ? '25-50' :
    input.quantity <= 200 ? '100-200' :
    input.quantity <= 300 ? '200-300' :
    input.quantity <= 400 ? '300-400' :
    input.quantity <= 500 ? '400-500' : '>500';
  
  const bindingType = input.bindingType === 'dos_carre_colle_couture' 
    ? 'dos_carre_colle_pur' 
    : input.bindingType;
  
  const digitalCosts = DIGITAL_BINDING_COSTS[bindingType as keyof typeof DIGITAL_BINDING_COSTS];
  if (!digitalCosts) return 0;
  
  const perUnit = digitalCosts[pageRange]?.[qtyBracket] || 0;
  const setup = DIGITAL_BINDING_SETUP[input.bindingType] || 70;
  
  return (perUnit * input.quantity) + setup;
}

/**
 * Calculate lamination cost for offset
 */
function calculateLaminationCost(input: OffsetQuoteInput): number {
  if (input.laminationOrientation === 'non') return 0;
  
  // Calculate area to laminate
  const area = input.formatWidth * input.formatHeight;
  const areaM2 = area / 10000; // Convert cm² to m²
  
  // Get rate based on orientation
  let rate: number;
  if (input.laminationOrientation === 'recto') {
    rate = OFFSET_LAMINATION.simple;
  } else {
    rate = OFFSET_LAMINATION.simpleRectoVerso;
  }
  
  // Calculate cost
  const laminationCost = areaM2 * input.quantity * rate;
  
  // Add setup
  return laminationCost + OFFSET_LAMINATION.setup;
}

/**
 * Calculate offset supplements (percentage add-ons)
 */
function calculateSupplements(input: OffsetQuoteInput, subtotal: number): number {
  let supplementRate = 0;
  
  // Satin/Mat paper > 115g
  if (input.interiorGrammage > 115) {
    const paperType = normalizePaperType(input.interiorPaperType);
    if (paperType === 'couche_satin') {
      supplementRate += OFFSET_SUPPLEMENTS['satin_115g+'];
    } else if (paperType === 'couche_mat') {
      supplementRate += OFFSET_SUPPLEMENTS['mat_115g+'];
    }
  }
  
  // Light paper < 70g
  if (input.interiorGrammage < 70) {
    supplementRate += OFFSET_SUPPLEMENTS['paper_70g-'];
  }
  
  return subtotal * supplementRate;
}

/**
 * Calculate delivery cost
 */
function calculateDeliveryCost(input: OffsetQuoteInput, weightPerCopy: number): number {
  let totalCost = 0;
  
  for (const delivery of input.deliveries) {
    if (delivery.quantity === 0) continue;
    
    const parcelWeight = weightPerCopy * delivery.quantity;
    const zone = getTransportZone(delivery.department);
    const weightBracket = getWeightBracket(parcelWeight);
    
    const zoneCosts = TRANSPORT_COSTS[zone];
    const transportCost = zoneCosts[weightBracket] || zoneCosts['500+'];
    
    totalCost += transportCost;
    
    if (delivery.tailLift) {
      totalCost += CONSTANTS.TAIL_LIFT_SURCHARGE;
    }
  }
  
  return totalCost;
}

// =============================================================================
// MAIN CALCULATION FUNCTION
// =============================================================================

/**
 * Calculate complete offset quote
 */
export function calculateOffsetQuote(input: OffsetQuoteInput): QuoteBreakdown {
  // 1. Calculate weight
  const { weightPerCopy, totalWeight } = calculateWeight(input);
  
  // 2. Calculate individual cost components
  const paperCost = calculatePaperCost(input);
  const makeReadyCost = calculateMakeReadyCost(input);
  const printingCost = calculatePrintingCost(input) + makeReadyCost;
  const bindingCost = calculateBindingCost(input);
  const laminationCost = calculateLaminationCost(input);
  const foldingCost = 0; // Folding included in binding for offset
  const packagingCost = 0; // Usually included in offset runs
  const deliveryCost = calculateDeliveryCost(input, weightPerCopy);
  
  // 3. Calculate subtotal
  let subtotal = paperCost + printingCost + bindingCost + 
                 laminationCost + foldingCost + packagingCost + deliveryCost;
  
  // 4. Add supplements
  subtotal += calculateSupplements(input, subtotal);
  
  // 5. Apply offset margin (7%)
  const marginRate = CONSTANTS.OFFSET_MARGIN;
  const marginAmount = subtotal * marginRate;
  const totalPrice = subtotal + marginAmount;
  
  // 6. Calculate per-unit price
  const pricePerUnit = totalPrice / input.quantity;
  
  return {
    paperCost: Math.round(paperCost * 100) / 100,
    printingCost: Math.round(printingCost * 100) / 100,
    bindingCost: Math.round(bindingCost * 100) / 100,
    laminationCost: Math.round(laminationCost * 100) / 100,
    foldingCost: Math.round(foldingCost * 100) / 100,
    packagingCost: Math.round(packagingCost * 100) / 100,
    deliveryCost: Math.round(deliveryCost * 100) / 100,
    subtotal: Math.round(subtotal * 100) / 100,
    marginRate,
    marginAmount: Math.round(marginAmount * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    pricePerUnit: Math.round(pricePerUnit * 100) / 100,
    weightPerCopy: Math.round(weightPerCopy * 1000) / 1000,
    totalWeight: Math.round(totalWeight * 100) / 100,
  };
}
