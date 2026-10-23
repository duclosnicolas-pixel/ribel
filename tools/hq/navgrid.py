# Usage : python3 -I tools/hq/navgrid.py <modèle source complet.glb> <échelle> <sortie nav.json> [marge jambes] [marge buste] [dessus de dalle]
# Exemple (auberge) : python3 -I tools/hq/navgrid.py Meshy_AI_The_Golden_Hearth_Inn_texture.glb 9 zones/05-village/02-taverne/nav.json 0.12 0.22 -0.517
"""Carte de circulation d'un bâtiment : où un visiteur peut se tenir debout autour et sous ses avancées.
Place debout = pas d'obstacle à moins de 0,12 m entre +0,2 et +0,9 m (jambes), ni à moins de 0,22 m
entre +0,9 et +1,9 m (buste, tête). Seuls comptent les endroits reliés à l'extérieur sans traverser
un mur, une porte ou un poteau : l'intérieur reste inaccessible, les portes ne s'ouvrent pas."""
import sys, os, json, math
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glbread import read_glb
from scipy import ndimage

S = float(sys.argv[2]) if len(sys.argv) > 2 else 9.0       # mètres par unité du modèle
SRC = sys.argv[1]
gl, P, I = read_glb(SRC)
V = P[I].astype(np.float64)
G = float(sys.argv[6]) if len(sys.argv) > 6 else float(P[:, 1].min()) + 0.01   # dessus de la dalle de base (unités modèle)
C = 0.008                                     # 7,2 cm à l'échelle 9
x0, z0 = float(P[:, 0].min()) - 0.03, float(P[:, 2].min()) - 0.03
nx = int((float(P[:, 0].max()) + 0.03 - x0) / C) + 1
nz = int((float(P[:, 2].max()) + 0.03 - z0) / C) + 1
n = np.cross(V[:, 1] - V[:, 0], V[:, 2] - V[:, 0]); ln = np.linalg.norm(n, axis=1); ny = n[:, 1] / np.maximum(ln, 1e-15)
# échantillons : sommets, milieux, centre ; grands triangles rasterisés plus finement
small = (np.ptp(V[:, :, 0], axis=1) < C) & (np.ptp(V[:, :, 2], axis=1) < C)
pts = [V[small].reshape(-1, 3), ((V[small][:, [0, 1, 2]] + V[small][:, [1, 2, 0]]) / 2).reshape(-1, 3), V[small].mean(1)]
nys = [np.repeat(ny[small], 3), np.repeat(ny[small], 3), ny[small]]
big = np.where(~small)[0]
k = 12
u, v = np.meshgrid(np.linspace(0, 1, k + 1), np.linspace(0, 1, k + 1)); m = (u + v) <= 1; u, v = u[m], v[m]
for s in range(0, len(big), 20000):
    T = V[big[s:s + 20000]]
    Q = T[:, 0, None, :] + u[None, :, None] * (T[:, 1, None, :] - T[:, 0, None, :]) + v[None, :, None] * (T[:, 2, None, :] - T[:, 0, None, :])
    pts.append(Q.reshape(-1, 3)); nys.append(np.repeat(ny[big[s:s + 20000]], len(u)))
Pt = np.concatenate(pts); Ny = np.concatenate(nys)
ix = np.floor((Pt[:, 0] - x0) / C).astype(int); iz = np.floor((Pt[:, 2] - z0) / C).astype(int)
ok = (ix >= 0) & (ix < nx) & (iz >= 0) & (iz < nz)
ix, iz, y, Ny = ix[ok], iz[ok], Pt[ok, 1], Ny[ok]
cell = iz * nx + ix
# sol local : plus haute surface tournée vers le haut, à moins de 0,035 u (0,31 m) au-dessus de la dalle
floor = np.full(nx * nz, G)
up = (Ny > 0.7) & (y <= G + 0.035)
np.maximum.at(floor, cell[up], y[up])
fl = floor[cell]
legs = (y > fl + 0.022) & (y < fl + 0.10)          # 0,2 à 0,9 m : jambes (bancs, tables, tonneaux)
torso = (y >= fl + 0.10) & (y < fl + 0.21)         # 0,9 à 1,9 m : buste et tête (murs, poteaux, lanternes)
occ_l = np.zeros(nx * nz, bool); occ_l[cell[legs]] = True
occ_t = np.zeros(nx * nz, bool); occ_t[cell[torso]] = True
geom = np.zeros(nx * nz, bool); geom[cell] = True
occ_l = occ_l.reshape(nz, nx); occ_t = occ_t.reshape(nz, nx); occ = occ_l | occ_t
floor = floor.reshape(nz, nx); geom = geom.reshape(nz, nx)
def disk(m):
    r = m / S / C; k = math.ceil(r)
    yy, xx = np.mgrid[-k:k + 1, -k:k + 1]
    return (xx ** 2 + yy ** 2) <= r * r
