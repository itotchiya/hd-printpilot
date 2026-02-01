/**
 * Pricing Data Constants
 * 
 * All values extracted from "Tableau Numérique‑Offset HAVET‑IMB 29‑01‑2026.xlsm"
 * These constants are used by the pricing calculators to compute quotes.
 */

// =============================================================================
// CORE CONSTANTS
// =============================================================================

export const CONSTANTS = {
  /** Weight divisor for converting area × grammage to weight */
  WEIGHT_DIVISOR: 9769,
  
  /** Digital margin (5%) */
  DIGITAL_MARGIN: 0.05,
  
  /** Offset margin (7%) */
  OFFSET_MARGIN: 0.07,
  
  /** Tail-lift surcharge per delivery (€) */
  TAIL_LIFT_SURCHARGE: 60,
} as const;

// =============================================================================
// PAPER PRICES (€/kg)
// =============================================================================

export type PaperType = 
  | 'couche_mat'
  | 'couche_satin'
  | 'brillant'
  | 'recycle'
  | 'offset'
  | 'bouffant_blanc'
  | 'bouffant_munken_blanc'
  | 'bouffant_munken_creme'
  | 'autre';

/**
 * Paper prices by type and grammage (€/kg)
 * null = not available for that grammage
 */
export const PAPER_PRICES: Record<PaperType, Record<number, number | null>> = {
  couche_mat: {
    70: null,
    80: 1.15,
    90: 1.00,
    100: 1.00,
    115: 1.00,
    130: 1.00,
    135: 1.00,
    150: 1.00,
    170: 1.00,
    200: 1.00,
    250: 1.00,
    300: 1.00,
    350: 1.00,
    400: 1.63,
  },
  couche_satin: {
    70: null,
    80: 1.15,
    90: 1.00,
    100: 1.00,
    115: 1.00,
    130: 1.00,
    135: 1.00,
    150: 1.00,
    170: 1.00,
    200: 1.00,
    250: 1.00,
    300: 1.00,
    350: 1.00,
    400: 1.63,
  },
  brillant: {
    70: null,
    80: 1.15,
    90: 1.00,
    100: 1.00,
    115: 1.00,
    130: 1.00,
    135: 1.00,
    150: 1.00,
    170: 1.00,
    200: 1.00,
    250: 1.00,
    300: 1.00,
    350: 1.00,
    400: 1.63,
  },
  recycle: {
    70: 1.40,
    80: 1.40,
    90: 1.40,
    100: 1.50,
    115: 1.50,
    130: 1.405,
    135: 1.50,
  },
  offset: {
    70: 1.16,
    80: 1.15,
    90: 1.15,
    100: 1.25,
    115: 1.25,
    250: 1.50,
  },
  bouffant_blanc: {
    80: 1.60,
    90: 1.60,
  },
  bouffant_munken_blanc: {
    80: 2.40,
    90: 2.40,
  },
  bouffant_munken_creme: {
    80: 2.40,
    90: 2.40,
  },
  autre: {
    // Default fallback price for custom paper
    80: 1.20,
    90: 1.20,
    100: 1.20,
    115: 1.20,
    130: 1.20,
    135: 1.20,
    150: 1.20,
    170: 1.20,
    200: 1.20,
    250: 1.20,
    300: 1.20,
  },
};

/** Default paper price when type/grammage not found */
export const DEFAULT_PAPER_PRICE = 1.00;

// =============================================================================
// DIGITAL PRINTING COSTS
// =============================================================================

export const DIGITAL_PRINT_COSTS = {
  /** Cost per printed side by color type (€) */
  perSide: {
    quadrichromie: 0.045,
    quadrichromie_vernis: 0.055,
    bichromie: 0.035,
    noir: 0.025,
  },
} as const;

// =============================================================================
// BINDING COSTS - DIGITAL
// =============================================================================

