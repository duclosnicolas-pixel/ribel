/** RIBEL — regroupement des pièces fixes d'un bâtiment, sans changer son apparence.
 *
 * Chaque maillage fixe (y compris les instances GPU) est recopié dans un seul
 * maillage par matériau équivalent. Les objets animés ou interactifs restent à part :
 * la fonction `keep(objet)` les désigne, et tout leur sous-arbre est épargné.
 *
 * Avec `collapse: true`, les matériaux opaques non émissifs qui ne diffèrent que par
 * leur couleur partagent un même matériau : la couleur passe dans les sommets, et la
 * répétition des textures passe dans les coordonnées de texture. L'apparence est
 * conservée, le nombre d'appels de rendu tombe à quelques dizaines.
 */

const texKey = (t) => (t ? t.uuid : '-');
const imageIds = new WeakMap();
let nextImageId = 1;
const imgKey = (t) => {
  if (!t) return '-';
  const img = t.image || t.source?.data;
  if (!img || typeof img !== 'object') return t.uuid;
  if (!imageIds.has(img)) imageIds.set(img, nextImageId++);
  return 'img' + imageIds.get(img);
};
const round = (v, step) => (v === undefined || v === null ? '-' : Math.round(v / step) * step);

export function materialKey(m) {
  const c = (v) => (v && v.getHexString ? v.getHexString() : '-');
  return [
    m.type, c(m.color), c(m.emissive), m.emissiveIntensity ?? '-', m.roughness ?? '-', m.metalness ?? '-',
    texKey(m.map), texKey(m.bumpMap), m.bumpScale ?? '-', m.side, m.transparent, m.opacity,
    m.depthWrite, m.depthTest, m.alphaTest, m.vertexColors, m.flatShading, m.fog, m.wireframe,
  ].join('|');
}

