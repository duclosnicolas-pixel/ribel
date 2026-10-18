# RIBEL — Contrats techniques v0.1

Ces interfaces sont des **cibles d'architecture**, non encore branchées à `index.html`. Les exemples exécutables sont dans `core/contracts.js`.

## Repère
- Mètres ; x = est, y = haut, z = sud (nord vers z négatif).
- Un module définit son repère local et son ancrage mondial `{x,y,z,rotationY}`.
- La carte déclare les emplacements ; le modèle ne décide pas où il habite.

## Bâtiment
- Manifeste : `id`, `zoneId`, `version`, `placement`, `bounds`, `entrances[]`, `interactions[]`, `assets[]`, `status`.
- `createBuilding(context, config)` retourne `{root, update(dt, worldState), dispose(), getColliders(), getInteractionPoints()}`.
- `root` est un `THREE.Group` en coordonnées locales. Le moteur central l'attache une fois à la zone.
- `context` fournit `THREE`, `events`, `resources`, `clock`, `quality` et les services communs. Pas de création de `WebGLRenderer` dans un bâtiment.
- Collisions et entrées déclarées en coordonnées locales ; le moteur les convertit en coordonnées monde.
- Une interaction est décrite par `{id,kind,localPosition,radius,action}`, puis dispatchée via le bus d'événements.

## Zone
- `createZone(context, zoneConfig)` retourne `{root, load(), unload(), update(dt), dispose()}`.
- Chargement progressif, distance d'affichage et simulation simplifiée hors champ.
- Les bâtiments ne connaissent pas les chemins physiques des autres modules ; la carte résout les IDs.

## Personnage
- Identité persistante `characterId`, indépendamment du lieu, du modèle et de la conversation.
- `character.json` décrit le rôle, le domicile par ID, le modèle, la personnalité, les besoins, les relations et la version de données.
- `createCharacter(context, definition)` retourne `{root, update(dt, worldState), serialize(), restore(state), dispose()}`.
- Séparer représentation 3D, animations, navigation, besoins, mémoire, décision et dialogue.
- L'état se conserve quand le personnage traverse les zones ; la simulation distante ne nécessite pas d'animer le maillage.

## Interopérabilité
- IDs d'événements suggérés : `building:door-opened`, `building:lamp-toggled`, `character:entered-zone`, `character:task-started`.
- Les événements transportent `sourceId`, `zoneId`, `timestamp` et un objet `payload` sérialisable.
- Versionner les manifestes et les sauvegardes. Ne pas faire dépendre la simulation d'un FPS fixe.
- Ressources communes réutilisées, instances GPU et nettoyage explicite ; mesurer les performances sur appareil.

## Règles de migration
1. Extraire la géométrie d'une prévisualisation sans copier sa boucle de rendu.
2. Remplacer ses dépendances globales par le contexte injecté.
3. Adapter les interactions et collisions aux contrats ci-dessus.
4. Tester le module seul, puis dans une **prévisualisation de carte**.
5. Intégrer à `index.html` uniquement après validation MOA.
