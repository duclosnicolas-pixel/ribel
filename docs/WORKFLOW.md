# RIBEL — Procédure de chantier multi-conversations

## Début de session
1. Lire `AGENTS.md`, `CLAUDE.md`, `ARCHITECTURE.md`, `docs/PROJECT_STATE.md`, `docs/CONTRACTS.md`.
2. Vérifier sur GitHub la dernière version du fichier concerné, son manifeste et les travaux concurrents.
3. Définir un périmètre strict : zone / bâtiment / personnage / système.
4. Ne modifier aucun module tiers sans demande explicite ; privilégier un fichier nouveau ou une branche dédiée.

## Livraison
1. Écrire du code Three.js réellement exécutable, pas une illustration de remplacement.
2. Vérifier syntaxe, dépendances, erreurs de déclaration, géométries, commandes tactiles et collisions.
3. Publier un lien de prévisualisation exact, confirmer le commit GitHub.
4. Décrire les modifications, les risques et les tests encore à faire.
5. Attendre la recette du MOA sur Galaxy Z Fold 6 avant de marquer `validated`.
6. Consigner l'état et les décisions dans `docs/PROJECT_STATE.md` ; mettre à jour les manifestes.

## Intégration au monde
- Un seul `renderer`, une seule boucle de rendu et une seule carte de coordonnées.
- Zone : charge ses bâtiments et ressources ; personnages chargés par un système transversal.
- Chaque chantier produit un manifeste, un module et un banc d'essai.
- Tester les chemins, accès, visibilité, collisions, éclairages et budgets de rendu en contexte.
- Sauvegarder la version précédente avant fusion ; prévoir rollback.

## Reprise dans une nouvelle conversation
Donner l'URL du dépôt, indiquer le module concerné et demander explicitement de lire `AGENTS.md`, `CLAUDE.md` et `docs/PROJECT_STATE.md`. Les conversations ne partagent pas nécessairement leur contexte ; GitHub est le point de passage commun.
