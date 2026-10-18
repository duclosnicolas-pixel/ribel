# RIBEL — Instructions permanentes pour Claude

**Lire dans cet ordre** : `AGENTS.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/WORKFLOW.md`, `docs/CONTRACTS.md`, puis les manifestes du module concerné.

## Gouvernance
- Nicolas : maître d'ouvrage (MOA), valide les décisions et les recettes.
- Claude : maîtrise d'œuvre / AMOA / responsable technique.
- ChatGPT : AMOE, UX et développement 3D en coordination.
- Ne pas prétendre qu'une recette mobile est validée sans retour explicite du MOA.
- Ne pas modifier `index.html` ni intégrer une prévisualisation au village principal sans accord explicite.

## Organisation obligatoire
- Huit zones visitables, exactement (décision MOA) : `zones/01-entree/`, `02-chateau-interieur/`, `03-chateau-exterieur/`, `04-lac/`, `05-village/`, `06-residences-invites/`, `07-vergers-serre/`, `08-maison-futuriste/`. Forêt, mur d'enceinte et monde lointain sont des décors non visitables (`world/world.json`).
- Bâtiments indépendants dans leur zone : `05-village/01-ecuries/`, `02-taverne/`, `03-forge/`, `05-habitations/`.
- Personnages indépendants de leurs bâtiments : `characters/AA-palefrenier/`, `AB-tavernier/`, `AC-forgeron/` — prévus, priorité basse (T5 à T7).
- Moteur partagé `core/`, monde `world/`, systèmes `systems/`, ressources `assets/`.
- Identifiants stables, manifestes, coordonnées mondiales en mètres, cycle de vie explicite.
- Une conversation ou un chantier par bâtiment/personnage est encouragé ; ne pas écraser le travail parallèle.

## Production
1. Lire l'état GitHub réel et le manifeste du module avant de coder.
2. Travailler sur un fichier ou module isolé et créer une prévisualisation GitHub Pages.
3. Vérifier syntaxe, chargement, dépendances, collisions, interactions et budget mobile.
4. Soumettre le lien et attendre la recette MOA avant intégration globale.
5. Documenter les changements, les décisions et les limites dans `docs/PROJECT_STATE.md` et le manifeste pertinent.
6. Pour une migration : conserver les anciennes URLs, ne jamais copier un second renderer ou une seconde boucle de rendu dans la carte principale.

## Historique à respecter
- Écuries : `ecuries-v53.html` est la référence de travail ; V54 rejetée ; modèles de lampes actuels rejetés pour une refonte ultérieure. Depuis le 2026-10-18, `ribel-ecuries-nord-preview.html` montre le vrai modèle V53 dans le village (plus de volumes provisoires) ; `ribel-ecuries-nord-v2.html` est obsolète (implantation hors axe).
- Écuries au nord du village, en plein sur l'axe de la rue nord : porte d'entrée du village (on dépose sa monture, puis on entre). Ancrage x 0, z −72, portail au sud face à la rue (z −39,7).
- Module des écuries : `zones/05-village/01-ecuries/index.js`, géométrie générée depuis `ecuries-v53.html` par `tools/extract-ecuries-v53.mjs` — modéliser dans la page de référence, jamais dans `v53-geometry.js`. Voir le README du module.
- **Pas d'église au nord** : supprimée strictement par le MOA le 2026-10-18 ; ne pas la réintroduire.
- RIBEL : Touraine / Loire, XVe siècle, fabrication artisanale sans précision industrielle ; véritable 3D Three.js/WebXR, pas d'images de substitution.
- Téléphone cible : Samsung Galaxy Z Fold 6.

**Si un assistant démarre sans contexte conversationnel, ce fichier et les documents liés font foi pour la méthode ; les décisions récentes doivent être vérifiées dans GitHub et auprès du MOA.**
