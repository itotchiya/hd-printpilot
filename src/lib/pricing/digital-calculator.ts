/**
 * Digital Printing Quote Calculator
 * 
 * Calculates quotes for digital printing based on the documented
 * formulas from the Havet/IMB Excel workbook.
 */

import {
  CONSTANTS,
  PAPER_PRICES,
  DEFAULT_PAPER_PRICE,
  DIGITAL_PRINT_COSTS,
  DIGITAL_BINDING_COSTS,
  DIGITAL_BINDING_SETUP,
  DIGITAL_LAMINATION_COSTS,
  LAMINATION_FINISH_MULTIPLIERS,
  DIGITAL_FOLDING_COSTS,
  DIGITAL_FOLDING_SETUP,
  PACKAGING_BROCHURE_COSTS,
  PACKAGING_CARD_COSTS,
  TRANSPORT_ZONES,
  TRANSPORT_COSTS,
  type PaperType,
  type BindingType,
  type PageRange,
  type QuantityBracket,
  type LaminationOrientation,
  type LaminationFinish,
  type PackagingType,
} from './pricing-data';

// =============================================================================
// TYPES
// =============================================================================

export interface DigitalQuoteInput {
  quantity: number;
  formatWidth: number;  // cm
  formatHeight: number; // cm
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

export interface QuoteBreakdown {
  paperCost: number;
  printingCost: number;
  bindingCost: number;
  laminationCost: number;
  foldingCost: number;
  packagingCost: number;
  deliveryCost: number;
  subtotal: number;
  marginRate: number;
  marginAmount: number;
  totalPrice: number;
  pricePerUnit: number;
  weightPerCopy: number;
  totalWeight: number;
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
    .replace(/couche_mat/i, 'couche_mat')
    .replace(/couché mat/i, 'couche_mat')
    .replace(/couché_mat/i, 'couche_mat')
    .replace(/couche_satin/i, 'couche_satin')
    .replace(/couché satin/i, 'couche_satin')
    .replace(/couché_satin/i, 'couche_satin')
    .replace(/brillant/i, 'brillant')
    .replace(/recycle/i, 'recycle')
    .replace(/recyclé/i, 'recycle')
    .replace(/offset/i, 'offset')
    .replace(/bouffant blanc/i, 'bouffant_blanc')
    .replace(/bouffant_blanc/i, 'bouffant_blanc')
    .replace(/bouffant munken blanc/i, 'bouffant_munken_blanc')
    .replace(/bouffant_munken_blanc/i, 'bouffant_munken_blanc')
    .replace(/bouffant munken creme/i, 'bouffant_munken_creme')
    .replace(/bouffant_munken_creme/i, 'bouffant_munken_creme')
    .replace(/bouffant munken crème/i, 'bouffant_munken_creme');
  
  // Check if it's a valid paper type
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
  
  // Try exact match first
  if (prices[grammage] !== undefined && prices[grammage] !== null) {
    return prices[grammage] as number;
  }
  
  // Find closest grammage
  const availableGrammages = Object.keys(prices)
    .map(Number)
    .filter(g => prices[g] !== null)
    .sort((a, b) => a - b);
  
  if (availableGrammages.length === 0) return DEFAULT_PAPER_PRICE;
  
  // Find closest grammage
  const closest = availableGrammages.reduce((prev, curr) => 
    Math.abs(curr - grammage) < Math.abs(prev - grammage) ? curr : prev
  );
  
