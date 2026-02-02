# Wizard Quotes (Devis) Technical Documentation

This document describes the **quote creation (devis) workflow** in HD-PrintPilot, including the process flow, pricing engine logic, data structures, constants, and key variables used in the wizard and API layer. It is based on the current implementation in the repository.

---

## 1) Process Flow (User Journey → API → Persistence)

### 1.1 Entry Point

- The quote wizard is rendered at `/dashboard/devis/new` and loads the `QuoteWizard` component (React + React Hook Form).【F:src/app/dashboard/devis/new/page.tsx†L1-L19】【F:src/components/quote-wizard/QuoteWizard.tsx†L1-L381】

### 1.2 Wizard Steps (UI Sequence)

The wizard has **9 steps** (tracked as `currentStep`) and uses a shared context to manage progress and draft state.【F:src/components/quote-wizard/QuoteWizard.tsx†L27-L381】【F:src/context/WizardContext.tsx†L1-L109】

1. **Mode d’impression (Print Mode)**
2. **Quantité & Format**
3. **Pages**
4. **Papier**
5. **Couleurs**
6. **Reliure & Finition**
7. **Options Produit**
8. **Livraison**
9. **Récapitulatif**  
   These labels are defined in the schema as the canonical step names.【F:src/lib/schemas/quote-schema.ts†L141-L200】

### 1.3 Draft Lifecycle

- When the wizard loads without a `draft` URL parameter, it **creates an initial draft** via `POST /api/quotes/draft` and stores the `draftId` in the URL. This draft is updated as the user progresses through the wizard.【F:src/components/quote-wizard/QuoteWizard.tsx†L160-L195】【F:src/app/api/quotes/draft/route.ts†L1-L93】
- If the wizard loads with a `?draft=...` parameter, it **fetches the draft** using `GET /api/quotes/[id]` and restores the form state and step position.【F:src/components/quote-wizard/QuoteWizard.tsx†L70-L143】【F:src/app/api/quotes/[id]/route.ts†L52-L83】

### 1.4 Submit & Persist

- On submit, the wizard POSTs the full form data to `POST /api/quotes`. The API validates with `quoteSchema`, calculates pricing, saves the quote to the database, and returns a response payload including totals and a cost breakdown.【F:src/components/quote-wizard/QuoteWizard.tsx†L312-L334】【F:src/app/api/quotes/route.ts†L1-L205】【F:src/lib/schemas/quote-schema.ts†L118-L132】
- The UI then renders the quote result view and allows **PDF download** via `GET /api/quotes/[id]/pdf`.【F:src/components/quote-wizard/QuoteWizard.tsx†L337-L376】【F:src/app/api/quotes/[id]/pdf/route.ts†L1-L55】

---

## 2) Data Model & Storage

### 2.1 Database Schema (Quote)

Quotes are persisted in Prisma as the `Quote` model, which stores both inputs and computed outputs such as costs, totals, and weight. The schema also includes a `status` (`draft` vs `completed`) and `currentStep` for draft recovery.【F:prisma/schema.prisma†L130-L199】

Key fields include:

- **Inputs:** `printMode`, `quantity`, `formatWidth`, `formatHeight`, `interiorPages`, `coverPages`, `rabatWidth`, paper selections, colors, binding, lamination, product details, packaging, deliveries JSON.【F:prisma/schema.prisma†L134-L178】
- **Outputs:** weight, paper/printing/binding/lamination/packaging/delivery cost, subtotal, margin, total, unit price, plus offset-specific fields such as `pressFormat`, `plateCount`, `makeReadyCost`.【F:prisma/schema.prisma†L181-L195】

### 2.2 Draft Saves

- Drafts are stored in the same `Quote` table with `status: 'draft'` and zeroed cost fields. The draft endpoint parses and saves partial data to preserve user progress between sessions.【F:src/app/api/quotes/draft/route.ts†L12-L70】

---

## 3) Validation & Inputs (Schema)

The wizard uses `quoteSchema` (Zod) to validate each step and the final submission. Key rules include:

- **Format:** must match `LARGEURxHAUTEUR` with comma or dot decimals.
- **Pages:** must be a multiple of 4, minimum 4 pages.
- **Deliveries:** sum of delivery quantities must equal total quantity.
- **Enumerations:** print mode, binding, colors, lamination, packaging, etc. are all constrained by enum lists.  
  These are enforced by the schema on both client and API.【F:src/lib/schemas/quote-schema.ts†L34-L132】

---

## 4) Core Pricing Engine (Digital & Offset)

The pricing engine has two main calculators:

- **Digital:** `calculateDigitalQuote()`
- **Offset:** `calculateOffsetQuote()`  
  Both return a `QuoteBreakdown` with line items and totals.【F:src/lib/pricing/digital-calculator.ts†L452-L537】【F:src/lib/pricing/offset-calculator.ts†L496-L543】