/** Clé de regroupement « large » : null si le matériau doit garder son identité. */
function collapseKey(m) {
  if (!m.isMeshStandardMaterial && !m.isMeshLambertMaterial) return null;
  if (m.transparent || m.opacity < 1 || m.alphaTest > 0 || m.vertexColors || m.wireframe) return null;
  if (m.emissive && (m.emissive.r + m.emissive.g + m.emissive.b) > 0 && m.emissiveIntensity > 0) return null;
  for (const k of ['normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'alphaMap', 'lightMap', 'envMap']) if (m[k]) return null;
  if (m.map && m.bumpMap && (!m.map.repeat.equals(m.bumpMap.repeat) || !m.map.offset.equals(m.bumpMap.offset))) return null;
  if ((m.map && (m.map.rotation || m.map.matrixAutoUpdate === false)) || (m.bumpMap && m.bumpMap.rotation)) return null;
  return [m.type, m.side, m.flatShading, m.fog, round(m.roughness, 0.05), round(m.metalness, 0.05),
    imgKey(m.map), imgKey(m.bumpMap), round(m.bumpScale, 0.01)].join('|');
}

function pushGeometry(bucket, geometry, matrix, color, uvT, tag) {
  let g = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  for (const name of Object.keys(g.attributes)) if (!['position', 'normal', 'uv'].includes(name)) g.deleteAttribute(name);
  if (!g.attributes.normal) g.computeVertexNormals();
  g.applyMatrix4(matrix);
  const pos = g.attributes.position.array, nor = g.attributes.normal.array;
  const n = g.attributes.position.count;
  const uv = g.attributes.uv ? Float32Array.from(g.attributes.uv.array) : new Float32Array(n * 2);
  if (uvT) for (let i = 0; i < uv.length; i += 2) { uv[i] = uv[i] * uvT[0] + uvT[2]; uv[i + 1] = uv[i + 1] * uvT[1] + uvT[3]; }
  let col = null;
  if (color) { col = new Float32Array(n * 3); for (let i = 0; i < n; i++) { col[i * 3] = color.r; col[i * 3 + 1] = color.g; col[i * 3 + 2] = color.b; } }
  if (matrix.determinant() < 0) {                    // symétrie : rétablir le sens des triangles
    for (let t = 0; t + 2 < n; t += 3) {
      for (const [arr, k] of [[pos, 3], [nor, 3], [uv, 2], [col, 3]]) {
        if (!arr) continue;
        for (let j = 0; j < k; j++) {
          const a = (t + 1) * k + j, b = (t + 2) * k + j;
          const s = arr[a]; arr[a] = arr[b]; arr[b] = s;
        }
      }
    }
  }
  bucket.pos.push(pos); bucket.nor.push(nor); bucket.uv.push(uv); if (col) bucket.col.push(col);
  if (tag !== null && tag !== undefined) bucket.tag.push(new Float32Array(n).fill(tag));
  bucket.count += n;
  g.dispose();
}

function concat(chunks) {
  const out = new Float32Array(chunks.reduce((s, a) => s + a.length, 0));
  let o = 0;
  for (const a of chunks) { out.set(a, o); o += a.length; }
  return out;
}

function sharedMaterial(THREE, m) {
  const shared = m.clone();
  shared.color = new THREE.Color(0xffffff);
  shared.vertexColors = true;
  for (const k of ['map', 'bumpMap']) {
    if (!m[k]) continue;
    const t = m[k].clone();                          // même image, répétition reportée dans les sommets
    t.repeat.set(1, 1); t.offset.set(0, 0); t.needsUpdate = true;
    shared[k] = t;
  }
  shared.name = 'regroupé:' + (m.map ? 'texturé' : 'uni');
  shared.needsUpdate = true;
  return shared;
}

/**
 * @param THREE  module three.js
 * @param root   groupe à optimiser
 * @param opts.keep(objet)   → true pour épargner un objet et tout son sous-arbre
 * @param opts.collapse      regrouper aussi les matériaux qui ne diffèrent que par la couleur
 * @param opts.mergeInstanced recopier aussi les instances GPU
 * @param opts.tag(maillage)  → numéro d'élément mobile (porte…) ou null ; les sommets reçoivent
 *                             un attribut `ribelPart`, et ces maillages ne sont jamais mêlés aux fixes
 * @returns {{merged:number, sources:number, removed:Object3D[]}}
 */
export function mergeStaticMeshes(THREE, root, { keep = () => false, mergeInstanced = true, collapse = false, tag = () => null } = {}) {
  root.updateMatrixWorld(true);
  const toRoot = new THREE.Matrix4().copy(root.matrixWorld).invert();
  const buckets = new Map();
  const removed = [];
  const m = new THREE.Matrix4(), mi = new THREE.Matrix4();

  const visit = (obj) => {
    if (obj !== root && keep(obj)) return;
    for (const child of [...obj.children]) visit(child);
    if (obj === root || !obj.isMesh || obj.isSkinnedMesh || !obj.visible) return;
    if (Array.isArray(obj.material) || !obj.geometry?.attributes?.position) return;
    if (obj.isInstancedMesh && (!mergeInstanced || obj.instanceColor)) return;
    if (obj.children.length) return;                 // un maillage porteur d'enfants reste en place
    const mat = obj.material;
    const wide = collapse ? collapseKey(mat) : null;
    const part = tag(obj);
    const tagged = part !== null && part !== undefined;
    const key = (tagged ? 'T|' : 'S|') + (wide ? 'W|' + wide : 'E|' + materialKey(mat));
    if (!buckets.has(key)) buckets.set(key, { material: wide ? sharedMaterial(THREE, mat) : (tagged ? mat.clone() : mat), wide: !!wide, tagged, pos: [], nor: [], uv: [], col: [], tag: [], count: 0 });
    const bucket = buckets.get(key);
    const color = wide ? mat.color : null;
    const t = wide && mat.map ? [mat.map.repeat.x, mat.map.repeat.y, mat.map.offset.x, mat.map.offset.y] : null;
    m.multiplyMatrices(toRoot, obj.matrixWorld);
    if (obj.isInstancedMesh) {
      for (let i = 0; i < obj.count; i++) {
        obj.getMatrixAt(i, mi);
        pushGeometry(bucket, obj.geometry, new THREE.Matrix4().multiplyMatrices(m, mi), color, t, tagged ? part : null);
      }
    } else {
      pushGeometry(bucket, obj.geometry, m.clone(), color, t, tagged ? part : null);
    }
    removed.push(obj);
  };
  visit(root);

  for (const obj of removed) obj.parent.remove(obj);
  let merged = 0;
  for (const b of buckets.values()) {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(concat(b.pos), 3));
    g.setAttribute('normal', new THREE.BufferAttribute(concat(b.nor), 3));
    g.setAttribute('uv', new THREE.BufferAttribute(concat(b.uv), 2));
    if (b.wide) g.setAttribute('color', new THREE.BufferAttribute(concat(b.col), 3));
    if (b.tagged) g.setAttribute('ribelPart', new THREE.BufferAttribute(concat(b.tag), 1));
    g.computeBoundingSphere(); g.computeBoundingBox();
    const mesh = new THREE.Mesh(g, b.material);
    mesh.name = 'fusion:' + (b.material.name || b.material.type);
    mesh.matrixAutoUpdate = false;
    mesh.userData.ribelParts = b.tagged;
    root.add(mesh);
    merged++;
  }
  return { merged, sources: removed.length, removed };
}