  return prices[closest] ?? DEFAULT_PAPER_PRICE;
}

/**
 * Get page range bracket
 */
function getPageRange(pages: number): PageRange {
  if (pages <= 72) return '32-72';
  if (pages <= 152) return '76-152';
  return '>152';
}

/**
 * Get quantity bracket
 */
function getQuantityBracket(quantity: number): QuantityBracket {
  if (quantity <= 50) return '25-50';
  if (quantity <= 200) return '100-200';
  if (quantity <= 300) return '200-300';
  if (quantity <= 400) return '300-400';
  if (quantity <= 500) return '400-500';
  return '>500';
}

/**
 * Get lamination quantity threshold
 */
function getLaminationThreshold(quantity: number): number {
  if (quantity <= 100) return 100;
  if (quantity <= 300) return 300;
  if (quantity <= 500) return 500;
  if (quantity <= 1000) return 1000;
  return 2500;
}

/**
 * Get folding quantity threshold
 */
function getFoldingThreshold(quantity: number): number {
  if (quantity <= 100) return 100;
  if (quantity <= 250) return 250;
  if (quantity <= 500) return 500;
  if (quantity <= 1000) return 1000;
  return 2000;
}

/**
 * Get packaging quantity threshold
 */
function getPackagingThreshold(quantity: number, isBrochure: boolean): number {
  if (isBrochure) {
    if (quantity <= 100) return 100;
    if (quantity <= 200) return 200;
    if (quantity <= 300) return 300;
    if (quantity <= 400) return 400;
    return 500;
  } else {
    // Business cards
    if (quantity <= 500) return 500;
    if (quantity <= 1000) return 1000;
    if (quantity <= 2000) return 2000;
    if (quantity <= 4000) return 4000;
    return 6000;
  }
}

/**
 * Get transport zone from department
 */
function getTransportZone(department: string): 'A' | 'B' | 'C' | 'D' {
  // Extract department number (first 2 digits or first 2 chars before dash)
  const match = department.match(/^(\d{2})/);
  if (!match) return 'D'; // Default to furthest zone
  
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
function calculateWeight(input: DigitalQuoteInput): { weightPerCopy: number; totalWeight: number } {
  const area = input.formatWidth * input.formatHeight;
  
  // Interior weight (grams) - each page is one side, sheets = pages / 2
  const interiorSheets = input.interiorPages / 2;
  const interiorWeight = (area * interiorSheets * input.interiorGrammage) / CONSTANTS.WEIGHT_DIVISOR;
  
  // Cover weight (grams)
  let coverWeight = 0;
  if (input.coverPages > 0 && input.coverGrammage) {
    const coverSheets = input.coverPages / 2;
    coverWeight = (area * coverSheets * input.coverGrammage) / CONSTANTS.WEIGHT_DIVISOR;
  }
  
  // Convert to kg
  const weightPerCopy = (interiorWeight + coverWeight) / 1000;
  const totalWeight = weightPerCopy * input.quantity;
  
  return { weightPerCopy, totalWeight };
}

/**
 * Calculate paper cost
 */
function calculatePaperCost(input: DigitalQuoteInput, totalWeight: number): number {
  // Get interior paper price
  const interiorPrice = getPaperPrice(input.interiorPaperType, input.interiorGrammage);
  
  // Calculate interior weight
  const area = input.formatWidth * input.formatHeight;
  const interiorSheets = input.interiorPages / 2;
  const interiorWeightKg = (area * interiorSheets * input.interiorGrammage) / CONSTANTS.WEIGHT_DIVISOR / 1000;
  const interiorCost = interiorWeightKg * input.quantity * interiorPrice;
  
  // Calculate cover paper cost if applicable
  let coverCost = 0;
  if (input.coverPages > 0 && input.coverPaperType && input.coverGrammage) {
    const coverPrice = getPaperPrice(input.coverPaperType, input.coverGrammage);
    const coverSheets = input.coverPages / 2;
    const coverWeightKg = (area * coverSheets * input.coverGrammage) / CONSTANTS.WEIGHT_DIVISOR / 1000;
    coverCost = coverWeightKg * input.quantity * coverPrice;
  }
  
  return interiorCost + coverCost;
}

/**
 * Calculate printing cost
 */
function calculatePrintingCost(input: DigitalQuoteInput): number {
  // Get cost per side
  const interiorCostPerSide = DIGITAL_PRINT_COSTS.perSide[input.interiorColors] || 
    DIGITAL_PRINT_COSTS.perSide.quadrichromie;
  
  // Interior: each page is one printed side
  const interiorSides = input.interiorPages;
  const interiorCost = interiorSides * input.quantity * interiorCostPerSide;
  
  // Cover printing
  let coverCost = 0;
  if (input.coverPages > 0 && input.coverColors) {
    const coverCostPerSide = DIGITAL_PRINT_COSTS.perSide[input.coverColors] || 
      DIGITAL_PRINT_COSTS.perSide.quadrichromie;
    const coverSides = input.coverPages;
    coverCost = coverSides * input.quantity * coverCostPerSide;
  }
  
  return interiorCost + coverCost;
}

/**
 * Calculate binding cost
 */
function calculateBindingCost(input: DigitalQuoteInput): number {
  if (input.bindingType === 'rien') return 0;
  if (input.bindingType === 'dos_carre_colle_couture') {
    // Not available in digital, use PUR instead
    return calculateBindingCostInternal('dos_carre_colle_pur', input);
  }
  
  return calculateBindingCostInternal(input.bindingType, input);
}

function calculateBindingCostInternal(
  bindingType: Exclude<BindingType, 'rien' | 'dos_carre_colle_couture'>,
  input: DigitalQuoteInput
): number {
  const pageRange = getPageRange(input.interiorPages);
  const qtyBracket = getQuantityBracket(input.quantity);
  
  // Get per-unit cost from lookup table
  const bindingCosts = DIGITAL_BINDING_COSTS[bindingType];
  if (!bindingCosts) return 0;
  
  const perUnit = bindingCosts[pageRange]?.[qtyBracket] || 0;
  
  // Get setup cost
  let setup = DIGITAL_BINDING_SETUP[bindingType] || 0;
  
  // Saddle stitching: reduced setup for qty > 200
  if (bindingType === 'piqure' && input.quantity > 200) {
    setup = 25;
  }
  
  return (perUnit * input.quantity) + setup;
}

/**
 * Calculate lamination cost
 */
function calculateLaminationCost(input: DigitalQuoteInput): number {
  if (input.laminationOrientation === 'non') return 0;
  
  const threshold = getLaminationThreshold(input.quantity);
  const orientation = input.laminationOrientation;
  
  // Get per-unit cost
  const costs = DIGITAL_LAMINATION_COSTS[orientation];
  if (!costs) return 0;
  
  const perUnit = costs[threshold as keyof typeof costs] || 0.15;
  
  // Apply finish multiplier
  const finishMultiplier = input.laminationFinish 
    ? LAMINATION_FINISH_MULTIPLIERS[input.laminationFinish] 
    : 1.0;
  
  return perUnit * input.quantity * finishMultiplier;
}

/**
 * Calculate folding cost (for dépliants)
 */
function calculateFoldingCost(input: DigitalQuoteInput): number {
  if (input.productType !== 'depliant') return 0;
  if (!input.foldCount || input.foldCount === 0) return 0;
  
  const folds = Math.min(input.foldCount, 4); // Max 4 folds in table
  const threshold = getFoldingThreshold(input.quantity);
  
  const foldCosts = DIGITAL_FOLDING_COSTS[folds];
  if (!foldCosts) return 0;
  
  const perUnit = foldCosts[threshold] || 0.05;
  const setup = DIGITAL_FOLDING_SETUP[folds] || 18;
  
  return (perUnit * input.quantity) + setup;
}

/**
 * Calculate packaging cost
 */
function calculatePackagingCost(input: DigitalQuoteInput): number {
  if (input.packagingType === 'non') return 0;
  
  const isBrochure = input.productType === 'brochure' || input.productType === 'depliant';
  const isCard = input.productType === 'carte_visite';
  
  if (!isBrochure && !isCard) return 0;
  
  const threshold = getPackagingThreshold(input.quantity, isBrochure);
  const costs = isBrochure 
    ? PACKAGING_BROCHURE_COSTS[threshold]
    : PACKAGING_CARD_COSTS[threshold];
  
  if (!costs) return 10; // Minimum fixed cost
  
  return (costs.perUnit * input.quantity) + costs.fixed;
}

/**
 * Calculate delivery cost
 */
function calculateDeliveryCost(input: DigitalQuoteInput, weightPerCopy: number): number {
  let totalCost = 0;
  
  for (const delivery of input.deliveries) {
    if (delivery.quantity === 0) continue;
    
    // Calculate weight for this delivery
    const parcelWeight = weightPerCopy * delivery.quantity;
    
    // Get zone and weight bracket
    const zone = getTransportZone(delivery.department);
    const weightBracket = getWeightBracket(parcelWeight);
    
    // Look up cost
    const zoneCosts = TRANSPORT_COSTS[zone];
    const transportCost = zoneCosts[weightBracket] || zoneCosts['500+'];
    
    totalCost += transportCost;
    
    // Add tail-lift surcharge
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
 * Calculate complete digital quote
 */
export function calculateDigitalQuote(input: DigitalQuoteInput): QuoteBreakdown {
  // 1. Calculate weight
  const { weightPerCopy, totalWeight } = calculateWeight(input);
  
  // 2. Calculate individual cost components
  const paperCost = calculatePaperCost(input, totalWeight);
  const printingCost = calculatePrintingCost(input);
  const bindingCost = calculateBindingCost(input);
  const laminationCost = calculateLaminationCost(input);
  const foldingCost = calculateFoldingCost(input);
  const packagingCost = calculatePackagingCost(input);
  const deliveryCost = calculateDeliveryCost(input, weightPerCopy);
  
  // 3. Calculate subtotal
  const subtotal = paperCost + printingCost + bindingCost + 
                   laminationCost + foldingCost + packagingCost + deliveryCost;
  
  // 4. Apply digital margin (5%)
  const marginRate = CONSTANTS.DIGITAL_MARGIN;
  const marginAmount = subtotal * marginRate;
  const totalPrice = subtotal + marginAmount;
  
  // 5. Calculate per-unit price
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