export type BindingType = 
  | 'rien'
  | 'dos_carre_colle'
  | 'dos_carre_colle_pur'
  | 'dos_carre_colle_couture'
  | 'piqure';

export type PageRange = '32-72' | '76-152' | '>152';
export type QuantityBracket = '25-50' | '100-200' | '200-300' | '300-400' | '400-500' | '>500';

/**
 * Digital binding per-unit costs (€)
 */
export const DIGITAL_BINDING_COSTS: Record<
  Exclude<BindingType, 'rien' | 'dos_carre_colle_couture'>,
  Record<PageRange, Record<QuantityBracket, number>>
> = {
  dos_carre_colle: {
    '32-72': {
      '25-50': 1.65,
      '100-200': 1.30,
      '200-300': 1.15,
      '300-400': 1.05,
      '400-500': 1.00,
      '>500': 0.90,
    },
    '76-152': {
      '25-50': 1.80,
      '100-200': 1.35,
      '200-300': 1.25,
      '300-400': 1.15,
      '400-500': 1.10,
      '>500': 1.00,
    },
    '>152': {
      '25-50': 1.95,
      '100-200': 1.40,
      '200-300': 1.30,
      '300-400': 1.20,
      '400-500': 1.15,
      '>500': 1.05,
    },
  },
  dos_carre_colle_pur: {
    '32-72': {
      '25-50': 1.75,
      '100-200': 1.50,
      '200-300': 1.35,
      '300-400': 1.25,
      '400-500': 1.15,
      '>500': 1.05,
    },
    '76-152': {
      '25-50': 1.90,
      '100-200': 1.55,
      '200-300': 1.45,
      '300-400': 1.35,
      '400-500': 1.25,
      '>500': 1.15,
    },
    '>152': {
      '25-50': 2.05,
      '100-200': 1.60,
      '200-300': 1.50,
      '300-400': 1.40,
      '400-500': 1.30,
      '>500': 1.20,
    },
  },
  piqure: {
    // Saddle stitching - simplified per-unit (setup varies by quantity)
    '32-72': {
      '25-50': 0.25,
      '100-200': 0.23,
      '200-300': 0.22,
      '300-400': 0.20,
      '400-500': 0.18,
      '>500': 0.15,
    },
    '76-152': {
      '25-50': 0.25,
      '100-200': 0.23,
      '200-300': 0.22,
      '300-400': 0.20,
      '400-500': 0.18,
      '>500': 0.15,
    },
    '>152': {
      // Saddle stitching not available for >152 pages
      '25-50': 0,
      '100-200': 0,
      '200-300': 0,
      '300-400': 0,
      '400-500': 0,
      '>500': 0,
    },
  },
};

/**
 * Digital binding setup costs (€)
 */
export const DIGITAL_BINDING_SETUP: Record<BindingType, number> = {
  rien: 0,
  dos_carre_colle: 70,
  dos_carre_colle_pur: 80,
  dos_carre_colle_couture: 100,
  piqure: 35, // Changes to 25 if qty > 200
};

// =============================================================================
// LAMINATION COSTS - DIGITAL
// =============================================================================

export type LaminationOrientation = 'recto' | 'recto_verso' | 'non';
export type LaminationFinish = 'mat' | 'brillant' | 'soft_touch';

/**
 * Digital lamination per-unit costs by quantity threshold (€)
 */
export const DIGITAL_LAMINATION_COSTS = {
  recto: {
    100: 0.35,
    300: 0.30,
    500: 0.25,
    1000: 0.20,
    2500: 0.15,
  },
  recto_verso: {
    100: 0.55,
    300: 0.45,
    500: 0.40,
    1000: 0.35,
    2500: 0.25,
  },
} as const;

/** Lamination finish multipliers */
export const LAMINATION_FINISH_MULTIPLIERS: Record<LaminationFinish, number> = {
  mat: 1.0,
  brillant: 1.0,
  soft_touch: 1.25, // 25% premium for soft touch
};

