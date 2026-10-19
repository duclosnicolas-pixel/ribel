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

## Maquette village 3D/VR — recette proposée 2026-10-19
- Le MOA a validé la **maquette aérienne de principe** : place centrale ovale sur axe N/S, deux anneaux de maisons et voies, commerces Boulanger/Taverne/Auberge/Armurier/Forgeron, sorties cardinales vers zones distinctes.
- Le chemin du château **contourne les écuries par l'est, en courbe, à l'extérieur de l'enceinte** ; il ne traverse ni boxes ni cour.
- Première traduction **réelle Three.js/WebXR** par ChatGPT AMOE : `ribel-village-maquette-v1.html`, https://duclosnicolas-pixel.github.io/ribel/ribel-village-maquette-v1.html. Maillages de bâtiments, rues annulaires, déplacement/VR et caméra aérienne. Réutilise les **vraies écuries V53** ; `index.html` intact.
- Cette géométrie et ses dimensions restent **en attente de recette MOA** sur Galaxy Z Fold 6 ; ne pas prétendre qu'elles sont validées par la seule approbation de l'image.
- Description détaillée, périmètre de zone, limites et étapes : `docs/MAQUETTE_VILLAGE_3D.md`.
- Claude/MOE effectue toute intégration de la version validée, après accord explicite du MOA. Préserver les zones forêt, verger/greniers/serres, paroisse/cloître/cimetières, château distinctes.

## Village
- URL de production : https://duclosnicolas-pixel.github.io/ribel/
- `index.html` : ne pas modifier sans accord du MOA. Dernière modification : suppression de l'église du nord (décision MOA du 2026-10-18) ; la rue nord débouche désormais sur l'emplacement des écuries.
- Sauvegardes : `index-avant-suppression-eglise.html` (état du 13/10), `index-avant-ecuries-nord.html`.
- Prévisualisation du village avec les écuries : https://duclosnicolas-pixel.github.io/ribel/ribel-ecuries-nord-preview.html — **vrai modèle V53**, au sol, sur l'axe, portail face à la rue nord, sans église. Boutons « Devant les écuries » et « Dans la cour » ; portes, portail, foyer et lampes s'actionnent au doigt.
- `ribel-ecuries-nord-v2.html` (AMOE, 18/10 soir) : **obsolète** — écuries hors axe (x 43) et contournement d'une église supprimée, contraires à la décision du MOA.

## Écuries
- Référence 3D de travail : https://duclosnicolas-pixel.github.io/ribel/ecuries-v53.html (`ecuries-v53.html`). V54 rejetée.
- Ensemble en U : 6 boxes de nuit, aile ouest remise, aile est 4 boxes de jour, logement du palefrenier, enceinte, cour et portail.
- Modes Jour/Nuit, lampes commutables, foyer et portes interactives dans la référence autonome.
- **Les modèles actuels des lampes ne plaisent pas au MOA** : refonte historique à proposer/valider, sans casser les commandes.
- Ancrage : x 0, z −72, rotation 0 (axe et position nord décidés par le MOA ; profondeur proposée par la MOE). Portail au sud à z −39,7, bande de pierre jusqu'à z −35,8, raccord pavé jusqu'au bout de la rue nord (z −35). Emprise x −30,5 à 30,5, z −100 à −35,8.
- **Module extrait le 2026-10-18 (MOE)** : `zones/05-village/01-ecuries/index.js`, géométrie V53 reprise à l'identique par `tools/extract-ecuries-v53.mjs`. Prévisualisation du module seul : https://duclosnicolas-pixel.github.io/ribel/previews/ecuries-module.html. Retour MOA du 18/10 traité : l'ancienne maquette en volumes simplifiés « n'avait rien à voir » avec la modélisation et flottait (boîtes centrées posées comme si leur base était à zéro : murs entre 0,85 et 2,55 m, à hauteur de menton) ; elle est remplacée par le vrai modèle, posé au sol.
- La modélisation continue dans la page autonome ; une nouvelle version validée est réintégrée en relançant l'extraction (règles dans le README du module).
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
| `ribel-ecuries-nord-preview.html` (village + vraies écuries) | aucune | 53 à 76 selon la vue | 134 000 à 139 000 |
| `previews/ecuries-module.html` (module seul) | aucune | 32 à 36 | 110 000 |
| `ecuries-v53.html` | aucune | 2 167 | 179 000 |

- Budgets Quest 2 par œil : 72 i/s, ≤ 100 appels, ≤ 300 000 triangles. Le village les tient.
- Écuries intégrées : regroupement des pièces fixes par matériau et portes pivotant dans le shader ; de 1 230–1 622 appels (pièces séparées) à 53–76, **sans écart visuel** (comparaison pixel à pixel, portes fermées et ouvertes).
- **Dette technique écuries V53** : environ 20 fois le budget d'appels (maillages isolés, pièces répétées non instanciées, matériaux PBR, ombres PCF douces, 10 lumières ponctuelles). Condition d'intégration : fusion des pièces statiques par matériau, instanciation des répétitions, matériaux Lambert, une seule ombre directionnelle, lampes en émissif avec deux lumières au plus. Cible : ≤ 40 appels pour l'ensemble.

## Point restant à arbitrer
- Référentiels : `base/` (décisions MOA, registres) et ce document coexistent ; fusion dans `docs/` proposée par la MOE.

## Prochaine séquence recommandée
1. Recette MOA sur Fold 6 de la prévisualisation du village avec les vraies écuries.
2. Refonte des lampes dans la page autonome (AMOE), puis nouvelle extraction (MOE).
3. Arrivée du chemin depuis l'Entrée jusqu'aux écuries.
4. Poursuivre la taverne dans son dossier ; personnages plus tard.
5. Fusionner dans le village principal seulement sur accord MOA.
