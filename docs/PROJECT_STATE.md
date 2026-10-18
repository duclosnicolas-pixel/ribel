# RIBEL — État de référence partagé

Mise à jour : 2026-10-18. Ce document doit être actualisé après chaque recette ou décision du MOA.

## Gouvernance et intention
- Nicolas : MOA, seul habilité à valider les implantations et mises en production.
- Claude : MOE/AMOA/lead technique ; ChatGPT : AMOE/UX/Three.js.
- Monde de Touraine / Loire, environ 1450–1550, priorité à la plausibilité historique et à l'artisanat non industriel.
- Cible mobile Samsung Galaxy Z Fold 6 ; Three.js/WebXR ; zones et personnages autonomes.

## Village
- URL de production : https://duclosnicolas-pixel.github.io/ribel/
- `index.html` : ne pas modifier sans accord du MOA.
- Prévisualisation d'implantation des écuries : https://duclosnicolas-pixel.github.io/ribel/ribel-ecuries-nord-preview.html
- Sauvegarde historique : `index-avant-ecuries-nord.html`.

## Écuries
- Référence 3D de travail : https://duclosnicolas-pixel.github.io/ribel/ecuries-v53.html (`ecuries-v53.html`).
- V54 rejetée ; rollback de travail vers V53.
- Ensemble en U : 6 boxes de nuit, aile ouest remise, aile est 4 boxes de jour, logement du palefrenier, enceinte, cour et portail.
- Modes Jour/Nuit, lampes commutables, foyer et portes interactives dans la référence autonome.
- **Les modèles actuels des lampes ne plaisent pas au MOA** : refonte historique à proposer/valider, sans casser les commandes.
- Maquette nord = implantation volumétrique simplifiée, pas intégration des maillages détaillés V53 ; position et accès à confirmer.

## Taverne
- Chantier distinct prévu dans `zones/01-village/02-taverne/`, pas encore modélisé dans l'architecture modulaire.

## Personnages
- Identifiants réservés : AA palefrenier, AB tavernier, AC forgeron.
- Personnalités, besoins, mémoire, relations, tâches et modèle 3D à développer séparément des bâtiments.

## Architecture technique
- Dossiers et manifestes de démarrage créés.
- Contrats cible : `docs/CONTRACTS.md`, interfaces d'exemple `core/contracts.js`.
- **Non réalisé** : migration du moteur `index.html` en modules, extraction V53, intégration complète des personnages, chargement dynamique des zones et simulation IA.
- Ne pas déclarer ces fonctions opérationnelles tant que leur code n'a pas été implémenté et testé.

## Prochaine séquence recommandée
1. Valider le contrat de bâtiment et l'emplacement des écuries sur le croquis.
2. Extraire V53 dans `zones/01-village/01-ecuries/` sans renderer secondaire.
3. Prévisualiser l'assemblage sur une carte indépendante.
4. Poursuivre la taverne dans son dossier et les personnages dans `characters/`.
5. Fusionner dans le village principal seulement sur accord MOA.
