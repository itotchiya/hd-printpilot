# Fixed pricing values and conditions from Tableau Numérique‑Offset HAVET‑IMB 29‑01‑2026

This document lists the **fixed price tables, constants and conditional rules** extracted from the macro‑enabled workbook. These values are needed for **seeding your database** and implementing the **rules engine** in your mini‑app.

For each table we describe:

- **What it is** (purpose)
- **Conditions** (when it applies)
- **Fixed values** (prices per unit, fixed set‑ups, weight brackets, etc.)

The tables below are compiled from the workbook’s:
- `Tableau Façonnage Num`
- `Tableau Façonnage OFFSET`
- `Transports`
- `Livraison`
- `Donnees Num`
- `Tableau papier`

Units are in euros (€) unless noted otherwise.

---

## 1. Constants and shared formulas

### 1.1 Sheet weight constant (digital & offset)
Used to convert **area** and **grammage** into **weight per copy**.

- **Divisor:** `9769`
- **Conversion to kg:** divide by `1000` after multiplying by quantity/area.

### 1.2 Margins
- **Digital margin:** 5% → multiply subtotal by **1.05**
- **Offset margin:** 7% → multiply subtotal by **1.07**

### 1.3 Tail‑lift surcharge (per delivery line)
- **Tail‑lift surcharge:** **60 €**

Condition:
- If the user selects **“Oui”** for tail‑lift on a delivery line, add 60 € to that line’s delivery cost.

---

## 2. Paper prices (sheet “Tableau papier”)

Prices are **€/kg for paper stock**. The workbook’s named ranges (e.g. `CoucheMatInterieur`, `RecycleOffset`) pull from these values.

### 2.1 Interior paper prices (€/kg)

| Grammage (g/m²) | Couché Mat | Couché Satin | Brillant | Recyclé | Offset | Bouffant Amber Vol. | Bouffant Munken Blanc | Bouffant Munken Crème |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 70  | –    | –    | –    | 1.40 | 1.16 | –    | –    | –    |
| 80  | 1.15 | 1.15 | 1.15 | 1.40 | 1.15 | 1.60 | 2.40 | 2.40 |
| 90  | 1.00 | 1.00 | 1.00 | 1.40 | 1.15 | 1.60 | 2.40 | 2.40 |
| 100 | 1.00 | 1.00 | 1.00 | 1.50 | 1.25 | –    | –    | –    |
| 115 | 1.00 | 1.00 | 1.00 | 1.50 | 1.25 | –    | –    | –    |
| 130 | 1.00 | 1.00 | 1.00 | 1.405 | –   | –    | –    | –    |
| 135 | 1.00 | 1.00 | 1.00 | 1.50 | –    | –    | –    | –    |
| 150 | 1.00 | 1.00 | 1.00 | –    | –    | –    | –    | –    |
| 170 | 1.00 | 1.00 | 1.00 | –    | –    | –    | –    | –    |
| 200 | 1.00 | 1.00 | 1.00 | –    | –    | –    | –    | –    |
| 250 | 1.00 | 1.00 | 1.00 | –    | 1.50 | –    | –    | –    |
| 300 | 1.00 | 1.00 | 1.00 | –    | –    | –    | –    | –    |
| 350 | 1.00 | 1.00 | 1.00 | –    | –    | –    | –    | –    |
| 400 | 1.63 | 1.63 | 1.63 | –    | –    | –    | –    | –    |

> Notes:
> - “–” means blank in Excel (treat as not available / not priced).
> - Some columns exist in the sheet but are not used in common workflows.

### 2.2 Offset sheet format pricing (€/unit sheet)

Columns:
- `64x90`, `65x92`, `70x102`, `72x102`

Example rows:

| Grammage | 64x90 | 65x92 | 70x102 | 72x102 |
|---:|---:|---:|---:|---:|
| 70  | 40.32 | 41.86 | 49.98 | 51.41 |
| 80  | 46.08 | 47.80 | 57.10 | 58.75 |
| 90  | 51.84 | 53.80 | 64.30 | 66.10 |
| 100 | 57.60 | 59.80 | 71.40 | 73.44 |
| 110 | 63.36 | 65.78 | 78.54 | 80.78 |
| 115 | 66.24 | 68.80 | 82.10 | 84.45 |

---

## 3. Digital binding costs (sheet “Tableau Façonnage Num”)

### 3.1 Perfect binding – “Dos carré collé” (glued spine)

Page range table:

| Page range | Qty 25–50 | 100–200 | 200–300 | 300–400 | 400–500 | >500 |
|---|---:|---:|---:|---:|---:|---:|
| 32–72 | 1.65 | 1.30 | 1.15 | 1.05 | 1.00 | 0.90 |
| 76–152 | 1.80 | 1.35 | 1.25 | 1.15 | 1.10 | 1.00 |
| >152 (≤280) | 1.95 | 1.40 | 1.30 | 1.20 | 1.15 | 1.05 |

Setup (calage): **70 €**

