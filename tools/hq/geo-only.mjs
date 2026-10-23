// Géométrie seule (sans matériau ni texture), quantifiée et compressée meshopt, attributs conservés (tangentes comprises).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions';
import { reorder, quantize, prune, dedup } from '@gltf-transform/functions';
import { MeshoptEncoder } from 'meshoptimizer';
const [src, out] = process.argv.slice(2);
await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(src);
for (const mesh of doc.getRoot().listMeshes()) for (const prim of mesh.listPrimitives()) prim.setMaterial(null);
for (const m of doc.getRoot().listMaterials()) m.dispose();
for (const t of doc.getRoot().listTextures()) t.dispose();
await doc.transform(dedup(), prune(), reorder({ encoder: MeshoptEncoder }),
  quantize({ quantizePosition: 16, quantizeNormal: 10, quantizeTexcoord: 14, quantizeGeneric: 12 }));
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER });
await io.write(out, doc);
const prim = doc.getRoot().listMeshes()[0].listPrimitives()[0];
console.log(out, 'triangles', prim.getIndices().getCount() / 3, 'attributs', prim.listSemantics().join(','));
