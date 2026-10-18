# Ribel — référentiel projet

État au 18 octobre 2026 (soir). Le dépôt GitHub fait foi pour le code et l'état partagé (`docs/PROJECT_STATE.md`) ; ce référentiel garde les décisions de la MOA et les registres.

## Gouvernance
- MOA : Nicolas, seul habilité à valider implantations, recettes et mises en production.
- MOE, AMOA et responsable technique (techlead) : Claude — architecture, moteur partagé (`core/`), contrats de modules, intégration au monde, budgets de rendu, revue technique des livraisons.
- AMOE, UX et modélisation 3D Three.js : ChatGPT (confirmé par la MOA le 18 octobre) — bâtiments, décors, prévisualisations.

## Sources de vérité et méthode
- Dépôt : https://github.com/duclosnicolas-pixel/ribel — public, publié par GitHub Pages : https://duclosnicolas-pixel.github.io/ribel/
- À lire en début de chantier : `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/WORKFLOW.md`, `docs/CONTRACTS.md`, puis le manifeste du module. Prompts de reprise : `docs/prompts/ECURIES.md`, `docs/prompts/TAVERNE.md`.
- Un chantier = une zone, un bâtiment, un personnage ou un système, dans son dossier, avec manifeste et prévisualisation isolée.
- `index.html` (village en production) n'est modifié qu'avec l'accord de la MOA.
- Un seul moteur : un renderer, une boucle de rendu, une carte de coordonnées (mètres ; x est, y haut, z sud).
- Un contrôle technique n'est jamais présenté comme une recette sur appareil.

## Décisions MOA du 11 octobre 2026
- A1 Site : château de l'Islette, Azay-le-Rideau (≈ 47,268 N ; 0,435 E).
- A2 Époque : vers 1500 ; le dépôt retient Touraine / Loire 1450–1550, artisanat non industriel.
- A3 Monastère et cimetière au sud du village.
- A4 Maison futuriste jamais visible, au fond de la forêt, accessible par un seul chemin.
- A5 Forêt : décor d'horizon, non visitable hors chemin.
- A6 Place du marché ovale 80 m × 28 m.
- A7 Limite du monde : mur d'enceinte sur l'emprise de l'ancienne voie ferrée.
- A8 Hébergement GitHub, dépôt « ribel ».

## Décisions MOA du 18 octobre 2026
- B1 Zones : le dépôt reprend exactement les 8 zones visitables (dossiers `zones/01-entree` à `zones/08-maison-futuriste`) ; forêt, mur d'enceinte et monde lointain sont des décors non visitables.
- B2 Personnages : prévus, mais non prioritaires (T5 à T7, après les zones et l'horizon).
- B3 Écuries au nord du village, en plein sur l'axe : porte d'entrée du village — on dépose sa monture, puis on entre dans le village. Pas d'église au nord : supprimée strictement.
- B4 ChatGPT agit en qualité d'AMOE.

## Zones visitables
| ID | Dossier | Zone |
|---|---|---|
| Z01 | `zones/01-entree` | Entrée |
| Z02 | `zones/02-chateau-interieur` | Château intérieur (RDC, 1er, 2e, cave, sous-sol) |
| Z03 | `zones/03-chateau-exterieur` | Château extérieur |
| Z04 | `zones/04-lac` | Lac |
| Z05 | `zones/05-village` | Village (place 80 × 28 m, fontaine, écuries au nord, monastère et cimetière au sud) |
| Z06 | `zones/06-residences-invites` | Résidences des invités |
| Z07 | `zones/07-vergers-serre` | Vergers et serre exotique |
| Z08 | `zones/08-maison-futuriste` | Maison futuriste |

## État au 18 octobre
- Village (production, `index.html`) : refonte graphique du 13 octobre ; église du nord supprimée le 18 octobre (sauvegarde `index-avant-suppression-eglise.html`). La rue nord débouche sur l'emplacement des écuries.
- Écuries : référence de travail `ecuries-v53.html` (U de 6 boxes de nuit, 4 boxes de jour, remise, logement du palefrenier, cour, enceinte, portail ; jour/nuit, lampes, foyer, portes). V54 rejetée. Lampes à redessiner. Ancrage x 0, z −72, rotation 0 ; portail au sud face à la rue nord (z −39,7). Module extrait le 18 octobre (`zones/05-village/01-ecuries/index.js`, géométrie V53 à l'identique) : le vrai modèle est visible dans le village sur `ribel-ecuries-nord-preview.html` (32 à 36 appels de rendu pour les écuries, 53 à 76 pour l'ensemble). L'ancienne maquette en volumes, jugée hors sujet et flottante par la MOA, est retirée.
- Architecture modulaire : dossiers des 8 zones, manifestes et contrats v0.1 posés ; moteur non encore extrait de `index.html`, zones non chargées dynamiquement.
- Taverne, forge : dossiers prévus, non modélisés.

## Contrôle technique MOE du 18 octobre (navigateur sans écran, rendu logiciel — pas une recette)
| Page | Erreurs JS | Appels de rendu / image | Triangles / image |
|---|---|---|---|
| `index.html` (sans église) | aucune | 23 à 30 selon la vue | 27 000 |
| `ribel-ecuries-nord-preview.html` (village + vraies écuries) | aucune | 53 à 76 selon la vue | 134 000 à 139 000 |
| `ecuries-v53.html` | aucune | 2 167 | 179 000 |

- Le village tient les budgets Quest 2 (≤ 100 appels, ≤ 300 000 triangles par œil).
- Écuries V53 seules : 2 167 appels dans leur page autonome ; intégrées au village après regroupement des pièces fixes et portes pivotant dans le shader : 32 à 36 appels, sans écart visuel.

## Choix techniques
- WebXR + Three.js r170, un seul code pour Quest 2 (VR) et Galaxy Z Fold 6 (tactile).
- Contrats v0.1 : `createBuilding(context, config)`, `createZone(context, zoneConfig)`, `createCharacter(context, definition)` ; bus d'événements ; personnages indépendants des bâtiments.
- Deux couches : monde lointain toujours chargé, zone active en détail ; transitions par fondu ; voyage rapide.
- Téléportation façon RE4 (arc, orientation, rotation 45°, demi-tour) ; téléphone : toucher pour se téléporter, glisser pour regarder.
- Budgets par œil : 72 i/s, ≤ 100 appels, ≤ 300 000 triangles.
- Relief : LiDAR HD IGN ; RGE ALTI en secours.

## Séquencement (README de la MOA)
T1 place du village et fontaine → T2 téléportation façon RE4 → T3 séparation des zones → T4 horizon → T5 bots et personnages → T6 interactions → T7 Angie, Kara → T8 horaires → T9 saisons.

## Points ouverts
- Arrivée du chemin depuis l'Entrée jusqu'aux écuries : par le nord ou par un côté.
- Butte de liaison (avec monastère et cimetière dans la liste T3) : à situer.
- Moulin : rattachement au château extérieur.
- Fusion de `base/` dans `docs/` : proposée par la MOE.
- Recette Fold 6 et Quest 2 du village : relevé « Diagnostic » attendu.
