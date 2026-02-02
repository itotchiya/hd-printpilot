# HD-PrintPilot Core Pricing Engine - Spécifications Techniques

Ce document centralise l'intégralité de la logique métier, des formules mathématiques et des paramètres de calcul utilisés par le Wizard de devis et le moteur de tarification (Pricing Engine).

---

## 1. Architecture du Wizard (Workflow)

Le Wizard de devis est structuré en **9 étapes** séquentielles :

| Étape | Module                 | Description                                                   | Champs IDs                                                 |
| ----- | ---------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- |
| 1     | **Print Mode**         | Arbitrage initial Numérique vs Offset                         | `printMode`                                                |
| 2     | **Quantité & Format**  | Volume et dimensions finales (Presets: A4, A5, A6, DL, etc.)  | `quantity`, `format`                                       |
| 3     | **Pagination**         | Pages intérieures et couverture (2p/4p)                       | `interiorPages`, `coverPages`, `rabatWidth`                |
| 4     | **Papier**             | Choix du support (Couche, Offset, Recyclé, Munken)            | `interiorPaperType`, `interiorGrammage`                    |
| 5     | **Couleurs**           | Chromaticité (Quadri, Vernis, Bichromie, Noir)                | `interiorColors`, `coverColors`                            |
| 6     | **Reliure & Finition** | Dos carré, PUR, Piqûre, Pelliculage (Orientation & Fini)      | `bindingType`, `laminationOrientation`, `laminationFinish` |
| 7     | **Options Produit**    | Type de produit, Pliage (Roulé, Accordéon) et Conditionnement | `productType`, `foldType`, `packagingType`                 |
| 8     | **Livraison**          | Multi-destinations, Départements et Hayon                     | `deliveries`                                               |
| 9     | **Récapitulatif**      | Review des choix et lancement du calcul final                 | -                                                          |

---

## 2. Logique d'Arbitrage (Numérique vs Offset)

### 2.1 Seuil de rentabilité

- **Numérique (Digital)** : Rentable pour **1 à 300 exemplaires**.
  - _Avantage_ : Aucun frais fixe de calage.
  - _Inconvénient_ : Coût à la face élevé.
- **Offset** : Rentable au-delà de **300 exemplaires**.
  - _Avantage_ : Vitesse élevée, coût unitaire très bas sur le roulage.
  - _Inconvénient_ : Frais de calage (plaques) et gâche papier élevée au démarrage.

---

## 3. Paramètres & Constantes de Calcul

### 3.1 Unités

- **Diviseur de Poids** : `9769`
- **Poids unitaire (g)** : `((Largeur_cm * Hauteur_cm) / 9769) * Grammage * (Pages / 2)`

### 3.2 Marges Commerciales (Markup)

- **Cible Digital** : `+5%` (`DIGITAL_MARGIN = 0.05`)
- **Cible Offset** : `+7%` (`OFFSET_MARGIN = 0.07`)

---

## 4. Grilles de Tarification (Data Reference)

### 4.1 Index Papier (€/Kg)

_Base indicative pour les calculs de poids matière._

| Type Papier      | 80g  | 115g | 135g | 170g | 250g | 300g | 350g | 400g |
| ---------------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
| Couche Mat/Satin | 1.15 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.63 |
| Recyclé          | 1.40 | 1.50 | 1.50 | -    | -    | -    | -    | -    |
| Munken           | 2.40 | -    | -    | -    | -    | -    | -    | -    |

### 4.2 Impression Numérique (Coût / Face)

| Type de Couleur        | Coût (€) |
| ---------------------- | -------- |
| Quadrichromie          | 0.045    |
| Quadrichromie + Vernis | 0.055    |
| Bichromie              | 0.035    |
| Noir                   | 0.025    |

### 4.3 Reliure (Frais Fixes & Unitaires)

**Coûts fixes de Setup :**

- Dos Carré Collé : 70 €
- PUR : 80 €
- Couture : 100 €
- Piqûre : 35 € (25 € si > 200 ex)

**Coûts Unitaires (DCC) :**
| Tranche Pages | 25-50 ex | 100-200 ex | 400-500 ex | >500 ex |
|---|---|---|---|---|
| 32-72 p | 1.65 € | 1.30 € | 1.00 € | 0.90 € |
| 76-152 p | 1.80 € | 1.35 € | 1.10 € | 1.00 € |
| >152 p | 1.95 € | 1.40 € | 1.15 € | 1.05 € |

### 4.4 Transport (Zonage & Poids)

| Tranche    | Zone A (IDF) | Zone B (Proche) | Zone C | Zone D |
| ---------- | ------------ | --------------- | ------ | ------ |
| 0-5 Kg     | 15 €         | 18 €            | 22 €   | 28 €   |
| 5-10 Kg    | 20 €         | 25 €            | 32 €   | 42 €   |
| 30-50 Kg   | 45 €         | 58 €            | 75 €   | 98 €   |
| 200-500 Kg | 145 €        | 185 €           | 245 €  | 340 €  |
| >500 Kg    | 220 €        | 280 €           | 380 €  | 520 €  |

---

## 5. Règles Métier & Sécurité

### 5.1 Colisage

- **Règle d'Or** : Un carton ne doit jamais dépasser **15 Kg**.
- **Coût Colis** : `1.85 € / carton HT`.
- **Calcul cartons** : `Total_Cartons = ceil(Poids_Total / 15)`.

### 5.2 Contraintes Techniques

1. **Lamination** : Impossible en-dessous de **135g**.
2. **Pagination** : Toujours un multiple de **4**.
3. **Saddle Stitch (Piqûre)** : Limité à **96 pages**. Au-delà, reliure collée obligatoire.
4. **Dos Carré Collé** : Minimum **40 pages** requis pour la tenue de la colle.
5. **Format Dépliant** : Largeur du document + Largeur du rabat ≤ **76 cm**.
6. **Surcharge Hayon** : **60 €** par point de livraison si activé.

---

## 6. Suppléments Spécifiques Offset

- Papier Intérieur < 70g : `+20%`
- Dos < 3mm ou > 35mm : `+20%`
- Mat/Satin > 115g : `+5% à +15%` (selon fini)
- Cahiers encartés : `+5%` (1 signature) ou `+10%` (2 signatures)

---

_Dernière mise à jour : 02 Février 2026 - Master Engine V2.4._
