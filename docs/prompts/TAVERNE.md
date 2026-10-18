# Prompt de démarrage — chantier de la taverne RIBEL

Tu ouvres un **chantier indépendant de modélisation 3D pour la taverne** du village RIBEL, monde Three.js/WebXR de Touraine / vallée de la Loire vers 1450–1550.

**Dépôt** : https://github.com/duclosnicolas-pixel/ribel

## Avant toute modification
Lis directement sur GitHub : `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/WORKFLOW.md`, `docs/CONTRACTS.md`, `zones/01-village/zone.json` et `zones/01-village/02-taverne/manifest.json`. Examine aussi le village réel `index.html` et les zones voisines sans les modifier.

## Gouvernance et organisation
Je suis le MOA. Claude est MOE/AMOA/responsable technique ; ChatGPT est AMOE/UX/développeur 3D. Tu dois me soumettre les décisions architecturales et attendre mes validations explicites.

Développe la taverne dans `zones/01-village/02-taverne/`, avec un manifeste propre, une prévisualisation indépendante et une interface compatible avec `createBuilding(context, config)`. Ne touche pas aux écuries, aux personnages ni à `index.html` sans accord. Le village n'a qu'un seul moteur de rendu, une seule caméra, une seule boucle de mise à jour et une carte de coordonnées partagée.

## Programme à concevoir
Propose une taverne historiquement crédible, adaptée au contexte social, économique et architectural de RIBEL : volume, emprise, implantation dans la rue, accès, salle commune, foyer, cuisine/service, réserves, éventuel hébergement et cour de service selon pertinence historique. La proposition doit distinguer ce qui est attesté, plausible ou encore à arbitrer.

Éviter les clichés médiévaux fantaisistes, les luminaires industriels, les symétries mécaniques et les matériaux trop réguliers. Modéliser réellement pierre, enduits à la chaux, charpentes en chêne, assemblages artisanaux, ferronnerie et mobilier du XVe siècle.

## Interactions et personnages
Prévoir les entrées, collisions, portes et points d'interaction. Le futur **AB — tavernier** est un personnage indépendant dans `characters/AB-tavernier/` : son identité, ses besoins, sa mémoire, ses relations et ses décisions ne doivent pas être codés dans le bâtiment. La taverne expose seulement des services et événements (service, comptoir, foyer, chambres, tables, accès).

Prévoir l'interopérabilité future avec l'économie, l'horloge, les déplacements et les autres habitants via `systems/`.

## Méthode de livraison
1. Étudier la carte et proposer 1 implantation argumentée avec dimensions et accès ; ne pas considérer la position comme validée.
2. Soumettre programme architectural, plans fonctionnels et arbitrages historiques.
3. Après mon feu vert, construire la vraie scène 3D Three.js, pas des images.
4. Versionner les prévisualisations avec URLs GitHub Pages vérifiées et commits.
5. Contrôler la syntaxe, les interactions, les collisions, les ressources et les performances sur Samsung Galaxy Z Fold 6 ; attendre ma recette.
6. Actualiser `zones/01-village/02-taverne/manifest.json` et `docs/PROJECT_STATE.md` après les décisions.
7. N'intégrer au village principal qu'après mon accord explicite.

**Commence par lire les documents de projet et proposer l'emplacement et le programme architectural de la taverne. Ne produis aucune image conceptuelle non demandée.**
