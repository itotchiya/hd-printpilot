# Plan d'Amélioration UX/UI - Quote Wizard

Après analyse du processus actuel, voici les points de friction identifiés et les solutions proposées pour améliorer l'expérience utilisateur sans modifier le moteur de calcul.

## 1. Validation de la Répartition des Quantités (Étape 8)

**Problème** : L'utilisateur peut terminer le devis même si la somme des quantités de livraison ne correspond pas à la quantité totale commandée.
**Solution** :

- Transformer l'avertissement en indicateur de "Balance".
- Désactiver le bouton "Suivant/Calculer" tant que la balance n'est pas à zéro.
- Ajouter un bouton "Solder le reste" sur la dernière destination pour remplir automatiquement le reliquat.

## 2. Intelligence sur le Nombre de Pages (Étape 3)

**Problème** : La contrainte "Multiple de 4" est frustrante si saisie manuellement (erreur après coup).
**Solution** :

- Remplacer l'input standard par un sélecteur avec boutons `+` et `-` qui incrémentent par pas de 4.
- Ajouter un avertissement visuel si le nombre de pages intérieures dépasse 96 (limite technique pour la piqûre) ou est inférieur à 40 (limite pour le dos carré collé).

## 3. Navigation Rapide depuis le Récapitulatif (Étape 9)

**Problème** : Pour modifier une option de l'étape 2 alors qu'on est à l'étape 9, il faut cliquer 7 fois sur "Précédent".
**Solution** :

- Ajouter des liens "Modifier" dans chaque section du composant `StepReview.tsx`.
- Ces liens redirigeront directement l'utilisateur vers la bonne étape du wizard.

## 4. Aide Contextuelle Technique

**Problème** : Certains termes (PUR, 4/4, Grammage, Rabat) peuvent être obscurs pour un client non-expert.
**Solution** :

- Ajouter des info-bulles (Tooltips) ou des petites icônes `?` explicatives.
- Utiliser des illustrations simples ou des schémas pour les modes de pliage et de reliure.

## 5. Persistance du Brouillon

**Problème** : Une déconnexion ou un rafraîchissement accidentel fait perdre toute la configuration.
**Solution** :

- Implémenter une sauvegarde automatique dans le `localStorage`.
- Proposer de "Reprendre le devis en cours" lors de l'ouverture de la page.

## 6. Feedback sur le Choix du Mode (Étape 1)

**Problème** : L'utilisateur choisit le mode Impression sans savoir lequel est le plus avantageux.
**Solution** :

- Ajouter une note : _"Le système comparera automatiquement pour vous à la fin et vous proposera la solution la plus économique."_

---

### Prochaines Étapes

L'implémentation de ces points peut se faire de manière itérative. Je recommande de commencer par la **Validation des Quantités** et la **Navigation Rapide** car ce sont les gains d'UX les plus immédiats.