R_LEGS = float(sys.argv[4]) if len(sys.argv) > 4 else 0.12
R_TORSO = float(sys.argv[5]) if len(sys.argv) > 5 else 0.22
blocked = ndimage.binary_dilation(occ_l, structure=disk(R_LEGS)) | ndimage.binary_dilation(occ_t, structure=disk(R_TORSO))
free = ~blocked
# Extérieur : remplissage depuis le bord à travers tout ce que murs, portes et poteaux (buste et tête)
# laissent ouvert. Le mobilier bas ne ferme rien : on peut se poser entre les bancs.
# L'intérieur, fermé par ses murs et ses portes, n'est pas atteint.
open_tall = ~ndimage.binary_dilation(occ_t, structure=disk(0.15))
lab, nlab = ndimage.label(open_tall, structure=np.ones((3, 3)))
border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
outside = np.isin(lab, list(border))
reach = outside & free
# Bâti fermé (murs, portes et volume intérieur) : tout ce qui n'est pas l'extérieur, sauf les petits
# éléments isolés (poteaux d'arcade, tonneaux) de moins de 2 m².
closed_lab, nclosed = ndimage.label(~outside, structure=np.ones((3, 3)))
sizes = ndimage.sum(np.ones_like(closed_lab), closed_lab, index=np.arange(1, nclosed + 1))
big = np.zeros(nclosed + 1, bool); big[1:] = sizes * (C * S) ** 2 >= 2.0
enclosed = big[closed_lab]
walk = reach
floor_cm = np.clip(np.round(((floor - G) * S) * 100), 0, 255).astype(np.uint8)
def rle(a):
    a = a.ravel(); out = []; prev = int(a[0]); cnt = 0
    for val in a:
        val = int(val)
        if val == prev: cnt += 1
        else: out += [prev, cnt]; prev = val; cnt = 1
    out += [prev, cnt]; return out
fl_walk = np.where(walk, floor_cm, 0)
nav = {
    'version': 1, 'source': os.path.basename(SRC) + ' (géométrie complète, %d triangles)' % len(I),
    'unite': 'mètres, repère local du bâtiment (x est du modèle, z vers la façade principale)', 'dessus_dalle': G,
    'echelle': S, 'cellule': round(C * S, 4), 'x0': round(x0 * S, 4), 'z0': round(z0 * S, 4), 'nx': nx, 'nz': nz,
    'regle': 'praticable = pas d obstacle à moins de 0,12 m entre +0,2 et +0,9 m (jambes), ni à moins de 0,22 m entre +0,9 et +1,9 m (buste, tête), au-dessus du sol local ; accessible depuis l extérieur',
    'praticable_rle': rle(walk.astype(np.uint8)), 'sol_cm_rle': rle(fl_walk), 'bati_ferme_rle': rle(enclosed.astype(np.uint8)),
}
json.dump(nav, open(sys.argv[3] if len(sys.argv) > 3 else 'nav.json', 'w'), separators=(',', ':'))
print('enclosed', int(enclosed.sum()), 'cells', nx * nz, 'walk', int(walk.sum()), 'occ', int(occ.sum()), 'floor>5cm', int((fl_walk > 5).sum()), 'max floor cm', int(fl_walk.max()))
