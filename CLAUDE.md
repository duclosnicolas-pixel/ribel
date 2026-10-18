# RIBEL — Instructions permanentes pour Claude

**Lire dans cet ordre** : `AGENTS.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/WORKFLOW.md`, `docs/CONTRACTS.md`, puis les manifestes du module concerné.

## Gouvernance
- Nicolas : maître d'ouvrage (MOA), valide les décisions et les recettes.
- Claude : maîtrise d'œuvre / AMOA / responsable technique.
- ChatGPT : AMOE, UX et développement 3D en coordination.
- Ne pas prétendre qu'une recette mobile est validée sans retour explicite du MOA.
- Ne pas modifier `index.html` ni intégrer une prévisualisation au village principal sans accord explicite.

## Organisation obligatoire
- Zones : `zones/01-village/`, `02-chateau/`, `03-campagne/`, `04-foret/`.
- Bâtiments indépendants dans leur zone : `01-ecuries/`, `02-taverne/`, `03-forge/`, etc.
- Personnages indépendants de leurs bâtiments : `characters/AA-palefrenier/`, `AB-tavernier/`, `AC-forgeron/`.
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
- Écuries : `ecuries-v53.html` est la référence de travail ; V54 rejetée ; modèles de lampes actuels rejetés pour une refonte ultérieure. Ne pas confondre `ribel-ecuries-nord-preview.html` (volumes provisoires) avec le modèle V53 intégré.
- La maquette de situation des écuries est au nord/nord-est de l'église ; emplacement définitif à valider sur le croquis du MOA.
- RIBEL : Touraine / Loire, XVe siècle, fabrication artisanale sans précision industrielle ; véritable 3D Three.js/WebXR, pas d'images de substitution.
- Téléphone cible : Samsung Galaxy Z Fold 6.

**Si un assistant démarre sans contexte conversationnel, ce fichier et les documents liés font foi pour la méthode ; les décisions récentes doivent être vérifiées dans GitHub et auprès du MOA.**
