# HD-PrintPilot - Complete Pricing Engine Documentation

> **Purpose**: This document provides complete, implementable specifications for the quote calculation engine. All formulas, conditions, and values are documented for developers to implement the pricing logic.

---

## Table of Contents

1. [Core Constants](#1-core-constants)
2. [Weight Calculation](#2-weight-calculation)
3. [Paper Costs](#3-paper-costs)
4. [Digital Printing Costs](#4-digital-printing-costs)
5. [Offset Printing Costs](#5-offset-printing-costs)
6. [Binding Costs](#6-binding-costs)
7. [Lamination Costs](#7-lamination-costs)
8. [Folding Costs](#8-folding-costs)
9. [Packaging Costs](#9-packaging-costs)
10. [Delivery Costs](#10-delivery-costs)
11. [Final Price Calculation](#11-final-price-calculation)
12. [Implementation Example](#12-implementation-example)

---

## 1. Core Constants

```typescript
const CONSTANTS = {
  // Weight calculation divisor (cm²/kg conversion)
  WEIGHT_DIVISOR: 9769,

  // Margins applied to subtotal
  DIGITAL_MARGIN: 0.05, // 5% → multiply by 1.05
  OFFSET_MARGIN: 0.07, // 7% → multiply by 1.07

  // Delivery surcharge
  TAIL_LIFT_SURCHARGE: 60, // € per delivery with tail-lift
};
```

---

## 2. Weight Calculation

### Formula

```
weight_per_copy (kg) =
  (interior_weight + cover_weight) / 1000

interior_weight (g) =
  (width_cm × height_cm) × (interior_pages / 2) × interior_grammage / WEIGHT_DIVISOR

cover_weight (g) =
  (width_cm × height_cm) × (cover_pages / 2) × cover_grammage / WEIGHT_DIVISOR

total_weight (kg) = weight_per_copy × quantity
```

### TypeScript Implementation

```typescript
function calculateWeight(input: {
  widthCm: number;
  heightCm: number;
  interiorPages: number;
  interiorGrammage: number;
  coverPages: number; // 0, 2, or 4
  coverGrammage?: number;
  quantity: number;
}): { weightPerCopy: number; totalWeight: number } {
  const area = input.widthCm * input.heightCm;

  // Interior weight (grams)
  const interiorSheets = input.interiorPages / 2;
  const interiorWeight =
    (area * interiorSheets * input.interiorGrammage) / 9769;

  // Cover weight (grams)
  let coverWeight = 0;
  if (input.coverPages > 0 && input.coverGrammage) {
    const coverSheets = input.coverPages / 2;
    coverWeight = (area * coverSheets * input.coverGrammage) / 9769;
  }

  const weightPerCopy = (interiorWeight + coverWeight) / 1000; // Convert to kg
  const totalWeight = weightPerCopy * input.quantity;

  return { weightPerCopy, totalWeight };
}
```

---

## 3. Paper Costs

### 3.1 Interior Paper Prices (€/kg)

| Grammage | Couché Mat | Couché Satin | Brillant | Recyclé | Offset | Bouffant Amber | Munken Blanc | Munken Crème |
| -------: | ---------: | -----------: | -------: | ------: | -----: | -------------: | -----------: | -----------: |
|       70 |          – |            – |        – |    1.40 |   1.16 |              – |            – |            – |
|       80 |       1.15 |         1.15 |     1.15 |    1.40 |   1.15 |           1.60 |         2.40 |         2.40 |
|       90 |       1.00 |         1.00 |     1.00 |    1.40 |   1.15 |           1.60 |         2.40 |         2.40 |
|      100 |       1.00 |         1.00 |     1.00 |    1.50 |   1.25 |              – |            – |            – |
|      115 |       1.00 |         1.00 |     1.00 |    1.50 |   1.25 |              – |            – |            – |
|      130 |       1.00 |         1.00 |     1.00 |   1.405 |      – |              – |            – |            – |
|      135 |       1.00 |         1.00 |     1.00 |    1.50 |      – |              – |            – |            – |
|      150 |       1.00 |         1.00 |     1.00 |       – |      – |              – |            – |            – |
|      170 |       1.00 |         1.00 |     1.00 |       – |      – |              – |            – |            – |
|      200 |       1.00 |         1.00 |     1.00 |       – |      – |              – |            – |            – |
|      250 |       1.00 |         1.00 |     1.00 |       – |   1.50 |              – |            – |            – |
|      300 |       1.00 |         1.00 |     1.00 |       – |      – |              – |            – |            – |
|      350 |       1.00 |         1.00 |     1.00 |       – |      – |              – |            – |            – |
|      400 |       1.63 |         1.63 |     1.63 |       – |      – |              – |            – |            – |

> **Note**: `–` means not available for that grammage.

### 3.2 Paper Cost Formula

```typescript
function calculatePaperCost(
  paperType: string,
  grammage: number,
  weightKg: number,
): number {
  const pricePerKg = PAPER_PRICES[paperType]?.[grammage] ?? 1.0;
  return weightKg * pricePerKg;
}
```

---

## 4. Digital Printing Costs

### 4.1 Print Cost per Side

| Color Mode    | Cost per Side (€) |
| ------------- | ----------------: |
| Quadrichromie |             0.045 |
| Noir (B&W)    |             0.025 |

### 4.2 Digital Printing Formula

```typescript
function calculateDigitalPrintCost(input: {
  interiorPages: number;
  interiorColors: "quadrichromie" | "noir";
  coverPages: number;
  coverColors?: "quadrichromie" | "noir";
  quantity: number;
}): number {
  const COST_QUADRI = 0.045;
  const COST_MONO = 0.025;

  // Interior: each page = 1 side
  const interiorSides = input.interiorPages;
  const interiorCost =
    interiorSides *
    input.quantity *
    (input.interiorColors === "noir" ? COST_MONO : COST_QUADRI);

  // Cover: if present
  let coverCost = 0;
  if (input.coverPages > 0) {
    const coverSides = input.coverPages;
    coverCost =
      coverSides *
      input.quantity *
      (input.coverColors === "noir" ? COST_MONO : COST_QUADRI);
  }

  return interiorCost + coverCost;
}
```

---

## 5. Offset Printing Costs

### 5.1 Offset Sheet Format Prices (€/1000 sheets)

| Grammage | 64×90 | 65×92 | 70×102 | 72×102 |
| -------: | ----: | ----: | -----: | -----: |
|       70 | 40.32 | 41.86 |  49.98 |  51.41 |
|       80 | 46.08 | 47.80 |  57.10 |  58.75 |
|       90 | 51.84 | 53.80 |  64.30 |  66.10 |
|      100 | 57.60 | 59.80 |  71.40 |  73.44 |
|      110 | 63.36 | 65.78 |  78.54 |  80.78 |
|      115 | 66.24 | 68.80 |  82.10 |  84.45 |

### 5.2 Make-Ready Costs

| Component                |                                  Cost (€) |
| ------------------------ | ----------------------------------------: |
| Interior base make-ready |                                       500 |
| Varnish reduction factor | 0.65 (multiply base by this if varnished) |
| 2-page cover make-ready  |                                       200 |
| 4-page cover make-ready  |                                       300 |

### 5.3 Offset Supplements (% add-ons)

| Condition             | Add-on |
| --------------------- | -----: |
| Satin paper >115g     |    +5% |
| Mat paper >115g       |   +15% |
| 1 signature inserted  |    +5% |
| 2 signatures inserted |   +10% |
| Interior paper <70g   |   +20% |
| Spine <3mm or >35mm   |   +20% |

---

## 6. Binding Costs

### 6.1 Perfect Binding - "Dos carré collé" (Digital)

**Per-unit costs (€):**

| Page Range        | 25-50 | 100-200 | 200-300 | 300-400 | 400-500 | >500 |
| ----------------- | ----: | ------: | ------: | ------: | ------: | ---: |
| 32-72 pages       |  1.65 |    1.30 |    1.15 |    1.05 |    1.00 | 0.90 |
| 76-152 pages      |  1.80 |    1.35 |    1.25 |    1.15 |    1.10 | 1.00 |
| >152 pages (≤280) |  1.95 |    1.40 |    1.30 |    1.20 |    1.15 | 1.05 |

**Setup cost (Calage):** 70 €

### 6.2 Perfect Binding PUR - "Dos carré collé PUR" (Digital)

**Per-unit costs (€):**

| Page Range   | 25-50 | 100-200 | 200-300 | 300-400 | 400-500 | >500 |
| ------------ | ----: | ------: | ------: | ------: | ------: | ---: |
| 32-72 pages  |  1.75 |    1.50 |    1.35 |    1.25 |    1.15 | 1.05 |
| 76-152 pages |  1.90 |    1.55 |    1.45 |    1.35 |    1.25 | 1.15 |
| >152 pages   |  2.05 |    1.60 |    1.50 |    1.40 |    1.30 | 1.20 |

**Setup cost (Calage):** 80 €

### 6.3 Saddle Stitching - "Piqûre" (Digital)

| Quantity | Setup Cost (€) |
| -------- | -------------: |
| <200     |             35 |
| ≥200     |             25 |

**Conditions:**

- Maximum 96 pages for saddle stitching
- Pages must be multiple of 4

### 6.4 Offset Binding - "Dos carré collé"

| Cahiers + CV | Setup (€) | Running/1000 (€) |
| -----------: | --------: | ---------------: |
|            2 |    215.25 |               91 |
|            3 |    218.40 |               97 |
|            4 |    221.55 |              109 |

### 6.5 Binding Cost Formula

```typescript
function calculateBindingCost(input: {
  bindingType: "rien" | "dos_carre_colle" | "dos_carre_colle_pur" | "piqure";
  pages: number;
  quantity: number;
  printMode: "digital" | "offset";
}): number {
  if (input.bindingType === "rien") return 0;

  // Determine page range bracket
  let pageRange: "32-72" | "76-152" | ">152";
  if (input.pages <= 72) pageRange = "32-72";
  else if (input.pages <= 152) pageRange = "76-152";
  else pageRange = ">152";

  // Determine quantity bracket
  let qtyBracket: string;
  if (input.quantity <= 50) qtyBracket = "25-50";
  else if (input.quantity <= 200) qtyBracket = "100-200";
  else if (input.quantity <= 300) qtyBracket = "200-300";
  else if (input.quantity <= 400) qtyBracket = "300-400";
  else if (input.quantity <= 500) qtyBracket = "400-500";
  else qtyBracket = ">500";

  // Lookup per-unit cost and setup
  const perUnit = BINDING_COSTS[input.bindingType][pageRange][qtyBracket];
  const setup = BINDING_SETUP[input.bindingType];

  return perUnit * input.quantity + setup;
}
```

---

## 7. Lamination Costs

### 7.1 Digital Lamination

Quantity thresholds: ≤100, ≤300, ≤500, ≤1000, ≤2500

| Type                    | ≤100 | ≤300 | ≤500 | ≤1000 | ≤2500 |
| ----------------------- | ---: | ---: | ---: | ----: | ----: |
| Single-sided (per unit) | 0.35 | 0.30 | 0.25 |  0.20 |  0.15 |
| Double-sided (per unit) | 0.55 | 0.45 | 0.40 |  0.35 |  0.25 |

### 7.2 Offset Lamination (€/m²)

| Type                           | Price |
| ------------------------------ | ----: |
| Pelliculage Simple (single)    |  0.25 |
| Pelliculage Simple Recto/Verso |  0.30 |
| Pelliculage Complet            |  0.50 |

**Setup:** 55-60 €

**Format adjustments:**

- Format < 50×70: 170 €/1000 m², 90 €/1000 sheets
- Format > 50×70: 130 €/1000 m², 115 €/1000 sheets

---

## 8. Folding Costs (Dépliant)

### Digital Folding (per unit €)

| Folds |    100 |    250 |     500 |     1000 |     2000 | Setup |
| ----: | -----: | -----: | ------: | -------: | -------: | ----: |
|     1 |  0.050 |  0.050 |   0.040 |    0.009 |    0.007 |    18 |
|     2 |  0.060 |  0.060 |   0.048 |   0.0108 |   0.0084 |    26 |
|     3 |  0.072 |  0.072 |  0.0576 |  0.01296 |  0.01008 |    33 |
|     4 | 0.0864 | 0.0864 | 0.06912 | 0.015552 | 0.012096 |    37 |

---

## 9. Packaging Costs

### Cutting/Packaging - Brochures (Digital)

| Quantity | Per Unit (€) | Fixed (€) |
| -------: | -----------: | --------: |
|      100 |         0.07 |        10 |
|      200 |         0.06 |        10 |
|      300 |         0.05 |        10 |
|      400 |         0.04 |        10 |
|     500+ |         0.03 |        10 |

### Cutting/Packaging - Business Cards

| Quantity | Per Unit (€) | Fixed (€) |
| -------: | -----------: | --------: |
|      500 |       0.0015 |        10 |
|     1000 |       0.0010 |        10 |
|     2000 |       0.0090 |        10 |
|     4000 |       0.0070 |        10 |
|    6000+ |       0.0050 |        10 |

---

## 10. Delivery Costs

### 10.1 Transport Matrix Structure

The transport cost is determined by:

1. **Department** (e.g., "75 - Paris", "69 - Rhône")
2. **Weight bracket** (0-1kg, 1-2kg, 2-5kg, 5-10kg, etc.)

### 10.2 Delivery Cost Formula

```typescript
function calculateDeliveryCost(input: {
  deliveries: Array<{
    quantity: number;
    department: string;
    tailLift: boolean;
  }>;
  weightPerCopy: number;
}): number {
  let totalCost = 0;

  for (const delivery of input.deliveries) {
    const parcelWeight = input.weightPerCopy * delivery.quantity;

    // Find weight bracket and department rate
    const transportRate = lookupTransportRate(
      delivery.department,
      parcelWeight,
    );

    totalCost += transportRate;

    // Add tail-lift surcharge if required
    if (delivery.tailLift) {
      totalCost += 60; // €60 surcharge
    }
  }

  return totalCost;
}
```

---

## 11. Final Price Calculation

### 11.1 Digital Quote Formula

```typescript
function calculateDigitalQuote(input: QuoteInput): QuoteResult {
  // 1. Calculate weight
  const { weightPerCopy, totalWeight } = calculateWeight(input);

  // 2. Calculate paper cost
  const paperCost = calculatePaperCost(
    input.interiorPaperType,
    input.interiorGrammage,
    totalWeight,
  );

  // 3. Calculate printing cost
  const printingCost = calculateDigitalPrintCost(input);

  // 4. Calculate binding cost
  const bindingCost = calculateBindingCost(input);

  // 5. Calculate lamination cost
  const laminationCost = calculateLaminationCost(input);

  // 6. Calculate packaging cost
  const packagingCost = calculatePackagingCost(input);

  // 7. Calculate delivery cost
  const deliveryCost = calculateDeliveryCost(input);

  // 8. Calculate subtotal
  const subtotal =
    paperCost +
    printingCost +
    bindingCost +
    laminationCost +
    packagingCost +
    deliveryCost;

  // 9. Apply 5% margin
  const margin = subtotal * 0.05;
  const totalPrice = subtotal * 1.05;

  // 10. Per-unit price
  const pricePerUnit = totalPrice / input.quantity;

  return {
    paperCost,
    printingCost,
    bindingCost,
    laminationCost,
    packagingCost,
    deliveryCost,
    subtotal,
    margin,
    totalPrice,
    pricePerUnit,
    weightPerCopy,
    totalWeight,
  };
}
```

### 11.2 Offset Quote Formula

```typescript
function calculateOffsetQuote(input: QuoteInput): QuoteResult {
  // Same structure as digital, but:
  // - Use offset paper prices (by format)
  // - Add make-ready costs (500€ base)
  // - Calculate plate costs
  // - Apply 7% margin instead of 5%

  const subtotal = /* ... calculated costs ... */;
  const totalPrice = subtotal * 1.07;  // 7% margin

  return { /* ... */ };
}
```

---

## 12. Implementation Example

### Complete Calculation Flow

```typescript
// Example: 500 copies of a 64-page brochure, A4, Couché Mat 115g
const exampleQuote = {
  printMode: "digital",
  quantity: 500,
  format: "21x29.7", // A4 in cm
  interiorPages: 64,
  coverPages: 4,
  interiorPaperType: "Couché Mat",
  interiorGrammage: 115,
  coverPaperType: "Couché Mat",
  coverGrammage: 250,
  interiorColors: "quadrichromie",
  coverColors: "quadrichromie",
  bindingType: "dos_carre_colle",
  laminationOrientation: "recto",
  laminationFinish: "mat",
  packagingType: "non",
  deliveries: [{ quantity: 500, department: "75 - Paris", tailLift: false }],
};

// Step-by-step calculation:
// 1. Weight: (21 × 29.7 × 32 × 115) / 9769 / 1000 = ~2.35 kg/copy
// 2. Paper: 2.35 × 500 × 1.00 = ~1175 €
// 3. Print: 64 sides × 500 × 0.045 = ~1440 €
// 4. Binding: 1.00 × 500 + 70 = ~570 €
// 5. Lamination: 0.25 × 500 = ~125 €
// 6. Delivery: ~150 € (based on weight bracket)
// 7. Subtotal: ~3460 €
// 8. + 5% margin: ~3633 €
// 9. Per unit: ~7.27 €
```

---

## Validation Rules Summary

| Rule                      | Condition                                                 |
| ------------------------- | --------------------------------------------------------- |
| Pages multiple of 4       | `interiorPages % 4 === 0`                                 |
| Perfect binding minimum   | `interiorPages >= 40` for dos carré collé                 |
| Saddle stitch maximum     | `interiorPages <= 96` for piqûre                          |
| Digital max pages         | `interiorPages <= 280`                                    |
| Format validation         | Match pattern `^[0-9]+([.,][0-9]+)?x[0-9]+([.,][0-9]+)?$` |
| Rabat constraint (offset) | `2 × width + rabat <= 76` cm                              |

---

## Data Types Reference

```typescript
interface QuoteInput {
  printMode: "digital" | "offset";
  quantity: number;
  format: string; // "21x29.7"
  interiorPages: number;
  coverPages: 0 | 2 | 4;
  interiorPaperType: string;
  interiorGrammage: number;
  coverPaperType?: string;
  coverGrammage?: number;
  interiorColors:
    | "quadrichromie"
    | "quadrichromie_vernis"
    | "bichromie"
    | "noir";
  coverColors?: "quadrichromie" | "quadrichromie_vernis" | "bichromie" | "noir";
  bindingType:
    | "rien"
    | "dos_carre_colle"
    | "dos_carre_colle_pur"
    | "dos_carre_colle_couture"
    | "piqure";
  laminationOrientation: "recto" | "recto_verso" | "non";
  laminationFinish?: "mat" | "brillant" | "soft_touch";
  productType: "brochure" | "flyer_poster" | "carte_visite" | "depliant";
  foldType?: "roule" | "accordeon" | "croise" | "rien";
  foldCount?: number;
  packagingType:
    | "non"
    | "a_lunite"
    | "par_paquet"
    | "par_2"
    | "par_3"
    | "par_4"
    | "par_5_10";
  deliveries: DeliveryDestination[];
}

interface QuoteResult {
  paperCost: number;
  printingCost: number;
  bindingCost: number;
  laminationCost: number;
  packagingCost: number;
  deliveryCost: number;
  subtotal: number;
  margin: number;
  totalPrice: number;
  pricePerUnit: number;
  weightPerCopy: number;
  totalWeight: number;
}
```

---

**End of Documentation**
