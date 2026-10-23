// Allègement du modèle Meshy de l'auberge pour le casque et le téléphone.
// Chaîne complète (depuis la racine du dépôt, outils installés : npm i @gltf-transform/cli@4 @gltf-transform/core@4
//   @gltf-transform/functions@4 @gltf-transform/extensions@4 meshoptimizer sharp) :
//   1. npx gltf-transform simplify source.glb simplifie.glb --ratio 0.018 --error 0.004   (4,34 M → 78 000 triangles)
//   2. node tools/taverne/optimize.mjs simplifie.glb zones/05-village/02-taverne/auberge.glb
//   3. python3 -I tools/taverne/navgrid.py source.glb 9 zones/05-village/02-taverne/nav.json 0.12 0.22
// La carte de circulation est calculée sur la géométrie COMPLÈTE, pas sur la version allégée.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { textureCompress, reorder, quantize, prune, dedup } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
const [src, out] = process.argv.slice(2);
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(src);
const mat = doc.getRoot().listMaterials()[0];
// Carte métal/rugosité quasi uniforme (métal ≈ 0, rugosité ≈ 0,62) : remplacée par des constantes.
mat.setMetallicRoughnessTexture(null).setMetallicFactor(0).setRoughnessFactor(0.62);
await doc.transform(
  dedup(), prune(),
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 86, slots: /^baseColor/ }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', quality: 90, resize: [1024, 1024], slots: /^normal/ }),
  reorder({ encoder: MeshoptEncoder }),
  quantize(),
);
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
await io.write(out, doc);
console.log('ok', out);
