# RIBEL — Texte de reprise pour une nouvelle conversation

> Je travaille sur le projet RIBEL, monde médiéval de Touraine vers 1450–1550, en Three.js/WebXR. Dépôt : https://github.com/duclosnicolas-pixel/ribel. Lis d'abord `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/WORKFLOW.md` et `docs/CONTRACTS.md` directement sur GitHub. Je suis le MOA. Respecte la modularisation : zones dans `zones/`, bâtiments par sous-dossier, personnages indépendants dans `characters/`, moteur partagé dans `core/`. Ne touche pas à `index.html` sans mon accord. Travaille sur le module **[NOM DU CHANTIER]**, consulte son manifeste et crée une prévisualisation Three.js indépendante. Publie le commit et le lien, puis attends ma recette mobile. Ne propose pas d'images en remplacement du code 3D. Le fichier `docs/PROJECT_STATE.md` est notre état de référence partagé, à mettre à jour après décision ou recette.

## Exemples de chantiers
- Écuries : `zones/01-village/01-ecuries/` ; base `ecuries-v53.html`.
- Taverne : `zones/01-village/02-taverne/`.
- Palefrenier : `characters/AA-palefrenier/`.

Les nouveaux assistants n'ont pas forcément accès aux anciennes conversations ; ils doivent relire GitHub à chaque reprise.

## Prompts spécialisés à copier

- **Écuries** : [`docs/prompts/ECURIES.md`](prompts/ECURIES.md) — V53, extraction modulaire, implantation nord, recette mobile.
- **Taverne** : [`docs/prompts/TAVERNE.md`](prompts/TAVERNE.md) — programme architectural, nouvelle modélisation et intégration différée.

Ces prompts sont les références de reprise pour les conversations dédiées ; relire également l'état courant du dépôt.
