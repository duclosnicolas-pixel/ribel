#!/usr/bin/env bash
# RIBEL — chaîne « haute qualité » d'un bâtiment, depuis un export glTF complet (Meshy ou autre).
# Usage : tools/hq/build.sh <source.glb> <dossier de sortie> <échelle m/unité> <id> "<libellé>" [dessus de dalle] [triangles casque] [triangles loin]
# Exemple (auberge) :
#   tools/hq/build.sh ~/Meshy_AI_The_Golden_Hearth_Inn_1023140607_texture.glb zones/05-village/02-taverne/hq 9 taverne "Auberge du Foyer d'Or" -0.517
# Produit : geo-max.glb, geo-casque.glb, geo-loin.glb, tex-couleur.jpg, tex-normales.jpg, tex-normales-casque.webp, tex-orm.webp, hq.json.
# Prérequis : voir tools/hq/README.md (Node + npm ci dans tools/hq, Python 3 avec numpy/scipy/Pillow, Blender en module Python).
set -euo pipefail
SRC=$1; OUT=$2; SCALE=$3; ID=$4; LABEL=$5
HERE=$(cd "$(dirname "$0")" && pwd)
PY=${PYTHON:-python3}
BPY=${BLENDER_PY:-$HERE/.venv/bin/python}
GT="$HERE/node_modules/.bin/gltf-transform"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"
TRIS=$($PY -I "$HERE/textures.py" count "$SRC")
SLAB=${6:-$($PY -c "import sys; sys.path.insert(0,'$HERE'); from glbread import read_glb; print(float(read_glb('$SRC')[1][:,1].min())+0.01)")}
CASQUE=${7:-200000}; LOIN=${8:-52000}
RC=$($PY -c "print(min(1.0, $CASQUE/$TRIS))"); RL=$($PY -c "print(min(1.0, $LOIN/$TRIS))")
# Grandeurs en mètres, converties en unités du modèle
AO_DIST=$($PY -c "print(2.25/$SCALE)"); CAGE=$($PY -c "print(0.09/$SCALE)"); RAY=$($PY -c "print(0.18/$SCALE)")
echo "Source : $TRIS triangles ; échelle $SCALE ; dalle $SLAB"
echo "1/7 Niveaux simplifiés (casque ≈ $CASQUE, loin ≈ $LOIN triangles)"
"$GT" simplify "$SRC" "$TMP/casque.glb" --ratio "$RC" --error 0.004 >/dev/null
"$GT" simplify "$SRC" "$TMP/loin.glb" --ratio "$RL" --error 0.01 >/dev/null
echo "2/7 Occlusion ambiante cuite sur la géométrie complète (Blender Cycles)"
"$BPY" "$HERE/bake_ao.py" -- "$SRC" "$TMP/ao.png" 2048 48 "$AO_DIST" >"$TMP/ao.log" 2>&1 || { cat "$TMP/ao.log"; exit 1; }
echo "3/7 Reliefs de la géométrie complète cuits sur le niveau casque, tangentes MikkTSpace"
"$BPY" "$HERE/bake_normal.py" -- "$SRC" "$TMP/casque.glb" "$TMP/normal.png" "$TMP/casque-tangentes.glb" 2048 4 "$CAGE" "$RAY" >"$TMP/normal.log" 2>&1 || { cat "$TMP/normal.log"; exit 1; }
echo "4/7 Textures d'origine (sans réencodage)"
$PY -I "$HERE/textures.py" extract "$SRC" "$OUT" >/dev/null
echo "5/7 ORM (occlusion, rugosité, métal) et carte de normales casque, îlots UV prolongés"
MR=$(ls "$OUT"/.mr.* 2>/dev/null | head -1 || true)
$PY -I "$HERE/textures.py" orm "$SRC" "$TMP/ao.png" "${MR:-$TMP/none}" "$OUT/tex-orm.webp"
$PY -I "$HERE/textures.py" normal "$TMP/casque-tangentes.glb" "$TMP/normal.png" "$OUT/tex-normales-casque.webp"
rm -f "$OUT"/.mr.*
echo "6/7 Géométries seules, quantifiées et compressées (meshopt)"
node "$HERE/geo-only.mjs" "$SRC" "$OUT/geo-max.glb" | tee "$TMP/c-max"
node "$HERE/geo-only.mjs" "$TMP/casque-tangentes.glb" "$OUT/geo-casque.glb" | tee "$TMP/c-casque"
node "$HERE/geo-only.mjs" "$TMP/loin.glb" "$OUT/geo-loin.glb" | tee "$TMP/c-loin"
n() { grep -o 'triangles [0-9]*' "$1" | awk '{print $2}'; }
echo "7/7 hq.json"
$PY -I "$HERE/make-spec.py" "$OUT" "$ID" "$LABEL" "$(basename "$SRC")" "$SCALE" "$SLAB" "$(n "$TMP/c-max")" "$(n "$TMP/c-casque")" "$(n "$TMP/c-loin")"
du -sh "$OUT"
