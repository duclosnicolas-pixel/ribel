# Taverne — Auberge du Foyer d'Or (zone Z05 Village)

## Origine
- Modèle Meshy fourni par le MOA le 2026-10-23 (`Meshy_AI_The_Golden_Hearth_Inn_1023140607_texture.glb`) : 137 Mo, 4,34 millions de triangles, trois textures de 2048 px. Le fichier source n'est pas dans le dépôt (limite GitHub de 100 Mo) : le MOA le conserve pour toute régénération.
- `auberge.glb` : version allégée, 78 000 triangles, 2,3 Mo, un seul appel de rendu. Écart visuel faible avec l'original (comparaison d'images à 1,10 m et 0,50 m de la façade).

## Échelle et implantation
- 9 m par unité Meshy : tables 0,85 m, bancs 0,5 m, passage sous les arcades 2,3 m, porte principale 1,75 m. Les proportions du modèle ne sont pas cohérentes entre elles ; c'est le meilleur compromis.
- Emprise 15,3 × 15,3 m en L, hauteur 9,4 m.
- Dans `ribel-village-maquette-v1.html` : ancrage x 19,48, z −0,19, rotation −0,72, façade tournée vers la fontaine. Les trois maisons de la couronne intérieure sous le rond rose du MOA sont retirées ; la rue circulaire garde au moins 3,5 m ; la couronne extérieure est intacte. Le perron et la terrasse avancent d'environ 11 m² sur le bord de la place.
- Les enseignes « Taverne » et « Auberge » des maisons génériques sont retirées : le modèle réunit les deux.

## Circulation (`nav.json`)
- Calculée sur la géométrie complète, cellules de 7,2 cm, par `tools/taverne/navgrid.py`.
- On peut se tenir debout s'il n'y a aucun obstacle à moins de 0,12 m entre 0,2 et 0,9 m (jambes), ni à moins de 0,22 m entre 0,9 et 1,9 m (buste, tête), au-dessus du sol local, et si l'endroit est relié à l'extérieur sans traverser mur, porte ou poteau.
- Praticable : abords, terrasse couverte entre les bancs et les tables, arcades, dessous de l'encorbellement, perron (le visiteur est posé à la hauteur des marches).
- Inaccessible : intérieur, mobilier.
- La terrasse du modèle est très meublée : on se pose entre les bancs par téléportation, sans allée continue.

## Portes
- **Fermées, non ouvrables** (décision MOA du 2026-10-23). Toucher une porte ou la façade affiche « L'auberge est fermée pour l'instant : on visitera l'intérieur plus tard. »

## Régénération
Voir l'en-tête de `tools/taverne/optimize.mjs` : simplification (`--ratio 0.018`), compression WebP et meshopt, puis carte de circulation sur le modèle source.

## Prévisualisations
- [Module seul](../../../previews/taverne-module.html) (bouton « Montrer la circulation »).
- [Dans la maquette du village](../../../ribel-village-maquette-v1.html) (bouton « Devant l'auberge »).
