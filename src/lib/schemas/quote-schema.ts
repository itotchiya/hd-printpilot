import { z } from 'zod'

// ============================================
// QUOTE WIZARD TYPES
// ============================================

export type PrintMode = 'digital' | 'offset'
export type BindingType = 'rien' | 'dos_carre_colle' | 'dos_carre_colle_pur' | 'dos_carre_colle_couture' | 'piqure'
export type LaminationOrientation = 'recto' | 'recto_verso' | 'non'
export type LaminationFinish = 'mat' | 'brillant' | 'soft_touch'
export type ColorOption = 'quadrichromie' | 'quadrichromie_vernis' | 'bichromie' | 'noir'
export type ProductType = 'brochure' | 'flyer_poster' | 'carte_visite' | 'depliant'
export type FoldType = 'roule' | 'accordeon' | 'croise' | 'rien'
export type PackagingType = 'non' | 'a_lunite' | 'par_paquet' | 'par_2' | 'par_3' | 'par_4' | 'par_5_10'

// Paper types available
export const INTERIOR_PAPER_TYPES = [
  'Couché Mat',
  'Couché Satin',
  'Brillant',
  'Offset',
  'Recyclé',
  'Bouffant Blanc',
  'Bouffant Munken Blanc',
  'Bouffant Munken Crème',
  'Bouffant',
  'Autre',
] as const

export const COVER_PAPER_TYPES = [
  'Couché Mat',
  'Couché Satin',
  'Brillant',
  'Carte 1 face',
  'Offset',
  'Recyclé',
  'Autre',
] as const

// Delivery destination type
export interface DeliveryDestination {
  quantity: number
  department: string
  tailLift: boolean
}

// ============================================
// STEP SCHEMAS (simplified for RHF compatibility)
// ============================================

// Step 1: Print Mode
export const printModeSchema = z.object({
  printMode: z.enum(['digital', 'offset']),
})

// Step 2: Quantity & Format
export const quantityFormatSchema = z.object({
  quantity: z.number().int().min(1, 'Minimum 1 exemplaire'),
  format: z.string().regex(
    /^\d+([.,]\d+)?x\d+([.,]\d+)?$/,
    'Format invalide. Utilisez LARGEURxHAUTEUR (ex: 21x29,7)'
  ),
})

// Step 3: Pages
export const pagesSchema = z.object({
  interiorPages: z.number().int().min(4, 'Minimum 4 pages').refine(
    (val) => val % 4 === 0,
    'Le nombre de pages doit être un multiple de 4'
  ),
  coverPages: z.enum(['0', '2', '4']),
  rabatWidth: z.number().min(0).optional(),
})

// Step 4: Paper Selection
export const paperSchema = z.object({
  interiorPaperType: z.string().min(1, 'Sélectionnez un type de papier'),
  interiorGrammage: z.number().min(1, 'Sélectionnez un grammage'),
  coverPaperType: z.string().optional(),
  coverGrammage: z.number().optional(),
})

// Step 5: Colors
export const colorsSchema = z.object({
  interiorColors: z.enum(['quadrichromie', 'quadrichromie_vernis', 'bichromie', 'noir']),
  coverColors: z.enum(['quadrichromie', 'quadrichromie_vernis', 'bichromie', 'noir']).optional(),
})

// Step 6: Binding & Finishing
export const bindingSchema = z.object({
  bindingType: z.enum(['rien', 'dos_carre_colle', 'dos_carre_colle_pur', 'dos_carre_colle_couture', 'piqure']),
  laminationOrientation: z.enum(['recto', 'recto_verso', 'non']),
  laminationFinish: z.enum(['mat', 'brillant', 'soft_touch']).optional(),
})

// Step 7: Product Options
export const productOptionsSchema = z.object({
  productType: z.enum(['brochure', 'flyer_poster', 'carte_visite', 'depliant']),
  foldType: z.enum(['roule', 'accordeon', 'croise', 'rien']).optional(),
  foldCount: z.number().int().min(1).max(6).optional(),
  secondaryFoldType: z.enum(['croise', 'rien']).optional(),
  packagingType: z.enum(['non', 'a_lunite', 'par_paquet', 'par_2', 'par_3', 'par_4', 'par_5_10']),
})

// Step 8: Delivery
export const deliverySchema = z.object({
  deliveries: z.array(z.object({
    quantity: z.number().int().min(1, 'Minimum 1 exemplaire'),
    department: z.string().min(1, 'Sélectionnez un département'),
    tailLift: z.boolean(),
  })).min(1, 'Ajoutez au moins une destination'),
})

// ============================================
// COMPLETE QUOTE SCHEMA
// ============================================

export const quoteSchema = z.object({
  ...printModeSchema.shape,
  ...quantityFormatSchema.shape,
  ...pagesSchema.shape,
  ...paperSchema.shape,
  ...colorsSchema.shape,
  ...bindingSchema.shape,
  ...productOptionsSchema.shape,
  ...deliverySchema.shape,
})

export type QuoteFormData = z.infer<typeof quoteSchema>

// Input type for React Hook Form (with optional fields for incomplete state)
export type QuoteFormInput = Partial<QuoteFormData> & {
  deliveries?: DeliveryDestination[]
}

// ============================================
// FRENCH LABELS
// ============================================

export const FRENCH_LABELS = {
  printMode: {
    digital: 'Numérique',
    offset: 'Offset',
  },
  
  coverPages: {
    '0': 'Sans couverture',
    '2': '2 pages (Recto)',
    '4': '4 pages (Recto-Verso)',
  },
  
  colors: {
    quadrichromie: 'Quadrichromie',
    quadrichromie_vernis: 'Quadrichromie + Vernis Machine',
    bichromie: 'Bichromie',
    noir: 'Noir',
  },
  
  binding: {
    rien: 'Aucune reliure',
    dos_carre_colle: 'Dos carré collé',
    dos_carre_colle_pur: 'Dos carré collé PUR',
    dos_carre_colle_couture: 'Dos carré collé avec couture',
    piqure: 'Piqûre (agrafes)',
  },
  
  laminationOrientation: {
    recto: 'Recto',
    recto_verso: 'Recto-Verso',
    non: 'Non',
  },
  
  laminationFinish: {
    mat: 'Mat',
    brillant: 'Brillant',
    soft_touch: 'Soft Touch',
  },
  
  productType: {
    brochure: 'Brochure',
    flyer_poster: 'Flyer / Poster',
    carte_visite: 'Carte de visite',
    depliant: 'Dépliant',
  },
  
  foldType: {
    roule: 'Roulé',
    accordeon: 'Accordéon',
    croise: 'Croisé',
    rien: 'Aucun',
  },
  
  packaging: {
    non: 'Non',
    a_lunite: 'À l\'unité',
    par_paquet: 'Par paquet',
    par_2: 'Par 2',
    par_3: 'Par 3',
    par_4: 'Par 4',
    par_5_10: 'Par 5-10',
  },
  
  steps: [
    'Mode d\'impression',
    'Quantité & Format',
    'Pages',
    'Papier',
    'Couleurs',
    'Reliure & Finition',
    'Options Produit',
    'Livraison',
    'Récapitulatif',
  ],
} as const
