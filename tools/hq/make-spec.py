"""Écrit hq.json pour un bâtiment produit par tools/hq/build.sh."""
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
# Usage : make-spec.py <dossier> <id> <libellé> <source> <échelle> <dessus de dalle> <tri max> <tri casque> <tri loin> [dist casque] [dist loin]
out, ident, label, source, scale, slab = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4], float(sys.argv[5]), float(sys.argv[6])
counts = {"max": int(sys.argv[7]), "casque": int(sys.argv[8]), "loin": int(sys.argv[9])}
d_casque = float(sys.argv[10]) if len(sys.argv) > 10 else 32
d_loin = float(sys.argv[11]) if len(sys.argv) > 11 else 75
spec = {
  "version": 1, "id": ident, "label": label, "source": source + " — conservé hors dépôt",
  "scale": scale, "slabTop": slab, "groundOffset": 0.03,
  "textures": {
    "couleur": {"file": "tex-couleur.jpg", "colorSpace": "srgb", "origine": "texture de couleur d'origine, non réencodée"},
    "normales": {"file": "tex-normales.jpg", "colorSpace": "linear", "origine": "carte de normales d'origine, non réencodée"},
    "normalesCasque": {"file": "tex-normales-casque.webp", "colorSpace": "linear", "origine": "reliefs de la géométrie complète cuits sur le niveau casque, sans perte"},
    "orm": {"file": "tex-orm.webp", "colorSpace": "linear", "origine": "R : occlusion ambiante cuite sur la géométrie complète ; G : rugosité d'origine ; B : métal 0 — sans perte"},
  },
  "niveaux": [
    {"id": "max", "file": "geo-max.glb", "textures": {"map": "couleur", "normalMap": "normales", "orm": "orm"}, "usage": "téléphone, de près : géométrie complète d'origine"},
    {"id": "casque", "file": "geo-casque.glb", "textures": {"map": "couleur", "normalMap": "normalesCasque", "orm": "orm"}, "usage": "casque, et distance moyenne au téléphone"},
    {"id": "loin", "file": "geo-loin.glb", "textures": {"map": "couleur", "normalMap": "normales", "orm": "orm"}, "usage": "au loin"},
  ],
  "qualites": {"max": [["max", 0], ["casque", d_casque], ["loin", d_loin]], "casque": [["casque", 0], ["loin", d_loin * 0.6]], "leger": [["loin", 0]]},
  "materiau": {"roughness": 1, "metalness": 0, "aoMapIntensity": 1, "envMapIntensity": 0.45, "side": "double"},
  "distances": "mesurées du centre du bâtiment (m) ; « max » ne sert jamais au casque",
}
for l in spec["niveaux"]:
    l["triangles"] = counts[l["id"]]; l["octets"] = os.path.getsize(os.path.join(out, l["file"]))
for t in spec["textures"].values():
    t["octets"] = os.path.getsize(os.path.join(out, t["file"]))
json.dump(spec, open(os.path.join(out, "hq.json"), "w"), ensure_ascii=False, indent=2)
print('hq.json', [(l["id"], l["triangles"]) for l in spec["niveaux"]])