### 4.1 Shared Inputs

Both calculators accept:

- `quantity`, `formatWidth`, `formatHeight`
- `interiorPages`, `coverPages`, `rabatWidth`
- paper selections & grammage
- color options
- binding, lamination, product type, folding
- packaging & delivery info
  These are defined in the `DigitalQuoteInput` and `OffsetQuoteInput` interfaces.【F:src/lib/pricing/digital-calculator.ts†L24-L64】【F:src/lib/pricing/offset-calculator.ts†L26-L66】

### 4.2 Shared Output (`QuoteBreakdown`)

The output is a normalized cost breakdown, including weight, subtotal, margin, total price, and per‑unit cost.【F:src/lib/pricing/digital-calculator.ts†L66-L83】

---

## 5) Calculations (Digital Printing)

### 5.1 Weight

```
area = formatWidth × formatHeight
interiorWeight = (area × (interiorPages/2) × interiorGrammage) / WEIGHT_DIVISOR
coverWeight = (area × (coverPages/2) × coverGrammage) / WEIGHT_DIVISOR
weightPerCopy = (interiorWeight + coverWeight) / 1000
totalWeight = weightPerCopy × quantity
```

The calculator uses `WEIGHT_DIVISOR = 9769` and converts grams to kilograms before multiplying by quantity.【F:src/lib/pricing/pricing-data.ts†L13-L27】【F:src/lib/pricing/digital-calculator.ts†L244-L266】

### 5.2 Paper Cost (Digital)

Paper cost is computed using **price per kg** from `PAPER_PRICES`, with a fallback to the closest grammage and `DEFAULT_PAPER_PRICE` when needed. The algorithm:

1. Normalize the paper type string (e.g., “Couché Mat” → `couche_mat`).
2. Find the price for the requested grammage, or use the nearest available grammage.
3. Multiply weight by price for interior and (if applicable) cover stock.  
   【F:src/lib/pricing/digital-calculator.ts†L78-L170】【F:src/lib/pricing/digital-calculator.ts†L268-L292】【F:src/lib/pricing/pricing-data.ts†L33-L138】

### 5.3 Printing Cost (Digital)

Printing cost uses a **per‑side price** by color mode:

```
interiorCost = interiorPages × quantity × costPerSide(interiorColors)
coverCost = coverPages × quantity × costPerSide(coverColors)
printingCost = interiorCost + coverCost
```

The per‑side rates are defined in `DIGITAL_PRINT_COSTS` (e.g., quadrichromie, bichromie, noir).【F:src/lib/pricing/digital-calculator.ts†L293-L315】【F:src/lib/pricing/pricing-data.ts†L144-L153】

### 5.4 Binding Cost (Digital)

Binding uses lookup tables based on **page ranges** and **quantity brackets**, plus a setup fee.  
Key rules:

- `dos_carre_colle_couture` is mapped to `dos_carre_colle_pur` (not available in digital).
- `piqure` setup is reduced to **€25** when quantity > 200.  
  The per‑unit tables and setup fees are defined in `DIGITAL_BINDING_COSTS` and `DIGITAL_BINDING_SETUP`.【F:src/lib/pricing/digital-calculator.ts†L317-L352】【F:src/lib/pricing/pricing-data.ts†L162-L256】

### 5.5 Lamination Cost (Digital)

If lamination orientation is not `non`, a **per‑unit rate** is selected from `DIGITAL_LAMINATION_COSTS` based on quantity thresholds (≤100, ≤300, ≤500, ≤1000, ≤2500).  
Soft‑touch finish applies a multiplier of **1.25** via `LAMINATION_FINISH_MULTIPLIERS`.【F:src/lib/pricing/digital-calculator.ts†L354-L375】【F:src/lib/pricing/pricing-data.ts†L268-L301】

### 5.6 Folding Cost (Digital)

Folding applies only when `productType === 'depliant'`.  
Costs come from `DIGITAL_FOLDING_COSTS` and `DIGITAL_FOLDING_SETUP`, and use quantity thresholds (≤100, ≤250, ≤500, ≤1000, ≤2000).【F:src/lib/pricing/digital-calculator.ts†L377-L395】【F:src/lib/pricing/pricing-data.ts†L309-L334】

### 5.7 Packaging Cost (Digital)

Packaging applies only for **brochures/dépliants** and **business cards**.  
The calculator selects a quantity threshold and applies `perUnit × quantity + fixed`.  
Tables: `PACKAGING_BROCHURE_COSTS` and `PACKAGING_CARD_COSTS`.【F:src/lib/pricing/digital-calculator.ts†L396-L415】【F:src/lib/pricing/pricing-data.ts†L346-L372】

