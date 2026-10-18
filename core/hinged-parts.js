/** RIBEL — pièces pivotantes regroupées (portes, vantaux, portails).
 *
 * Toutes les portes d'un bâtiment sont dessinées en un seul appel par matériau.
 * Chaque sommet porte le numéro de sa porte (attribut `ribelPart`) ; le shader le fait
 * tourner autour de l'axe vertical de sa charnière, selon l'angle reçu en uniforme.
 * Rotation identique à `objet.rotation.y = angle` autour de la charnière.
 */
export const MAX_PARTS = 32;

export function createHingeUniform(THREE, hinges) {
  if (hinges.length > MAX_PARTS) throw new RangeError(`Au plus ${MAX_PARTS} pièces pivotantes par bâtiment`);
  const value = Array.from({ length: MAX_PARTS }, (_, i) => {
    const h = hinges[i];
    return new THREE.Vector4(h ? h.x : 0, h ? h.y : 0, h ? h.z : 0, 0);
  });
  return { value };
}

export function enableHingedParts(material, uniform) {
  material.onBeforeCompile = (shader) => {
    shader.uniforms.ribelHinges = uniform;
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
attribute float ribelPart;
uniform vec4 ribelHinges[${MAX_PARTS}];
vec3 ribelRotY(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(c * v.x + s * v.z, v.y, -s * v.x + c * v.z); }`)
      .replace('#include <beginnormal_vertex>', `#include <beginnormal_vertex>
vec4 ribelHinge = ribelHinges[int(ribelPart + 0.5)];
objectNormal = ribelRotY(objectNormal, ribelHinge.w);`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
transformed = ribelHinge.xyz + ribelRotY(transformed - ribelHinge.xyz, ribelHinge.w);`);
  };
  material.customProgramCacheKey = () => 'ribel-hinged-parts';
  material.needsUpdate = true;
  return material;
}
