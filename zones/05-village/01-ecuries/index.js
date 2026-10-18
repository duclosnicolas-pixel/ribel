/** RIBEL — module de bâtiment « écuries » (zone Z05 Village).
 *
 * Contrat : createBuilding(context, config) → { root, update, dispose, getColliders, getInteractionPoints }.
 * La modélisation est celle de ecuries-v53.html, extraite à l'identique dans v53-geometry.js.
 * Le module ne crée ni renderer, ni caméra, ni boucle, ni éclairage global.
 */
import { buildV53 } from './v53-geometry.js';
import { mergeStaticMeshes } from '../../../core/static-merge.js';
import { createHingeUniform, enableHingedParts } from '../../../core/hinged-parts.js';

export const manifestPath = 'zones/05-village/01-ecuries/manifest.json';

// Volumes infranchissables, en mètres et dans le repère local des écuries
// (x est, z sud ; portail au sud). [xMin, xMax, zMin, zMax]
const SOLIDS = [
  [-30.5, -29.9, -28.0, 32.5], [29.9, 30.5, -28.0, 32.5],     // murs d'enceinte ouest et est
  [-30.5, 30.5, -28.0, -27.4],                                 // mur d'enceinte nord
  [-30.5, -4.55, 31.9, 32.5], [4.55, 30.5, 31.9, 32.5],       // mur sud, de part et d'autre du portail
  [-19.2, 19.2, -22.7, -11.25],                                // bâtiment nord : six boxes de nuit
  [-25.85, -18.1, -9.35, 15.35],                               // aile ouest : remise
  [18.1, 25.85, -9.35, 15.35],                                 // aile est : quatre boxes de jour
  [17.7, 26.3, 14.65, 27.1],                                   // logement du palefrenier
];