### 5.8 Delivery Cost (Digital)

Delivery cost is determined by:

1. **Zone** derived from the department prefix (`TRANSPORT_ZONES`).
2. **Weight bracket** derived from the shipment weight (`TRANSPORT_COSTS`).
3. A **tail‑lift surcharge** of €60 per delivery if requested.  
   【F:src/lib/pricing/digital-calculator.ts†L417-L448】【F:src/lib/pricing/pricing-data.ts†L13-L27】【F:src/lib/pricing/pricing-data.ts†L445-L505】

### 5.9 Subtotal & Margin (Digital)

```
subtotal = paper + printing + binding + lamination + folding + packaging + delivery
marginAmount = subtotal × DIGITAL_MARGIN (5%)
totalPrice = subtotal + marginAmount
pricePerUnit = totalPrice / quantity
```

The calculation rounds values to 2 decimals for costs and 3 decimals for weight per copy.【F:src/lib/pricing/digital-calculator.ts†L452-L537】【F:src/lib/pricing/pricing-data.ts†L13-L27】

---

## 6) Calculations (Offset Printing)

### 6.1 Offset Format Selection

The engine selects an offset press format based on finished dimensions:

- 64×90 if ≤ 32×45
- 65×92 if ≤ 32.5×46
- 70×102 if ≤ 35×51
- otherwise 72×102  
  This minimizes waste and drives sheet pricing.【F:src/lib/pricing/offset-calculator.ts†L96-L109】

### 6.2 Signatures & Plate Count

Offset uses signature imposition (16, 12, 8, 6, 4 pages per signature). The total signatures are computed by decomposing the page count. Plate count is derived from color mode and number of signatures, with covers adding additional plates (both sides).【F:src/lib/pricing/offset-calculator.ts†L111-L178】

### 6.3 Weight

Offset weight uses the same base formula as digital, with an optional **rabat** (flap) width added to the cover area when applicable.【F:src/lib/pricing/offset-calculator.ts†L203-L231】

### 6.4 Paper Cost (Offset)

Offset paper cost is computed from:

1. **Offset sheet price per 1000** for the chosen format and grammage.
2. **Number of sheets** required (signatures × quantity × 10% waste).
3. **Cover sheets** (1 per copy, +10% waste) when covers are present.  
   The sheet price table is `OFFSET_SHEET_PRICES`.【F:src/lib/pricing/offset-calculator.ts†L265-L333】【F:src/lib/pricing/pricing-data.ts†L383-L397】

### 6.5 Make‑Ready (Setup)

Make‑ready cost starts at **€500** and may be reduced by a varnish factor (0.65), plus an additional **€200/€300** for 2‑page/4‑page covers.【F:src/lib/pricing/offset-calculator.ts†L332-L352】【F:src/lib/pricing/pricing-data.ts†L402-L410】

### 6.6 Printing Cost (Offset)

Printing cost includes:

```
plateCost = plateCount × 25
runningCost = impressions × 0.01
printingCost = plateCost + runningCost
```

where impressions are derived from signatures, quantity, color mode, and both sides.【F:src/lib/pricing/offset-calculator.ts†L353-L377】

### 6.7 Binding Cost (Offset)

Binding uses `OFFSET_BINDING_COSTS` indexed by total **cahiers** (signatures + cover). If the count is out of range, a digital‑style fallback is used with `DIGITAL_BINDING_COSTS` + setup.  
【F:src/lib/pricing/offset-calculator.ts†L378-L418】【F:src/lib/pricing/pricing-data.ts†L416-L423】

### 6.8 Lamination Cost (Offset)

Lamination cost is area‑based (m²) plus a fixed setup fee (55).  
Rates depend on orientation (`simple` or `simpleRectoVerso`).【F:src/lib/pricing/offset-calculator.ts†L419-L443】【F:src/lib/pricing/pricing-data.ts†L429-L437】

### 6.9 Supplements (Offset)

Supplements are percentage add‑ons based on stock and conditions (e.g., satin/mat >115g, paper <70g). The supplement rate is applied to the subtotal.  
Defined in `OFFSET_SUPPLEMENTS` and applied via `calculateSupplements`.【F:src/lib/pricing/offset-calculator.ts†L444-L466】【F:src/lib/pricing/pricing-data.ts†L441-L448】

### 6.10 Delivery & Margin (Offset)

Delivery is calculated by zone + weight bracket like digital, including tail‑lift surcharges.  
Offset margin uses **7%** (`OFFSET_MARGIN`).【F:src/lib/pricing/offset-calculator.ts†L468-L517】【F:src/lib/pricing/pricing-data.ts†L13-L27】

---

