# Analyse du Processus Quote Wizard

Ce document détaille le fonctionnement étape par étape de l'assistant de devis (Quote Wizard) de HD-PrintPilot, incluant les éléments d'interface, la logique métier et le moteur de calcul.

## Table des Matières

1. [Phase de Configuration (Les 9 Étapes)](#1-phase-de-configuration-les-9-étapes)
2. [Phase de Calcul & Logique Métier](#2-phase-de-calcul--logique-métier)
3. [Phase de Persistance et Résultats](#3-phase-de-persistance-et-résultats)

---

## 1. Phase de Configuration (Les 9 Étapes)

Le wizard est composé de 9 étapes distinctes, chacune gérée par un composant React dédié et validée par un schéma Zod.

### Étape 1 : Mode d'impression (`StepPrintMode.tsx`)

- **Objectif** : Choisir la technologie d'impression de base.
- **Éléments** :
  - Radio Group : `Numérique` (idéal petites séries) ou `Offset` (idéal gros volumes).
  - Description détaillée des avantages techniques pour chaque mode.

### Étape 2 : Quantité & Format (`StepQuantityFormat.tsx`)

- **Objectif** : Définir le volume et les dimensions du produit.
- **Éléments** :
  - Input : `Quantité` (nombre entier).
  - Input : `Format manuel` (au format LxH, ex: 21x29,7).
  - Boutons de formats prédéfinis : A4, A5, A6, 10x21, 15x21.

### Étape 3 : Pages (`StepPages.tsx`)

- **Objectif** : Configurer la pagination et les spécificités structurelles.
- **Éléments** :
  - Saisie Interior Pages : Minimum 4 pages, doit être un multiple de 4.
  - Saisie Cover Pages : Options 0 (pas de couverture), 2 pages (recto seul), 4 pages (recto-verso).
  - Largeur Rabat : Uniquement en mode Offset, permet d'ajouter un rabat sur la couverture.

### Étape 4 : Papier (`StepPaper.tsx`)

- **Objectif** : Sélectionner les supports pour l'intérieur et la couverture.
- **Éléments** :
  - Type de Papier (Intérieur/Couv) : Couché Mat, Satin, Brillant, Offset, Recyclé, Bouffant, etc.
  - Grammage (Intérieur/Couv) : Les options s'adaptent dynamiquement selon le type de papier choisi.

### Étape 5 : Couleurs (`StepColors.tsx`)

- **Objectif** : Définir le mode colorimétrique.
- **Éléments** :
  - Couleurs Intérieur : Quadrichromie, Quadrichromie + Vernis, Bichromie, Noir.
  - Couleurs Couverture : Idem (si une couverture existe).
  - Indicateur visuel interactif pour chaque mode.

### Étape 6 : Reliure & Finition (`StepBinding.tsx`)

- **Objectif** : Choisir le type d'assemblage et la protection.
- **Éléments** :
  - Type de Reliure : Piqûre (agrafes), Dos Carré Collé (Standard, PUR ou Cousu).
  - Pelliculage (sur couverture) : Recto, Recto-Verso ou Non.
  - Finition Pelliculage : Mat, Brillant, Soft Touch.

### Étape 7 : Options Produit (`StepProductOptions.tsx`)

- **Objectif** : Définir le type de produit fini et son pliage.
- **Éléments** :
  - Type de Produit : Brochure, Flyer/Poster, Carte de visite, Dépliant.
  - Options de Pliage (si Dépliant) : Roulé, Accordéon, Croisé.
  - Conditionnement : À l'unité, par paquet, par 2, 3, 4 ou par 5-10.

### Étape 8 : Livraison (`StepDelivery.tsx`)

- **Objectif** : Gérer la logistique et les destinations multiples.
- **Éléments** :
  - Gestionnaire de destinations (FieldArray) permettant d'ajouter plusieurs adresses.
  - Champs par destination : Quantité, Département, Option Hayon.

### Étape 9 : Récapitulatif (`StepReview.tsx`)

- **Objectif** : Vérification finale avant calcul.
- **Éléments** :
  - Résumé groupé par section (Impression, Pages, Papier, Couleurs, Reliure, Produit, Livraison).
  - Indication "Tout est prêt" si validation conforme.

---

## 2. Phase de Calcul & Logique Métier

Une fois le formulaire validé (via `quoteSchema`), les données sont envoyées à l'API `/api/quotes` qui décline le calcul.

### Logique de Comparaison Automatique

- Si le mode `offset` est choisi OU si la quantité est **supérieure à 300**, le système calcule parallèlement les deux modes (Digital et Offset).
- Il recommande automatiquement le mode le moins cher (`recommendedMode`).

### Composants du Prix (Breakdown)

Le moteur de calcul décompose le prix final selon :

1.  **Papier** : Prix basé sur le type, grammage, format et gâche technique.
2.  **Impression & Setup** : Coûts fixes de calage + coûts variables au clic (digital) ou à la plaque (offset).
3.  **Façonnage** : Coût de la reliure, du pliage et du rognage.
4.  **Pelliculage** : Calculé à la feuille selon la finition.
5.  **Livraison** : Calculé selon le poids total (grammage x surface x pages x quantité) et les départements.

### Marges Appliquées

- **Numérique (Digital)** : Marge standard de **5%**.
- **Offset** : Marge standard de **7%**.

---

## 3. Phase de Persistance et Résultats

### Sauvegarde (Prisma)

Chaque devis calculé est automatiquement persisté dans la base Neon (PostgreSQL) avec :

- Tous les paramètres de configuration.
- Le détail complet du poids et des coûts.
- Le prix unitaire et le total HT.

### Affichage du Résultat

L'utilisateur voit un écran de succès avec :

- Le **Total HT** en grand.
- Le prix par exemplaire.
- Une comparaison interactive entre Digital et Offset (si applicable).
- Un bouton de téléchargement pour générer un **PDF** de l'offre commerciale.