// =============================================================================
// FOLDING COSTS - DIGITAL (for Dépliants)
// =============================================================================

/**
 * Folding costs per unit by fold count and quantity (€)
 */
export const DIGITAL_FOLDING_COSTS: Record<number, Record<number, number>> = {
  1: { 100: 0.050, 250: 0.050, 500: 0.040, 1000: 0.009, 2000: 0.007 },
  2: { 100: 0.060, 250: 0.060, 500: 0.048, 1000: 0.0108, 2000: 0.0084 },
  3: { 100: 0.072, 250: 0.072, 500: 0.0576, 1000: 0.01296, 2000: 0.01008 },
  4: { 100: 0.0864, 250: 0.0864, 500: 0.06912, 1000: 0.015552, 2000: 0.012096 },
};

/** Folding setup costs by fold count (€) */
export const DIGITAL_FOLDING_SETUP: Record<number, number> = {
  1: 18,
  2: 26,
  3: 33,
  4: 37,
};

// =============================================================================
// PACKAGING COSTS - DIGITAL
// =============================================================================

export type PackagingType = 
  | 'non' 
  | 'a_lunite' 
  | 'par_paquet' 
  | 'par_2' 
  | 'par_3' 
  | 'par_4' 
  | 'par_5_10';

/**
 * Packaging costs for brochures by quantity (€)
 */
export const PACKAGING_BROCHURE_COSTS: Record<number, { perUnit: number; fixed: number }> = {
  100: { perUnit: 0.07, fixed: 10 },
  200: { perUnit: 0.06, fixed: 10 },
  300: { perUnit: 0.05, fixed: 10 },
  400: { perUnit: 0.04, fixed: 10 },
  500: { perUnit: 0.03, fixed: 10 },
};

/**
 * Packaging costs for business cards by quantity (€)
 */
export const PACKAGING_CARD_COSTS: Record<number, { perUnit: number; fixed: number }> = {
  500: { perUnit: 0.0015, fixed: 10 },
  1000: { perUnit: 0.0010, fixed: 10 },
  2000: { perUnit: 0.0090, fixed: 10 },
  4000: { perUnit: 0.0070, fixed: 10 },
  6000: { perUnit: 0.0050, fixed: 10 },
};

// =============================================================================
// OFFSET PRINTING COSTS
// =============================================================================

export type OffsetFormat = '64x90' | '65x92' | '70x102' | '72x102';

/**
 * Offset sheet format prices per 1000 sheets (€)
 */
export const OFFSET_SHEET_PRICES: Record<number, Record<OffsetFormat, number>> = {
  70: { '64x90': 40.32, '65x92': 41.86, '70x102': 49.98, '72x102': 51.41 },
  80: { '64x90': 46.08, '65x92': 47.80, '70x102': 57.10, '72x102': 58.75 },
  90: { '64x90': 51.84, '65x92': 53.80, '70x102': 64.30, '72x102': 66.10 },
  100: { '64x90': 57.60, '65x92': 59.80, '70x102': 71.40, '72x102': 73.44 },
  110: { '64x90': 63.36, '65x92': 65.78, '70x102': 78.54, '72x102': 80.78 },
  115: { '64x90': 66.24, '65x92': 68.80, '70x102': 82.10, '72x102': 84.45 },
};

/**
 * Offset make-ready costs (€)
 */
export const OFFSET_MAKE_READY = {
  interiorBase: 500,
  varnishFactor: 0.65, // Multiply base by this if varnished
  cover2Pages: 200,
  cover4Pages: 300,
} as const;

/**
 * Offset binding costs by cahiers + cover (€)
 */
export const OFFSET_BINDING_COSTS: Record<number, { setup: number; running: number }> = {
  2: { setup: 215.25, running: 91 },
  3: { setup: 218.40, running: 97 },
  4: { setup: 221.55, running: 109 },
  5: { setup: 224.70, running: 115 },
  6: { setup: 227.85, running: 121 },
};

