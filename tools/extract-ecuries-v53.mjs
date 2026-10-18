// Extraction de la modélisation des écuries V53 vers un module de bâtiment.
// Usage : node tools/extract-ecuries-v53.mjs [page-source.html]   (depuis la racine du dépôt)
// Par défaut : ecuries-v53.html. Pour une version ultérieure validée par le MOA, passer sa page.
//
// Le code de modélisation de ecuries-v53.html est repris À L'IDENTIQUE.
// Seuls sont écartés : la scène autonome (renderer, caméra, ciel, soleil),
// l'interface (boutons, mode Marche, vues orbitales) et la boucle de rendu.
// Les rares dépendances à la page sont remplacées par des cales locales.
import fs from 'node:fs';

const SRC = process.argv[2] || 'ecuries-v53.html';
const OUT = 'zones/05-village/01-ecuries/v53-geometry.js';
const html = fs.readFileSync(SRC, 'utf8');
const script = html.slice(html.indexOf('<script type="module">') + '<script type="module">'.length, html.lastIndexOf('</script>'));

function cut(from, to) {
  const a = script.indexOf(from), b = script.indexOf(to);
  if (a < 0 || b < 0 || b <= a) throw new Error(`Repère introuvable : ${a < 0 ? from : to}`);
  return script.slice(a, b);
}
// Partie A : matériaux, textures, tout le bâti, jusqu'au réglage mobile du renderer (exclu).
let partA = cut('const mat=(c,roughness=1)=>', '// Optimisation mobile : ombres moins coûteuses');
// Partie B : regroupement des boîtes statiques et détails V52–V53, jusqu'à la boucle de rendu (exclue).
let partB = cut('function batchStaticBoxes(root){', 'renderer.setAnimationLoop(');

const swaps = [
  // Sol d'herbe de 115 m de la scène autonome : le village fournit son propre sol.
  ['box(115,.4,115,0,-.3,0,grass);', 'if(__cfg.ground)box(115,.4,115,0,-.3,0,grass);'],
];
for (const [a, b] of swaps) {
  if (!partA.includes(a)) throw new Error(`Motif absent : ${a}`);
  partA = partA.replace(a, b);
}
// Pavés et graviers tirés au hasard : tirage reproductible, identique à chaque chargement.
partA = partA.replaceAll('Math.random()', '__rnd()');
partB = partB.replaceAll('Math.random()', '__rnd()');

const out = `// AUTO-GÉNÉRÉ par tools/extract-ecuries-v53.mjs à partir de ${SRC} — ne pas modifier à la main.
// Modélisation des écuries reprise à l'identique ; scène autonome, interface et boucle de rendu retirées.
export const SOURCE = '${SRC}';

export function buildV53(THREE, options = {}) {
  const __cfg = { ground: false, maxAnisotropy: 8, seed: 0x5eed1453, ...options };
  let __seed = __cfg.seed >>> 0;
  const __rnd = () => { __seed = (Math.imul(1664525, __seed) + 1013904223) >>> 0; return __seed / 4294967296; };
  const root = new THREE.Group();
  root.name = 'ecuries-v53';
  // Cales : la V53 parlait à sa page ; le module ne crée ni renderer, ni caméra, ni interface.
  const __stub = { textContent: '', style: {}, addEventListener() {}, classList: { add() {}, remove() {}, toggle() {} } };
  const document = {
    getElementById: () => __stub, querySelector: () => __stub, querySelectorAll: () => [],
    createElement: (tag) => globalThis.document.createElement(tag),
  };
  const scene = { add: (...objects) => root.add(...objects), background: null, fog: { color: new THREE.Color() } };
  const renderer = { capabilities: { getMaxAnisotropy: () => __cfg.maxAnisotropy }, toneMappingExposure: 1 };
  const ambient = new THREE.HemisphereLight();    // jamais ajoutée : l'éclairage vient du moteur
  const sun = new THREE.DirectionalLight();       // jamais ajoutée : l'éclairage vient du moteur

  // ===================== V53 — partie A (verbatim) =====================
${partA}
  // ===================== V53 — partie B (verbatim) =====================
${partB}
  // ===================== fin de l'extrait V53 =====================

  return {
    root, group, interactiveDoors, lightTargets, fireFlames, wallFlames, wick,
    hearthGlow, homeLight, courtyardNightLights, warmGlass,
    bounds: { west, east, north, south, gateHalf, wallTh },
    isFireOn: () => fireOn,
    areLampsOn: () => lampsOn,
    toggleFire() { fireOn = !fireOn; setLighting(); return fireOn; },
    toggleLamps() { allLampsEnabled = !allLampsEnabled; applyLampSwitch(); return allLampsEnabled; },
    setNight(on) { nightMode = !!on; applyDayNight(); applyLampSwitch(); },
  };
}
`;
fs.writeFileSync(OUT, out);
console.log(`${OUT} : ${out.length} caractères (partie A ${partA.length}, partie B ${partB.length})`);