## 7) API Logic (Quote Selection & Response)

The quote API:

1. Parses and validates input via `quoteSchema`.
2. Builds a unified input structure for both calculators.
3. Always computes the **digital quote**, and computes **offset** if `printMode === 'offset'` or `quantity > 300`.
4. Saves the selected breakdown to the database.
5. Returns a response with totals, weight, optional offset comparison, and breakdown.  
   【F:src/app/api/quotes/route.ts†L21-L192】

The response includes:

- `totalPrice`, `pricePerUnit`, `totalWeight`, and detailed breakdown.
- `comparison` section when quantity > 300 (digital vs offset).
  【F:src/app/api/quotes/route.ts†L139-L181】

---

## 8) Constants & Price Tables (Source of Truth)

All constants and pricing matrices are centralized in `src/lib/pricing/pricing-data.ts`.  
Key groups include:

- **Core constants:** `WEIGHT_DIVISOR`, `DIGITAL_MARGIN`, `OFFSET_MARGIN`, `TAIL_LIFT_SURCHARGE`.【F:src/lib/pricing/pricing-data.ts†L13-L27】
- **Paper prices:** `PAPER_PRICES` by type and grammage, with `DEFAULT_PAPER_PRICE`.【F:src/lib/pricing/pricing-data.ts†L33-L138】
- **Digital printing:** `DIGITAL_PRINT_COSTS` per side.【F:src/lib/pricing/pricing-data.ts†L144-L153】
- **Digital binding:** `DIGITAL_BINDING_COSTS`, `DIGITAL_BINDING_SETUP`.【F:src/lib/pricing/pricing-data.ts†L162-L256】
- **Digital lamination:** `DIGITAL_LAMINATION_COSTS`, `LAMINATION_FINISH_MULTIPLIERS`.【F:src/lib/pricing/pricing-data.ts†L268-L301】
- **Digital folding:** `DIGITAL_FOLDING_COSTS`, `DIGITAL_FOLDING_SETUP`.【F:src/lib/pricing/pricing-data.ts†L309-L334】
- **Packaging:** `PACKAGING_BROCHURE_COSTS`, `PACKAGING_CARD_COSTS`.【F:src/lib/pricing/pricing-data.ts†L346-L372】
- **Offset sheet pricing:** `OFFSET_SHEET_PRICES`.【F:src/lib/pricing/pricing-data.ts†L383-L397】
- **Offset setup/binding/lamination/supplements:** `OFFSET_MAKE_READY`, `OFFSET_BINDING_COSTS`, `OFFSET_LAMINATION`, `OFFSET_SUPPLEMENTS`.【F:src/lib/pricing/pricing-data.ts†L402-L448】
- **Transport:** `TRANSPORT_ZONES`, `TRANSPORT_COSTS`.【F:src/lib/pricing/pricing-data.ts†L456-L505】
- **Validation constraints:** `VALIDATION` constants (page multiple, min/max pages, rabat constraint).【F:src/lib/pricing/pricing-data.ts†L512-L530】

---

## 9) Key Variables (Inputs & Outputs)

### 9.1 Input Variables (Wizard & API)

Defined by `quoteSchema` and calculator input interfaces:

- **Quantities & format:** `quantity`, `format` → `formatWidth`/`formatHeight`.
- **Pages:** `interiorPages`, `coverPages`, `rabatWidth`.
- **Paper:** `interiorPaperType`, `interiorGrammage`, `coverPaperType`, `coverGrammage`.
- **Colors:** `interiorColors`, `coverColors`.
- **Finishing:** `bindingType`, `laminationOrientation`, `laminationFinish`.
- **Product options:** `productType`, `foldType`, `foldCount`, `secondaryFoldType`, `packagingType`.
- **Delivery:** `deliveries[]` with `{ quantity, department, tailLift }`.  
  【F:src/lib/schemas/quote-schema.ts†L34-L132】【F:src/lib/pricing/digital-calculator.ts†L24-L64】

### 9.2 Output Variables (Quote Breakdown)

Returned by the calculators and API:

- `paperCost`, `printingCost`, `bindingCost`, `laminationCost`, `foldingCost`, `packagingCost`, `deliveryCost`
- `subtotal`, `marginRate`, `marginAmount`, `totalPrice`, `pricePerUnit`
- `weightPerCopy`, `totalWeight`  
  【F:src/lib/pricing/digital-calculator.ts†L66-L83】【F:src/app/api/quotes/route.ts†L139-L181】

---

## 10) Reference Documentation

The repository includes a detailed pricing specification in `PRICING_ENGINE_DOCUMENTATION.md` that aligns with the calculator implementation and serves as a business‑level reference.【F:src/Docs/PRICING_ENGINE_DOCUMENTATION.md†L1-L207】
