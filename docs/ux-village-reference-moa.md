# RIBEL — Spécification UX / village (version 1)
Date : 13 octobre 2026. Statut : référence d'intention MOA (image fournie le 13/10/2026) et proposition de critères UX AMOE. Ne pas modifier la version publiée avant recette.

## Référence et hiérarchie
La vue aérienne illustrative fournie par Nicolas est la **référence principale de composition et d'ambiance** : village densément bâti, place centrale animée, maisons variées, marché, rues convergentes, nature périphérique. Les inscriptions visibles sont illustratives et **non contractuelles**. Ne pas déduire de dimensions, orientation absolue ou fidélité archéologique à partir d'une image générée.
Priorité en cas de conflit : 1) décisions explicites MOA ; 2) contraintes fonctionnelles T1/T4 validées ; 3) cette référence d'ambiance ; 4) propositions AMOE.
**Corrections obligatoires** : au nord, remplacer l'église de l'illustration par les **écuries** et réserver le passage vers le château ; à l'est, ajouter le **grenier à blé** (absent de l'illustration) ; au sud, sortir l'ensemble paroisse/cimetière/cloître de la zone village et créer une transition dédiée.

## Plan d'expérience et parcours
- Point de repère permanent : fontaine au centre de la place ovale 80 × 28 m.
- Deux axes orthogonaux traversent la place ; leurs débouchés doivent rester perceptibles malgré le marché.
- Arrivée par le nord : perception immédiate des écuries, vue dirigée vers la place et la fontaine, possibilité de retour vers la future zone château. Éviter que le portail de zone ressemble à une porte arbitraire sans justification spatiale.
- Arrivée par le sud : vue vers le centre, repérage du chemin retour vers l'ensemble paroissial ; la paroisse ne se charge pas tant que le seuil n'est pas franchi.
- Depuis le centre : reconnaître sans carte les sorties nord/sud et l'orientation du grenier à l'est grâce à silhouette, façades, largeur des voies et détails sonores.
- Côté est : grenier à blé comme point de repère majeur, desservi par charrettes et accès de service, sans obstruer l'axe transversal.
- Côté ouest : commerces, tavernes ou maisons de marchands à préciser plus tard, sans noms définitifs imposés.
- Marché : implantation en îlots latéraux laissant un passage dégagé autour de la fontaine et sur les deux axes. Les étals ne doivent pas cacher toutes les façades ni la perspective du château.

## Lisibilité des bâtiments
Créer un village **varié sans hasard visuel** :
1. Maison marchande : rez-de-chaussée en pierre/enduit, étage à pans de bois, toit pentu, enseigne discrète.
2. Maison modeste : gabarit plus bas, matériaux plus simples, ouvertures limitées.
3. Atelier/forge : façade utilitaire, cour ou auvent ; feu/fumée sobres et peu coûteux en VR.
4. Auberge : volume plus important, entrée identifiable, sans architecture fantastique.
5. Écuries : accès charrettes, abreuvoir, cour, séparation nette des cheminements.
6. Grenier à blé : grande toiture, accès logistique, structure de stockage crédible.
L'emplacement exact de chaque métier reste à valider ; l'illustration n'est pas une liste exhaustive des bâtiments.

## Échelle, densité, matière
- Ne pas copier les dizaines de petits toits à l'identique : préserver une silhouette dense, mais construire des rues praticables à hauteur d'homme et des angles de vue propres à la VR.
- Définir un kit de façades et toitures avec variation de hauteur, teinte, enduit, colombage, encorbellement et usure.
- Le marché doit paraître habité même avant l'ajout de PNJ : tissus, paniers, tonneaux, traces de passage, sons d'ambiance localisés. Pas de multiplication de particules sans budget.
- Lumière naturelle, matériaux PBR, texture détaillée près du joueur et simplifiée au loin. Le style cible est la **reconstitution historique crédible**, pas un décor cartoon.

## Interaction et confort VR
- Conserver la téléportation existante de type RE4 ; matérialiser la destination valide/invalide sans masquer le décor.
- Garder les deux axes libres d'obstacles imprévus. Pas de téléportation sur étals, fontaine, escaliers ou derrière un portail de zone verrouillé.
- Aux transitions : un seuil spatial crédible, préchargement, fondu court, conservation de l'orientation attendue, possibilité de retour.
- Éviter les changements de caméra forcés, les déplacements automatiques et les animations de fumée excessives.
- Sur Fold 6 : conserver les commandes tactiles et une interface qui ne masque ni la fontaine ni la sortie principale.

## Vues de validation UX (captures et test en déplacement)
V1 — Vue haute de composition : ovalité, fontaine, quatre axes, écuries nord, grenier est et seuil sud visibles.
V2 — Depuis la fontaine vers le nord : perspective claire vers les écuries et la liaison château.
V3 — Depuis la fontaine vers l'est : grenier à blé reconnaissable, circulation praticable.
V4 — Depuis la fontaine vers le sud : chemin vers la paroisse, mais pas de détails paroissiaux chargés.
V5 — Depuis l'entrée nord vers la place : profondeur de scène, diversité de toitures et silhouette cohérente.
V6 — À hauteur de joueur devant une maison témoin : pierre, enduit, charpente, fenêtres, seuils et proportions crédibles.
V7 — Sur Quest 2, rotation complète sur place : absence de saut de décor, de scintillement gênant et de baisse durable de fluidité.
V8 — Sur Fold 6, déplacement complet de l'axe nord à l'axe sud : commandes utilisables et lisibilité maintenue.

## Critères d'acceptation — première livraison visuelle
- A1 : aucune église à l'extrémité nord du village ; écuries identifiables à sa place.
- A2 : grenier à blé situé **à l'est** et visible depuis un point de vue défini sur la place.
- A3 : ensemble paroissial au **sud, hors de la zone détaillée du village**.
- A4 : place ovale, fontaine et axes T1 préservés ; horizon T4 préservé.
- A5 : au moins trois typologies de maisons clairement différentes depuis la place, sans clonage visuel manifeste.
- A6 : au moins une maison témoin 1450–1550 évaluée à hauteur de joueur et approuvée par la MOA avant généralisation.
- A7 : navigation et téléportation testées sur Quest 2 et Z Fold 6 ; aucune régression bloquante.
- A8 : budget graphique mesuré sur appareils réels ; ne pas déclarer les 72 i/s atteintes sans mesure.

## Prochain incrément
1. Rendre la maison témoin plus détaillée (géométrie, ouvertures, textures, toit et proportions) et comparer à V6.
2. Construire une maquette de masse du village suivant V1–V5 sans remplacer le prototype publié.
3. Obtenir validation MOA des vues, puis intégrer par petits lots avec tests de non-régression.
