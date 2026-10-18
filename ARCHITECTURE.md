# RIBEL — architecture modulaire

Le village principal `index.html` reste inchangé jusqu'à validation explicite. Les dossiers introduits sont des espaces de développement et ne sont pas encore branchés au moteur existant.

## Organisation
- `core/` : scène Three.js, caméra, rendu, chargement, cycle de vie.
- `world/` : carte, repère global, emplacements, chemins, limites et navigation.
- `zones/` : les huit zones visitables décidées par le MOA — `01-entree`, `02-chateau-interieur`, `03-chateau-exterieur`, `04-lac`, `05-village` (bâtiments du village), `06-residences-invites`, `07-vergers-serre`, `08-maison-futuriste`.
- Décors non visitables (forêt, mur d'enceinte, monde lointain) : déclarés dans `world/world.json`.
- `characters/AA-palefrenier/` etc. : modèles, état, comportement, personnalité, relations.
- `systems/` : temps, besoins, économie, dialogues, interactions, simulation hors champ.
- `assets/` : matériaux et ressources communes.
- `previews/` : tests indépendants (les anciennes pages restent à la racine pour préserver leurs URLs).
- `legacy/` : archives éventuelles après validation, sans déplacement automatique.

## Contrat d'intégration (cible)
Chaque module de zone exportera `createZone(context)` et `dispose()`. Chaque bâtiment exportera `createBuilding(context, config)` et un manifeste d'identité, emprise, ancrage, entrées, collisions et points d'interaction. Chaque personnage possédera un identifiant stable, une représentation graphique et un état persistant séparé de sa zone. Les coordonnées mondiales sont exprimées en mètres : x est-ouest, y hauteur, z nord-sud (nord = z négatif dans la maquette actuelle).

## Règles
1. Développer et valider les modules en prévisualisation avant de les intégrer.
2. Ne pas copier les boucles de rendu, lumières globales ou contrôles d'une scène autonome dans le monde : les adapter à l'API du moteur.
3. Un seul moteur central, plusieurs zones chargeables et déchargeables.
4. Les personnages peuvent traverser les zones ; leur identité et état ne dépendent pas d'un bâtiment.
5. Préserver les performances sur Galaxy Z Fold 6 : instancing, culling, chargement différé et budget de rendu.
6. Les données de placement sont séparées des modèles 3D ; le croquis et l'implantation nord restent à valider.

## État de migration
- `ecuries-v53.html` : page de modélisation de référence des écuries ; ne pas remplacer.
- `zones/05-village/01-ecuries/index.js` : premier module de bâtiment au contrat `createBuilding` (2026-10-18) ; géométrie générée depuis la page de référence par `tools/extract-ecuries-v53.mjs`.
- `core/static-merge.js` et `core/hinged-parts.js` : regroupement des pièces fixes par matériau et portes pivotant dans le shader — à réutiliser pour chaque bâtiment.
- `ribel-ecuries-nord-preview.html` : village + vrai modèle des écuries, chargé comme module (plus de maquette volumétrique).
- `index.html` : village principal conservé ; église du nord supprimée le 2026-10-18 (sauvegarde `index-avant-suppression-eglise.html`).
- `index-avant-ecuries-nord.html` : sauvegarde existante.

Les dossiers contiennent initialement des manifestes/documentations. La migration du code Three.js vers des modules ES devra être réalisée par étapes avec recette mobile.