/**
 * Offset lamination costs (€/m²)
 */
export const OFFSET_LAMINATION = {
  simple: 0.25,
  simpleRectoVerso: 0.30,
  complet: 0.50,
  setup: 55,
} as const;

/**
 * Offset supplements (percentage add-ons)
 */
export const OFFSET_SUPPLEMENTS: Record<string, number> = {
  'satin_115g+': 0.05,   // +5%
  'mat_115g+': 0.15,     // +15%
  '1_signature': 0.05,    // +5%
  '2_signatures': 0.10,   // +10%
  'paper_70g-': 0.20,     // +20%
  'spine_extreme': 0.20,  // +20% for <3mm or >35mm spine
};

// =============================================================================
// DELIVERY / TRANSPORT (Simplified Zone-Based Pricing)
// =============================================================================

/**
 * Transport zones mapped by department prefix
 */
export const TRANSPORT_ZONES: Record<string, 'A' | 'B' | 'C' | 'D'> = {
  // Zone A - Paris region
  '75': 'A', '77': 'A', '78': 'A', '91': 'A', '92': 'A', '93': 'A', '94': 'A', '95': 'A',
  // Zone B - Near regions
  '27': 'B', '28': 'B', '45': 'B', '60': 'B', '76': 'B', '80': 'B', '02': 'B', '10': 'B',
  '51': 'B', '89': 'B', '14': 'B', '50': 'B', '61': 'B',
  // Zone C - Medium distance
  '21': 'C', '25': 'C', '39': 'C', '58': 'C', '70': 'C', '71': 'C', '90': 'C',
  '08': 'C', '52': 'C', '54': 'C', '55': 'C', '57': 'C', '67': 'C', '68': 'C', '88': 'C',
  '18': 'C', '36': 'C', '37': 'C', '41': 'C', '44': 'C', '49': 'C', '53': 'C', '72': 'C', '85': 'C',
  '22': 'C', '29': 'C', '35': 'C', '56': 'C',
  // Zone D - Far distance (all other departments)
};

/**
 * Transport costs by zone and weight bracket (€)
 */
export const TRANSPORT_COSTS: Record<'A' | 'B' | 'C' | 'D', Record<string, number>> = {
  A: {
    '0-5': 15,
    '5-10': 20,
    '10-20': 28,
    '20-30': 35,
    '30-50': 45,
    '50-100': 65,
    '100-200': 95,
    '200-500': 145,
    '500+': 220,
  },
  B: {
    '0-5': 18,
    '5-10': 25,
    '10-20': 35,
    '20-30': 45,
    '30-50': 58,
    '50-100': 85,
    '100-200': 125,
    '200-500': 185,
    '500+': 280,
  },
  C: {
    '0-5': 22,
    '5-10': 32,
    '10-20': 45,
    '20-30': 58,
    '30-50': 75,
    '50-100': 110,
    '100-200': 165,
    '200-500': 245,
    '500+': 380,
  },
  D: {
    '0-5': 28,
    '5-10': 42,
    '10-20': 58,
    '20-30': 75,
    '30-50': 98,
    '50-100': 145,
    '100-200': 220,
    '200-500': 340,
    '500+': 520,
  },
};

// =============================================================================
// VALIDATION CONSTRAINTS
// =============================================================================

export const VALIDATION = {
  /** Pages must be multiple of this */
  PAGE_MULTIPLE: 4,
  
  /** Minimum pages for perfect binding */
  PERFECT_BINDING_MIN_PAGES: 40,
  
  /** Maximum pages for saddle stitching */
  SADDLE_STITCH_MAX_PAGES: 96,
  
  /** Maximum pages for digital printing */
  DIGITAL_MAX_PAGES: 280,
  
  /** Maximum width + rabat constraint (cm) */
  RABAT_MAX_TOTAL: 76,
} as const;