Conditions:
- Pages must be **multiple of 4**.
- Pages >280 not supported for digital perfect binding.

### 3.2 Perfect binding PUR – “Dos carré collé PUR”

| Page range | Qty 25–50 | 100–200 | 200–300 | 300–400 | 400–500 | >500 |
|---|---:|---:|---:|---:|---:|---:|
| 32–72 | 1.75 | 1.50 | 1.35 | 1.25 | 1.15 | 1.05 |
| 76–152 | 1.90 | 1.55 | 1.45 | 1.35 | 1.25 | 1.15 |
| >152 | 2.05 | 1.60 | 1.50 | 1.40 | 1.30 | 1.20 |

Setup (calage): **80 €**

### 3.3 Saddle stitching (2 “piqûre à cheval”) with cover

| Quantity | Calage |
|---|---:|
| <200 | 35 |
| >200 | 25 |

Conditions:
- Applies when binding is **Piqûre**.

---

## 3.4 Additional digital finishing costs

### Cutting / packaging (“Coupe”)

#### Brochures

| Qty | Unit price | Fixed cost |
|---:|---:|---:|
| 100 | 0.07 | 10 |
| 200 | 0.06 | 10 |
| 300 | 0.05 | 10 |
| 400 | 0.04 | 10 |
| 500+ | 0.03 | 10 |

#### Sheets (fiches)

| Qty | Unit price | Fixed cost |
|---:|---:|---:|
| 500 | 0.0008 | 10 |
| 1000 | 0.007 | 10 |
| 2000 | 0.005 | 10 |
| 4000 | 0.004 | 10 |
| 6000+ | 0.003 | 10 |

#### Business cards

| Qty | Unit price | Fixed cost |
|---:|---:|---:|
| 500 | 0.0015 | 10 |
| 1000 | 0.0010 | 10 |
| 2000 | 0.0090 | 10 |
| 4000 | 0.0070 | 10 |
| 6000+ | 0.0050 | 10 |

> Note: keep the 2000 bracket exactly as Excel (0.009).

### Folding (“Pliage”) – digital

Quantity brackets: 100 / 250 / 500 / 1000 / 2000

| Folds | 100 | 250 | 500 | 1000 | 2000 | Setup |
|---:|---:|---:|---:|---:|---:|---:|
| 1 | 0.05 | 0.05 | 0.04 | 0.009 | 0.007 | 18 |
| 2 | 0.06 | 0.06 | 0.048 | 0.0108 | 0.0084 | 26 |
| 3 | 0.072 | 0.072 | 0.0576 | 0.01296 | 0.01008 | 33 |
| 4 | 0.0864 | 0.0864 | 0.06912 | 0.015552 | 0.012096 | 37 |

Conditions:
- Applies mainly to **Dépliant** product type.

---

## 4. Offset finishing costs (sheet “Tableau Façonnage OFFSET”)

### 4.1 Lamination (offset)

Base rates:
- Pelliculage Simple: 0.25 €/m²
- Pelliculage Simple RectoVerso: 0.30 €/m²
- Pelliculage Complet: 0.50 €/m²

Setup:
- Calage: 55 € or 60 € depending on treatment.

Format thresholds:
- Format < 50×70: 170 €/1000 m², 90 €/1000 sheets
- Format > 50×70: 130 €/1000 m², 115 €/1000 sheets

### 4.2 Offset binding (Dos carré collé tables)

See the workbook for the full binding matrices. Key structure:
- Input: `Cahiers + CV`
- Outputs:
  - `Calage`
  - `Roulage au 1000`

Example (sans couture):
| Cahiers+CV | Calage | Roulage/1000 |
|---:|---:|---:|
| 2 | 215.25 | 91 |
| 3 | 218.40 | 97 |
| 4 | 221.55 | 109 |

### 4.3 Offset supplements (percent add-ons)

| Condition | Add-on |
|---|---:|
| Satin >115g | +5% |
| Mat >115g | +15% |
| 1 cahier encarté à cheval | +5% |
| Cahiers encartés 2 par 2 | +10% |
| Papier intérieur <70g | +20% |
| dos -3mm or >35mm | +20% |

---

## 5. Transport matrix (sheet “Transports”)

The transport sheet lists delivery prices by:
- Department (row)
- Weight bracket (column)

Condition:
- Determine weight of each delivery line
- Select smallest bracket ≥ weight
- Lookup department row and bracket column
- Add tail-lift surcharge if enabled

---

## 6. Summary of dropdown options

| Field | Options |
|---|---|
| Type d’impression | Numérique, Offset |
| Type de produit | Flyer/Poster, Carte de visite, Dépliant |
| Type de reliure | Rien, Dos carré collé, Dos carré collé PUR, Piqûre |
| Pelliculage orientation | Recto, Recto Verso, Non |
| Hayon élévateur | Oui, Non |

---

## 7. Implementation notes

- Store each table as a **seedable DB table** with clear bracket keys.
- Rules engine should do only deterministic lookups + arithmetic.

**End of document**

