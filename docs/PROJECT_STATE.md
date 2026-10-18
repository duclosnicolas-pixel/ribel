# RIBEL — État de référence partagé

Mise à jour : 2026-10-18 (soir). Ce document doit être actualisé après chaque recette ou décision du MOA.

## Gouvernance et intention
- Nicolas : MOA, seul habilité à valider les implantations et mises en production.
- Claude : MOE/AMOA/lead technique ; ChatGPT : **AMOE**/UX/Three.js (confirmé par le MOA le 2026-10-18).
- Monde de Touraine / Loire, environ 1450–1550, priorité à la plausibilité historique et à l'artisanat non industriel.
- Cible mobile Samsung Galaxy Z Fold 6 ; Three.js/WebXR ; zones et personnages autonomes.

## Décisions MOA du 2026-10-18
1. **Huit zones visitables, exactement** — le dépôt les reprend une par une (`zones/01-entree` à `zones/08-maison-futuriste`, `world/world.json`). Forêt, mur d'enceinte et monde lointain sont des décors non visitables déclarés dans `world/world.json`.
2. **Personnages** : prévus, mais non prioritaires (lots T5 à T7, après les zones et l'horizon).
3. **Écuries au nord du village, en plein sur l'axe** : elles sont la porte d'entrée du village — on dépose sa monture, puis on entre dans le village. **Pas d'église au nord : supprimée strictement** (production, prévisualisation, registres, module `04-eglise`).
4. ChatGPT agit en qualité d'AMOE.

## Zones
| ID | Dossier | Zone | État |
|---|---|---|---|
| Z01 | `zones/01-entree` | Entrée | prévue |
| Z02 | `zones/02-chateau-interieur` | Château intérieur (RDC, 1er, 2e, cave, sous-sol) | prévue |
| Z03 | `zones/03-chateau-exterieur` | Château extérieur | prévue |
| Z04 | `zones/04-lac` | Lac | prévue |
| Z05 | `zones/05-village` | Village | production (`index.html`) |
| Z06 | `zones/06-residences-invites` | Résidences des invités | prévue |
| Z07 | `zones/07-vergers-serre` | Vergers et serre exotique | prévue |
| Z08 | `zones/08-maison-futuriste` | Maison futuriste (jamais visible, accès par un chemin en forêt) | prévue |

Bâtiments du village : `zones/05-village/01-ecuries`, `02-taverne`, `03-forge`, `05-habitations` (l'identifiant 04 de l'ancienne église n'est pas réattribué).

## Village
- URL de production : https://duclosnicolas-pixel.github.io/ribel/
- `index.html` : ne pas modifier sans accord du MOA. Dernière modification : suppression de l'église du nord (décision MOA du 2026-10-18) ; la rue nord débouche désormais sur l'emplacement des écuries.
- Sauvegardes : `index-avant-suppression-eglise.html` (état du 13/10), `index-avant-ecuries-nord.html`.
- Prévisualisation d'implantation des écuries : https://duclosnicolas-pixel.github.io/ribel/ribel-ecuries-nord-preview.html — écuries sur l'axe, portail face à la rue nord, sans église.

## Écuries
- Référence 3D de travail : https://duclosnicolas-pixel.github.io/ribel/ecuries-v53.html (`ecuries-v53.html`). V54 rejetée.
- Ensemble en U : 6 boxes de nuit, aile ouest remise, aile est 4 boxes de jour, logement du palefrenier, enceinte, cour et portail.
- Modes Jour/Nuit, lampes commutables, foyer et portes interactives dans la référence autonome.
- **Les modèles actuels des lampes ne plaisent pas au MOA** : refonte historique à proposer/valider, sans casser les commandes.
- Ancrage : x 0, z −70, rotation 0 (axe et position nord décidés par le MOA ; profondeur proposée par la MOE). Portail au sud à z −40,5, parvis pavé de 5,5 m jusqu'au bout de la rue nord (z −35). Emprise x −30 à 30, z −100 à −40,5.
- Point ouvert : arrivée du chemin depuis l'Entrée (Z01), par le nord ou par un côté.

## Taverne
- Chantier distinct prévu dans `zones/05-village/02-taverne/`, pas encore modélisé.

## Personnages
- Identifiants réservés : AA palefrenier, AB tavernier, AC forgeron. Priorité basse (T5 à T7).
- Personnalités, besoins, mémoire, relations, tâches et modèle 3D à développer séparément des bâtiments.

## Architecture technique
- Dossiers et manifestes créés pour les 8 zones.
- Contrats cible : `docs/CONTRACTS.md`, interfaces d'exemple `core/contracts.js`.
- **Non réalisé** : migration du moteur `index.html` en modules, extraction V53, intégration complète des personnages, chargement dynamique des zones et simulation IA.
- Ne pas déclarer ces fonctions opérationnelles tant que leur code n'a pas été implémenté et testé.

## Contrôle technique MOE du 2026-10-18
Navigateur sans écran, rendu logiciel : contrôle de chargement et de charge, **pas une recette sur appareil**.

| Page | Erreurs JS | Appels de rendu / image | Triangles / image |
|---|---|---|---|
| `index.html` (sans église) | aucune | 23 à 30 selon la vue | 27 000 |
| `ribel-ecuries-nord-preview.html` | aucune | 24 à 126 selon la vue | 28 000 |
| `ecuries-v53.html` | aucune | 2 167 | 179 000 |

- Budgets Quest 2 par œil : 72 i/s, ≤ 100 appels, ≤ 300 000 triangles. Le village les tient.
- La maquette volumétrique des écuries dépasse déjà 100 appels quand elle est dans le champ (un maillage par pièce) : sans conséquence pour une maquette, mais confirme la contrainte du module.
- **Dette technique écuries V53** : environ 20 fois le budget d'appels (maillages isolés, pièces répétées non instanciées, matériaux PBR, ombres PCF douces, 10 lumières ponctuelles). Condition d'intégration : fusion des pièces statiques par matériau, instanciation des répétitions, matériaux Lambert, une seule ombre directionnelle, lampes en émissif avec deux lumières au plus. Cible : ≤ 40 appels pour l'ensemble.

## Point restant à arbitrer
- Référentiels : `base/` (décisions MOA, registres) et ce document coexistent ; fusion dans `docs/` proposée par la MOE.

## Prochaine séquence recommandée
1. Recette MOA de la suppression de l'église et de l'implantation des écuries sur l'axe (Fold 6).
2. Extraire V53 dans `zones/05-village/01-ecuries/` sans renderer secondaire, en ramenant le module sous 40 appels de rendu.
3. Prévisualiser l'assemblage sur une carte indépendante.
4. Poursuivre la taverne dans son dossier ; personnages plus tard.
5. Fusionner dans le village principal seulement sur accord MOA.
