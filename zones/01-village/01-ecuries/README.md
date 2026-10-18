# Écuries — chantier modulaire

- Référence autonome : [V53](../../../ecuries-v53.html).
- Maquette de situation : [implantation nord](../../../ribel-ecuries-nord-preview.html).
- Les deux fichiers ne sont pas encore fusionnés.
- À faire : extraire géométrie, animations, portes, collisions, lampes, foyer et états dans `createBuilding(context, config)`.
- Ne pas intégrer le renderer, les contrôles caméra, ni la boucle `setAnimationLoop` de la V53 dans le moteur du village.
- Les lampes actuelles sont à redessiner après validation MOA.
- L'emplacement nord est provisoire.
- Budget (contrôle MOE du 2026-10-18) : V53 émet 2 167 appels de rendu par image pour 179 000 triangles. Le module extrait doit tenir en ≤ 40 appels : fusion des pièces statiques par matériau, instanciation des répétitions (boxes, piliers, lanternes, anneaux), `MeshLambertMaterial`, ombres limitées à la lumière directionnelle du moteur, lampes en matériau émissif avec deux lumières ponctuelles au plus.
