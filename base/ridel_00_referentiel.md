# Ribel — référentiel projet

État au 18 octobre 2026. Le dépôt GitHub fait foi pour le code et l'état partagé (`docs/PROJECT_STATE.md`) ; ce référentiel garde les décisions de la MOA, le registre des zones et les points à arbitrer.

## Gouvernance (mise à jour du 18 octobre)
- MOA : Nicolas, seul habilité à valider implantations, recettes et mises en production.
- MOE et responsable technique (techlead) : Claude — architecture, moteur partagé (`core/`), contrats de modules, intégration au monde, budgets de rendu, revue technique des livraisons.
- ChatGPT : assistance (AMOA/AMOE selon les documents), UX et modélisation 3D Three.js — bâtiments, décors, prévisualisations.
- À harmoniser : la description du projet claude.ai nomme ChatGPT « AMOA », `CLAUDE.md` le nomme « AMOE » et attribue l'AMOA à Claude.

## Sources de vérité et méthode (fixées dans le dépôt)
- Dépôt : https://github.com/duclosnicolas-pixel/ribel — public, publié par GitHub Pages : https://duclosnicolas-pixel.github.io/ribel/
- À lire en début de chantier : `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/WORKFLOW.md`, `docs/CONTRACTS.md`, puis le manifeste du module.
- Un chantier = une zone, un bâtiment, un personnage ou un système, dans son dossier, avec manifeste et prévisualisation isolée.
- `index.html` (village en production) n'est modifié qu'avec l'accord de la MOA ; aucune prévisualisation n'y est fusionnée sans recette.
- Un seul moteur : un renderer, une boucle de rendu, une carte de coordonnées (mètres ; x est, y haut, z sud).
- Un contrôle technique n'est jamais présenté comme une recette sur appareil.
- Dossier de lancement (Claude Docs) : https://claude.ai/code/artifact/bd6028bb-7f17-4f38-bf00-880b98a53949

## Décisions MOA du 11 octobre 2026 (toujours en vigueur sauf mention)
- A1 Site : château de l'Islette, Azay-le-Rideau (≈ 47,268 N ; 0,435 E).
- A2 Époque : vers 1500 ; le dépôt retient Touraine / Loire 1450–1550, artisanat non industriel.
- A3 Monastère et cimetière au sud du village.
- A4 Maison futuriste jamais visible, au fond de la forêt, accessible par un seul chemin.
- A5 Forêt : décor d'horizon, non visitable hors chemin.
- A6 Place du marché ovale 80 m × 28 m.
- A7 Limite du monde : mur d'enceinte sur l'emprise de l'ancienne voie ferrée.
- A8 Hébergement GitHub, dépôt « ribel ».
- PNJ supprimés le 11 octobre — voir écart n° 2 ci-dessous.

## État au 18 octobre
- Village (production, `index.html`) : refonte graphique du 13 octobre (teintes, cheminées, portes, fenêtres instanciées). Sauvegarde : `index-avant-ecuries-nord.html`.
- Écuries : référence de travail `ecuries-v53.html` (U de 6 boxes de nuit, 4 boxes de jour, remise, logement du palefrenier, cour, enceinte, portail ; jour/nuit, lampes, foyer, portes). V54 rejetée. Lampes à redessiner. Implantation provisoire au nord/nord-est de l'église (x 43, z −83), maquette `ribel-ecuries-nord-preview.html`.
- Architecture modulaire : dossiers, manifestes et contrats v0.1 posés ; moteur non encore extrait de `index.html`, zones non chargées dynamiquement.
- Taverne, forge : dossiers prévus, non modélisés.

## Contrôle technique MOE du 18 octobre (navigateur sans écran, rendu logiciel — pas une recette)
| Page | Erreurs JS | Appels de rendu / image | Triangles / image |
|---|---|---|---|
| `index.html` (village) | aucune | 23 | 26 900 |
| `ribel-ecuries-nord-preview.html` | aucune | 24 | 26 900 |
| `ecuries-v53.html` | aucune | **2 167** | 179 000 |

- Le village tient largement les budgets Quest 2 (≤ 100 appels, ≤ 300 000 triangles par œil).
- Les écuries V53 dépassent le budget d'appels d'un facteur 20 : environ 50 maillages isolés et des centaines de pièces répétées, matériaux PBR, ombres douces, 10 lumières ponctuelles. Acceptable en prévisualisation téléphone, intenable en VR une fois posé dans le village.
- Condition d'intégration proposée : fusion des pièces statiques par matériau, instanciation des répétitions (boxes, piliers, lanternes), matériaux Lambert, une seule ombre directionnelle, lampes en émissif avec deux lumières au plus. Cible : ≤ 40 appels pour l'ensemble des écuries.

## Écarts à arbitrer par la MOA
1. Découpage des zones : le dépôt a 4 secteurs (village, château, campagne, forêt), la décision du 11 octobre 8 zones visitables. Proposition MOE : garder les 4 secteurs comme dossiers et les 8 zones comme unités de chargement — village ⊃ Z05 ; château ⊃ Z01, Z02, Z03 ; campagne ⊃ Z04, Z06, Z07 ; forêt = décor d'horizon ⊃ chemin et Z08.
2. Personnages : PNJ supprimés le 11 octobre, mais palefrenier (AA), tavernier (AB) et forgeron (AC) réservés dans `characters/`. Réintroduction à confirmer ; Angie et Kara (T7) restent en attente.
3. Emplacement des écuries : à valider sur le croquis.
4. Deux référentiels dans le dépôt (`base/` et `docs/PROJECT_STATE.md`) : proposition de fondre `base/` dans `docs/` (décisions dans `docs/DECISIONS.md`, zones dans `world/world.json`).

## Choix techniques
- WebXR + Three.js r170, un seul code pour Quest 2 (VR) et Galaxy Z Fold 6 (tactile).
- Contrats v0.1 : `createBuilding(context, config)`, `createZone(context, zoneConfig)`, `createCharacter(context, definition)` ; bus d'événements ; personnages indépendants des bâtiments.
- Deux couches : monde lointain toujours chargé, zone active en détail ; transitions par fondu ; voyage rapide.
- Téléportation façon RE4 (arc, orientation, rotation 45°, demi-tour) ; téléphone : toucher pour se téléporter, glisser pour regarder.
- Budgets par œil : 72 i/s, ≤ 100 appels, ≤ 300 000 triangles ; instanciation, fusion, rendu fovéal, éclairage simple compatible T8/T9.
- Relief : LiDAR HD IGN ; RGE ALTI en secours.

## Séquencement (README de la MOA)
T1 place du village et fontaine → T2 téléportation façon RE4 → T3 séparation des zones → T4 horizon → T5 bots et personnages → T6 interactions → T7 Angie, Kara → T8 horaires → T9 saisons.

## Points ouverts
- Butte de liaison (avec monastère et cimetière dans la liste T3) : à situer.
- Moulin : rattachement au château extérieur.
- Recette Fold 6 et Quest 2 du village : relevé « Diagnostic » attendu.
