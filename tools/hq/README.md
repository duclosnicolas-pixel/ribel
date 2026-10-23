# Chaîne « haute qualité » des bâtiments RIBEL

Décision MOA du 2026-10-23 : les bâtiments sont intégrés en haute qualité. Cette chaîne transforme un export glTF complet (Meshy ou autre) en un jeu de fichiers que `core/hq-building.js` affiche avec des niveaux de détail, des ombres et les reflets du ciel.

## Principe
| Niveau | Géométrie | Textures | Quand |
|---|---|---|---|
| `max` | complète, d'origine | couleur et normales d'origine, ORM | téléphone, de près (moins de 32 m du centre) |
| `casque` | ≈ 200 000 triangles | carte de normales **cuite depuis la géométrie complète** (reliefs conservés), ORM | casque, et distance moyenne au téléphone |
| `loin` | ≈ 50 000 triangles | couleur et normales d'origine, ORM | au loin |

- **ORM** : R = occlusion ambiante cuite sur la géométrie complète (Blender Cycles, 48 échantillons, portée 2,25 m) ; G = rugosité d'origine ; B = métal 0.
- Les textures sont **partagées** par les niveaux (chargées une fois) ; les géométries sont des `.glb` sans matériau, quantifiées et compressées meshopt.
- Les îlots de l'atlas UV sont prolongés dans les vides (pas de liserés sombres de loin).
- Le moteur ajoute les ombres du soleil (calculées une fois, puis à chaque téléportation) et les reflets d'un ciel dégradé.
- Le niveau `max` ne sert jamais au casque : le Quest 2 ne peut pas dessiner 4 millions de triangles à 72 images par seconde.

## Hébergement
Compressée, la géométrie complète de l'auberge (4,34 M triangles) pèse 24 Mo, et l'ensemble 44 Mo : GitHub suffit (100 Mo par fichier). Le site publié par GitHub Pages est plafonné à 1 Go ; au-delà d'une vingtaine de bâtiments de ce calibre, il faudra servir les fichiers lourds depuis un stockage externe avec CORS (Cloudflare R2, par exemple). **Ne jamais committer l'export source** (137 Mo pour l'auberge) : le MOA le conserve.

## Installation (une fois)
```bash
cd tools/hq && npm ci                               # gltf-transform, meshoptimizer
uv venv -p 3.11 .venv && uv pip install --python .venv/bin/python bpy==5.0.1 numpy   # Blender en module Python
pip install numpy scipy pillow                      # Python 3 du système
```

## Production d'un bâtiment
```bash
tools/hq/build.sh <source.glb> <dossier hq> <échelle m/unité> <id> "<libellé>" [dessus de dalle] [triangles casque] [triangles loin]
python3 -I tools/hq/navgrid.py <source.glb> <échelle> <dossier du module>/nav.json 0.12 0.22 [dessus de dalle]
```
Exemple, l'auberge (5 minutes environ sur 2 cœurs) :
```bash
tools/hq/build.sh Meshy_AI_The_Golden_Hearth_Inn_1023140607_texture.glb zones/05-village/02-taverne/hq 9 taverne "Auberge du Foyer d'Or" -0.517
python3 -I tools/hq/navgrid.py Meshy_AI_The_Golden_Hearth_Inn_1023140607_texture.glb 9 zones/05-village/02-taverne/nav.json 0.12 0.22 -0.517
```

## Échelle
Les exports Meshy n'ont pas d'unité : choisir l'échelle sur des repères (porte ≈ 1,9 à 2 m, table ≈ 0,75 à 0,85 m, banc ≈ 0,45 à 0,5 m, hauteur d'étage ≈ 2,7 à 3 m) et la consigner dans le manifeste du bâtiment.

## Fichiers
- `build.sh` : enchaînement complet.
- `geo-only.mjs` : géométrie seule, quantifiée, compressée meshopt (tangentes conservées).
- `bake_ao.py`, `bake_normal.py` : cuissons Blender (occlusion ; reliefs haute → basse définition avec export des tangentes).
- `textures.py` : extraction des textures d'origine, ORM, prolongement des îlots UV, comptage des triangles.
- `make-spec.py` : écrit `hq.json` (niveaux, textures, distances, matériau).
- `navgrid.py` : carte de circulation autour du bâtiment, calculée sur la géométrie complète.
