# Taverne — Auberge du Foyer d'Or (zone Z05 Village)

## Origine
- Modèle Meshy fourni par le MOA le 2026-10-23 (`Meshy_AI_The_Golden_Hearth_Inn_1023140607_texture.glb`) : 137 Mo, 4,34 millions de triangles, trois textures de 2048 px. Le fichier source n'est pas dans le dépôt : le MOA le conserve pour toute régénération.
- **Haute qualité** (décision MOA du 2026-10-23, après rejet de la version allégée à 78 000 triangles) : chaîne `tools/hq/`, affichage par `core/hq-building.js`.

## Niveaux de détail (`hq/hq.json`)
| Niveau | Triangles | Textures | Quand |
|---|---|---|---|
| `max` | 4 339 432 (géométrie complète d'origine) | couleur et normales d'origine + ORM | téléphone, à moins de 32 m du centre |
| `casque` | 199 910 | couleur d'origine + normales **cuites depuis la géométrie complète** + ORM | casque ; téléphone entre 32 et 75 m |
| `loin` | 51 966 | couleur et normales d'origine + ORM | au-delà |

- ORM : occlusion ambiante cuite sur la géométrie complète (R), rugosité d'origine (G), métal nul (B).
- Le moteur ajoute les ombres du soleil et les reflets du ciel. Un appel de rendu par niveau affiché.
- Qualité choisie automatiquement : « maximale » au téléphone, « casque » dans un navigateur de casque et pendant une session VR. Sélecteur « Auberge : … » dans la maquette, ou `?qualite=max|casque|leger`.
- Poids : 44 Mo au total, dont 24 Mo pour la géométrie complète (chargée en dernier, après les niveaux légers).
- Écart avec l'original Meshy, au téléphone : aucun pixel différent au-delà du seuil de 40/255 sur les vues de comparaison (façade, terrasse, porte à 4 m) ; au casque : moins de 1 % des pixels.

## Échelle et implantation
- 9 m par unité Meshy : tables 0,85 m, bancs 0,5 m, passage sous les arcades 2,3 m, porte principale 1,75 m. Emprise 15,3 × 15,3 m en L, hauteur 9,4 m.
- Dans `ribel-village-maquette-v1.html` : ancrage x 19,48, z −0,19, rotation −0,72, façade vers la fontaine. Remplace les trois maisons de la couronne intérieure sous le rond rose du MOA ; rue circulaire ≥ 3,5 m ; couronne extérieure intacte.
- **Validé par le MOA le 2026-10-23** : le recul d'environ 11 m² du perron et de la terrasse sur le bord de la place ; la suppression des enseignes « Taverne » et « Auberge » des maisons voisines.

## Circulation (`nav.json`)
- Calculée sur la géométrie complète, cellules de 7,2 cm, par `tools/hq/navgrid.py`.
- On peut se tenir debout s'il n'y a aucun obstacle à moins de 0,12 m entre 0,2 et 0,9 m (jambes), ni à moins de 0,22 m entre 0,9 et 1,9 m (buste, tête), au-dessus du sol local, et si l'endroit est relié à l'extérieur sans traverser mur, porte ou poteau.
- Praticable : abords, terrasse couverte entre les bancs et les tables, arcades, dessous de l'encorbellement, perron (le visiteur est posé à la hauteur des marches). Inaccessible : intérieur, mobilier.
- La terrasse du modèle est très meublée : on se pose entre les bancs par téléportation, sans allée continue.

## Portes
- **Fermées, non ouvrables** (décision MOA du 2026-10-23). Toucher une porte ou la façade affiche « L'auberge est fermée pour l'instant : on visitera l'intérieur plus tard. »

## Régénération
```bash
tools/hq/build.sh Meshy_AI_The_Golden_Hearth_Inn_1023140607_texture.glb zones/05-village/02-taverne/hq 9 taverne "Auberge du Foyer d'Or" -0.517
python3 -I tools/hq/navgrid.py Meshy_AI_The_Golden_Hearth_Inn_1023140607_texture.glb 9 zones/05-village/02-taverne/nav.json 0.12 0.22 -0.517
```

## Prévisualisations
- [Module seul](../../../previews/taverne-module.html) (qualité, circulation).
- [Dans la maquette du village](../../../ribel-village-maquette-v1.html) (bouton « Devant l'auberge », sélecteur de qualité).