export function createBuilding(context, config = {}) {
  const { THREE } = context;
  const cfg = { dynamicLights: false, ground: false, merge: true, ...config };
  const v53 = buildV53(THREE, { ground: cfg.ground, maxAnisotropy: context.maxAnisotropy ?? 8 });
  const root = new THREE.Group();
  root.name = 'ecuries';
  root.add(v53.root);
  const placement = cfg.placement || { x: 0, y: 0, z: 0, rotationY: 0 };
  root.position.set(placement.x, placement.y || 0, placement.z);
  root.rotation.y = placement.rotationY || 0;

  // Lumières ponctuelles : chaque source dynamique pèse sur tout le village.
  // Hors mode nuit (lot T8), elles sont retirées ; flammes et vitres restent lumineuses.
  const lights = [];
  v53.root.traverse((o) => { if (o.isLight) lights.push(o); });
  if (!cfg.dynamicLights) for (const l of lights) l.parent.remove(l);

  // Cibles invisibles de la V53 pour viser au doigt : remplacées par les points d'interaction.
  for (const t of v53.lightTargets) {
    if (t.mesh.material && t.mesh.material.opacity === 0) t.mesh.visible = false;
  }

  // Points d'interaction, en coordonnées locales.
  const tmp = new THREE.Vector3();
  const local = (obj) => v53.root.worldToLocal(obj.getWorldPosition(tmp.clone()));
  const doorLabel = { night: 'porte de box de nuit', day: 'porte de box de jour', gate: 'vantail du portail', house: 'porte du logement' };
  root.updateMatrixWorld(true);
  const interactions = v53.interactiveDoors.map((door, i) => {
    // Point de saisie : milieu du vantail, à 1,1 m du sol.
    const box = new THREE.Box3().setFromObject(door.pivot);
    const c = box.getCenter(new THREE.Vector3());
    const p = v53.root.worldToLocal(c);
    return {
      id: `porte-${door.kind}-${i}`, kind: 'door', label: doorLabel[door.kind] || 'porte',
      localPosition: { x: p.x, y: 1.1, z: p.z }, radius: door.kind === 'gate' ? 2.4 : 1.6,
      isOpen: () => door.open,
      action: () => { door.open = !door.open; context.events?.emit?.('building:door-opened', { sourceId: 'ecuries', zoneId: 'village', timestamp: Date.now(), payload: { door: i, open: door.open } }); return door.open; },
    };
  });
  const fire = v53.lightTargets.find((t) => t.kind === 'fire');
  if (fire) {
    const p = local(fire.mesh);
    interactions.push({ id: 'foyer', kind: 'fire', label: 'foyer', localPosition: { x: p.x, y: p.y, z: p.z }, radius: 1.0, isOpen: () => v53.isFireOn(), action: () => v53.toggleFire() });
  }
  if (v53.wick) {
    const p = local(v53.wick);
    interactions.push({ id: 'lampes', kind: 'lamp', label: 'lampes', localPosition: { x: p.x, y: p.y, z: p.z }, radius: 1.0, isOpen: () => v53.areLampsOn(), action: () => { const on = v53.toggleLamps(); context.events?.emit?.('building:lamp-toggled', { sourceId: 'ecuries', zoneId: 'village', timestamp: Date.now(), payload: { on } }); return on; } });
  }

  // Objets animés (flammes, mèches) : épargnés par le regroupement.
  // Les portes sont regroupées elles aussi : le shader les fait pivoter (core/hinged-parts.js).
  const animated = new Set([...v53.fireFlames, ...v53.wallFlames, v53.wick, ...v53.lightTargets.map((t) => t.mesh)]);
  for (const d of v53.interactiveDoors) d.pivot.rotation.y = d.angle;   // pose de repos, comme la V53 à sa première image
  root.updateMatrixWorld(true);
  const hinges = v53.interactiveDoors.map((d) => v53.root.worldToLocal(d.pivot.getWorldPosition(new THREE.Vector3())));
  const partOf = new Map();
  v53.interactiveDoors.forEach((d, i) => {
    if (Math.abs(d.pivot.rotation.x) > 1e-6 || Math.abs(d.pivot.rotation.z) > 1e-6) throw new Error('Charnière non verticale : porte ' + i);
    d.pivot.traverse((o) => { if (o.isMesh && !animated.has(o)) partOf.set(o, i); });
  });
  const hingeUniform = createHingeUniform(THREE, hinges);
  let stats = { merged: 0, sources: 0 };
  if (cfg.merge) {
    const s = mergeStaticMeshes(THREE, v53.root, {
      keep: (o) => animated.has(o) || o.isLight, collapse: true, tag: (o) => partOf.get(o) ?? null,
    });
    stats = { merged: s.merged, sources: s.sources };
    for (const o of s.removed) o.geometry?.dispose();
    v53.root.traverse((o) => {
      if (!o.isMesh || !o.userData.ribelParts) return;
      enableHingedParts(o.material, hingeUniform);
      o.geometry.boundingSphere.radius += 5;           // débattement des vantaux
    });
  }

  let time = 0;
  function update(dt) {
    time += dt * 1000;                                 // la V53 animait en millisecondes
    if (v53.isFireOn()) {
      if (cfg.dynamicLights) v53.hearthGlow.intensity = 0.78 + 0.12 * Math.sin(time * 0.012) + 0.06 * Math.sin(time * 0.027);
      v53.fireFlames.forEach((f, i) => { f.scale.y = 0.84 + 0.16 * Math.sin(time * 0.009 + i * 1.8); f.rotation.z = 0.09 * Math.sin(time * 0.006 + i); });
    }
    if (cfg.dynamicLights && v53.areLampsOn()) v53.homeLight.intensity = 0.60 + 0.05 * Math.sin(time * 0.004);
    const k = 1 - Math.pow(1 - 0.16, dt * 60);        // même amortissement que la V53 à 60 i/s
    for (const door of v53.interactiveDoors) {
      const target = door.open ? (door.kind === 'gate' ? door.side * Math.PI * 0.5 : -Math.PI * 0.49) : 0;
      door.angle += (target - door.angle) * k;
      if (cfg.merge) hingeUniform.value[v53.interactiveDoors.indexOf(door)].w = door.angle;
      else door.pivot.rotation.y = door.angle;
    }
  }

  function getColliders() {
    const list = SOLIDS.map(([x0, x1, z0, z1], i) => ({ id: `mur-${i}`, min: { x: x0, z: z0 }, max: { x: x1, z: z1 } }));
    const { south, gateHalf } = v53.bounds;
    for (const d of v53.interactiveDoors) {
      if (d.kind === 'gate' && !d.open) list.push({ id: 'portail', min: { x: d.side < 0 ? -gateHalf : 0.04, z: south - 0.24 }, max: { x: d.side < 0 ? -0.04 : gateHalf, z: south + 0.32 } });
    }
    return list;
  }

  /** Vrai si le point local (x, z) est un sol libre à l'intérieur de l'enceinte ou devant le portail. */
  function isFloor(x, z, margin = 0.35) {
    const { west, east, north, south, gateHalf } = v53.bounds;
    const inside = x > west + 0.3 + margin && x < east - 0.3 - margin && z > north + 0.3 + margin && z < south - 0.3 - margin;
    const gateway = Math.abs(x) < gateHalf - margin && z >= south - 0.4 && z <= south + 4.0;
    if (!inside && !gateway) return false;
    for (const [x0, x1, z0, z1] of SOLIDS) {
      if (x > x0 - margin && x < x1 + margin && z > z0 - margin && z < z1 + margin) return false;
    }
    return true;
  }

  function dispose() {
    root.traverse((o) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) { for (const k of ['map', 'bumpMap']) m[k]?.dispose(); m.dispose(); }
    });
    root.parent?.remove(root);
  }

  return {
    id: 'ecuries', root, update, dispose, getColliders, isFloor,
    getInteractionPoints: () => interactions,
    stats, lights,
    setNight: (on) => v53.setNight(on),
  };
}
