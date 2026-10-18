# Écuries — module de bâtiment (zone Z05 Village)

## Implantation (décision MOA du 2026-10-18)
- Au nord du village, en plein sur l'axe de la rue nord : les écuries sont la porte d'entrée du village — on y dépose sa monture, puis on entre dans le village. Il n'y a pas d'église au nord.
- Ancrage monde : x 0, z −72, rotation 0. Portail au sud, face à la rue nord (z −39,7) ; bande de pierre jusqu'à z −35,8 ; raccord pavé jusqu'au bout de la rue (z −35). Emprise : x −30,5 à 30,5, z −100 à −35,8.
- Point ouvert : arrivée du chemin depuis l'Entrée (Z01), par le nord ou par un côté.

## Fichiers
- `ecuries-v53.html` (racine) : **page de modélisation de référence**. C'est là que l'AMOE poursuit la modélisation.
- `v53-geometry.js` : **généré** à partir de la page de référence par `node tools/extract-ecuries-v53.mjs [page.html]`. Ne pas le modifier à la main.
- `index.js` : module `createBuilding(context, config)` — ancrage, regroupement des pièces fixes, portes pivotantes, points d'interaction, collisions, sol praticable, mise à jour, nettoyage.
- Prévisualisations : [module seul](../../../previews/ecuries-module.html) et [dans le village](../../../ribel-ecuries-nord-preview.html) (`?fusion=0` pour comparer avec les pièces séparées).

## Rendu
- Les pièces fixes sont regroupées par matériau (`core/static-merge.js`) ; les 13 portes et vantaux sont dessinés ensemble et pivotent dans le shader (`core/hinged-parts.js`). Rendu identique pixel à pixel à la V53 en pièces séparées, portes fermées comme ouvertes.
- Mesures du 2026-10-18 (navigateur sans écran — pas une recette) : module seul 32 à 36 appels de rendu et 110 000 triangles ; dans le village 53 à 76 appels au total ; sans regroupement, 1 230 à 1 622 appels.
- Les lumières ponctuelles de la V53 sont retirées par défaut (`dynamicLights: false`) : elles pèseraient sur tout le village. Flammes, mèches et vitres restent lumineuses. Elles reviendront avec le mode nuit (lot T8).
- Pas de renderer, de caméra, de boucle ni d'éclairage global dans le module.

## Règles pour poursuivre la modélisation dans `ecuries-v53.html` (ou une version suivante)
L'extraction repère ces jalons dans la page ; les conserver tels quels :
1. `const mat=(c,roughness=1)=>` ouvre la partie extraite ;
2. `// Optimisation mobile : ombres moins coûteuses` ferme la première partie (mode Marche et vues orbitales exclus) ;
3. `function batchStaticBoxes(root){` ouvre la seconde partie ;
4. `renderer.setAnimationLoop(` la ferme.

Conserver aussi les noms utilisés par le module : `group`, `interactiveDoors` (chaque porte : `pivot` à charnière verticale, `kind`, `open`, `angle`, `side` pour le portail), `lightTargets`, `fireFlames`, `wallFlames`, `wick`, `hearthGlow`, `homeLight`, `courtyardNightLights`, `warmGlass`, `west`, `east`, `north`, `south`, `gateHalf`, `wallTh`, `fireOn`, `lampsOn`, `allLampsEnabled`, `nightMode`, `setLighting`, `applyLampSwitch`, `applyDayNight`.
Tout objet ajouté à `group` est intégré automatiquement. Un objet qui doit bouger doit être déclaré comme porte (pivot) ou comme flamme, sinon il sera figé par le regroupement.

Après une nouvelle version validée par le MOA : relancer l'extraction, vérifier les deux prévisualisations, consigner les mesures ici et dans `docs/PROJECT_STATE.md`.

## Reste à faire
- Refonte des lampes (modèles actuels rejetés par le MOA), dans la page de référence.
- Arrivée du chemin depuis l'Entrée.
- Interactions au casque (lot T6) : aujourd'hui, portes, foyer et lampes s'actionnent au doigt dans la prévisualisation.
- Intégration à `index.html` : uniquement après recette du MOA.
