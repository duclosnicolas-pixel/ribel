# Prompt de reprise — chantier des écuries RIBEL

Tu reprends le chantier des **écuries du village RIBEL**, monde Three.js/WebXR historiquement inspiré de la Touraine / Loire au XVe siècle (environ 1450–1550).

**Dépôt** : https://github.com/duclosnicolas-pixel/ribel

## Avant toute modification
Lis directement sur GitHub, dans cet ordre : `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/WORKFLOW.md`, `docs/CONTRACTS.md`, `zones/05-village/01-ecuries/manifest.json` et `zones/05-village/01-ecuries/README.md`. Vérifie l'état réel du code et des derniers commits.

## Gouvernance et méthode
Je suis le maître d'ouvrage (MOA). Claude intervient comme MOE/AMOA et responsable technique ; ChatGPT comme AMOE/UX/développeur 3D. Les validations appartiennent au MOA. Une recette mobile n'est acquise que lorsque je la confirme explicitement.

Travaille **uniquement** dans `zones/05-village/01-ecuries/` et dans des prévisualisations indépendantes, sauf autorisation de modifier un module partagé. Respecte le contrat `createBuilding(context, config)` et ses interfaces de cycle de vie, collisions, entrées, interactions, placement et ressources. Ne duplique pas le renderer, la caméra, les lumières globales ou la boucle principale du village.

## Références
- Version 3D de travail : https://duclosnicolas-pixel.github.io/ribel/ecuries-v53.html (`ecuries-v53.html`).
- **V54 rejetée : ne pas en reprendre les changements.**
- Prévisualisation volumétrique de situation : https://duclosnicolas-pixel.github.io/ribel/ribel-ecuries-nord-preview.html ; elle n'est PAS l'intégration détaillée de la V53.
- Village principal : https://duclosnicolas-pixel.github.io/ribel/ ; ne pas modifier `index.html` sans mon accord.

## Programme
Écuries en U : six boxes de nuit fermés au nord, remise/abri à voitures à l'ouest, quatre boxes de jour semi-ouverts à l'est, logement du palefrenier célibataire, cour pavée, enceinte de pierre et portail. Portes, portail, mode Marche, collisions, modes Jour/Nuit, commandes des lampes et du foyer doivent rester fonctionnels.

Les **lampes actuelles ne conviennent pas** : prévoir leur refonte historiquement plausible, mais ne pas modifier leurs modèles sans validation. Ne pas confondre cette réserve avec un rejet des commandes d'éclairage.

Décision MOA du 2026-10-18 : les écuries sont **au nord du village, en plein sur l'axe de la rue nord**. Elles sont la porte d'entrée du village : on y dépose sa monture, puis on entre dans le village. **Il n'y a pas d'église au nord** (supprimée). Ancrage x 0, z −72, rotation 0 ; portail au sud, face à la rue nord (z −39,7). L'arrivée du chemin depuis l'Entrée reste à concevoir.

**Extraction réalisée par la MOE le 2026-10-18** : la V53 est intégrée telle quelle au village par le module `zones/05-village/01-ecuries/index.js` ; sa géométrie est **générée** depuis `ecuries-v53.html` par `tools/extract-ecuries-v53.mjs`. Continue donc la modélisation dans la page autonome (nouvelle version, ex. `ecuries-v55.html`), en respectant les jalons et les noms listés dans `zones/05-village/01-ecuries/README.md`. Ne modifie jamais `v53-geometry.js` à la main. Ne crée plus de maquette en volumes simplifiés pour l'implantation : la prévisualisation `ribel-ecuries-nord-preview.html` montre le vrai modèle.

Budget de rendu du module : **40 appels au plus** pour l'ensemble. Il est tenu par le regroupement automatique (32 à 36 appels) ; un objet qui doit bouger doit être déclaré comme porte ou comme flamme, sinon il sera figé.

## Travail demandé
1. Auditer la V53, la maquette d'implantation et les contrats modulaires.
2. Extraire progressivement les véritables modèles 3D V53 vers un module de bâtiment autonome, en préservant la scène source et ses URLs.
3. Déclarer manifeste, dimensions, ancrage, entrées, points d'interaction, collisions, ressources et nettoyage.
4. Tester d'abord le module seul, puis dans une **prévisualisation de carte** commune, sans toucher au village principal.
5. Préserver les performances sur Samsung Galaxy Z Fold 6 ; vérifier les références JS et l'ordre d'initialisation, puis demander ma recette.
6. Après chaque livraison, publier le commit et l'URL, actualiser le manifeste et `docs/PROJECT_STATE.md`.

Exigence artistique : vraie modélisation **3D Three.js**, pas d'images de substitution ; matériaux et assemblages artisanaux crédibles du XVe siècle, sans précision industrielle moderne. Préserver les choix déjà validés et proposer des changements ciblés et réversibles.

**Commence par un audit technique concis de la V53 et une proposition de découpage modulaire, puis passe à l'implémentation dans le dépôt.**
