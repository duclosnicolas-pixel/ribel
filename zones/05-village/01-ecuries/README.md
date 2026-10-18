# Écuries — chantier modulaire

- Référence autonome : [V53](../../../ecuries-v53.html).
- Maquette de situation : [implantation nord](../../../ribel-ecuries-nord-preview.html).
- Les deux fichiers ne sont pas encore fusionnés.
- À faire : extraire géométrie, animations, portes, collisions, lampes, foyer et états dans `createBuilding(context, config)`.
- Ne pas intégrer le renderer, les contrôles caméra, ni la boucle `setAnimationLoop` de la V53 dans le moteur du village.
- Les lampes actuelles sont à redessiner après validation MOA.
- Implantation (décision MOA du 2026-10-18) : au nord du village, en plein sur l'axe de la rue nord. Les écuries sont la porte d'entrée du village : on y dépose sa monture, puis on entre dans le village. Ancrage proposé x 0, z −70, rotation 0 ; portail au sud face à la rue nord (z −40,5). Il n'y a pas d'église au nord : elle est supprimée.
- Point ouvert : arrivée du chemin depuis l'Entrée (Z01), par le nord ou par un côté.
- Budget (contrôle MOE du 2026-10-18) : V53 émet 2 167 appels de rendu par image pour 179 000 triangles. Le module extrait doit tenir en ≤ 40 appels : fusion des pièces statiques par matériau, instanciation des répétitions (boxes, piliers, lanternes, anneaux), `MeshLambertMaterial`, ombres limitées à la lumière directionnelle du moteur, lampes en matériau émissif avec deux lumières ponctuelles au plus.
