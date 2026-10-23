"""Textures haute qualité : ORM (occlusion cuite R, rugosité d'origine G, métal B = 0) et carte de normales
cuite, avec remplissage des zones vides de l'atlas UV par la valeur de l'îlot le plus proche
(évite les liserés sombres aux bords des îlots quand la texture est vue de loin, à travers les mipmaps)."""
import sys, os, numpy as np
from PIL import Image
from scipy import ndimage
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from glbread import read_glb

def uv_coverage(glb_path, size):
    gl, P, I = read_glb(glb_path)
    prim = gl['meshes'][0]['primitives'][0]
    # relire les UV
    import json, struct
    data = open(glb_path, 'rb').read()
    off = 12; ch = {}
    while off < len(data):
        l, t = struct.unpack_from('<II', data, off); off += 8; ch[t] = data[off:off + l]; off += l
    gl = json.loads(ch[0x4E4F534A]); b = ch[0x004E4942]
    a = gl['accessors'][prim['attributes']['TEXCOORD_0']]; bv = gl['bufferViews'][a['bufferView']]
    uv = np.frombuffer(b, dtype=np.float32, count=a['count'] * 2, offset=bv.get('byteOffset', 0) + a.get('byteOffset', 0)).reshape(-1, 2)
    T = (uv[I] * size).astype(np.float64)                          # (n,3,2) en pixels
    ext = np.max(np.ptp(T, axis=1), axis=1)                         # étendue du triangle (px)
    m = np.zeros((size, size), bool)
    def mark(pts):
        x = np.clip(pts[:, 0].astype(int), 0, size - 1); y = np.clip(pts[:, 1].astype(int), 0, size - 1)
        m[y, x] = True                                              # convention glTF : v vers le bas, comme l'image
    # rasterisation par échantillonnage barycentrique, pas ≤ 0,5 px
    for k in (1, 2, 4, 8, 16, 32, 64, 128, 256):
        sel = (ext <= k / 2) if k > 1 else (ext <= 0.5)
        if k > 1: sel &= ext > (k / 4)
        if not sel.any(): continue
        u, v = np.meshgrid(np.linspace(0, 1, k + 1), np.linspace(0, 1, k + 1)); keep = (u + v) <= 1; u, v = u[keep], v[keep]
        Ts = T[sel]
        for s0 in range(0, len(Ts), 200000):
            S = Ts[s0:s0 + 200000]
            Q = S[:, 0, None, :] + u[None, :, None] * (S[:, 1, None, :] - S[:, 0, None, :]) + v[None, :, None] * (S[:, 2, None, :] - S[:, 0, None, :])
            mark(Q.reshape(-1, 2))
    big = ext > 128
    if big.any():
        print('triangles très grands :', int(big.sum()))
        for S in T[big]:
            n = int(np.ceil(np.max(np.ptp(S, axis=0)) * 2)) + 1
            u, v = np.meshgrid(np.linspace(0, 1, n), np.linspace(0, 1, n)); keep = (u + v) <= 1
            mark(S[0] + u[keep][:, None] * (S[1] - S[0]) + v[keep][:, None] * (S[2] - S[0]))
    return m

def fill(img, mask):
    idx = ndimage.distance_transform_edt(~mask, return_distances=False, return_indices=True)
    out = img[idx[0], idx[1]]
    out[mask] = img[mask]
    return out

def extract(glb_path, out_dir):
    """Copie, sans réencodage, les textures d'origine du modèle source : couleur, normales, métal/rugosité."""
    import json, struct
    data = open(glb_path, 'rb').read()
    off = 12; ch = {}
    while off < len(data):
        l, t = struct.unpack_from('<II', data, off); off += 8; ch[t] = data[off:off + l]; off += l
    gl = json.loads(ch[0x4E4F534A]); b = ch[0x004E4942]
    mat = gl['materials'][0]; pbr = mat.get('pbrMetallicRoughness', {})
    slots = {'couleur': pbr.get('baseColorTexture'), 'normales': mat.get('normalTexture'), 'mr': pbr.get('metallicRoughnessTexture')}
    written = {}
    for name, ref in slots.items():
        if not ref: continue
        im = gl['images'][gl['textures'][ref['index']]['source']]
        bv = gl['bufferViews'][im['bufferView']]
        raw = b[bv.get('byteOffset', 0):bv.get('byteOffset', 0) + bv['byteLength']]
        ext = {'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp'}[im['mimeType']]
        path = os.path.join(out_dir, ('.' if name == 'mr' else '') + 'tex-%s.%s' % (name, ext)) if name != 'mr' else os.path.join(out_dir, '.mr.' + ext)
        open(path, 'wb').write(raw); written[name] = path
    return written

if __name__ == '__main__':
    mode = sys.argv[1]
    if mode == 'count':
        gl, P, I = read_glb(sys.argv[2]); print(len(I)); sys.exit(0)
    if mode == 'extract':
        print(extract(sys.argv[2], sys.argv[3])); sys.exit(0)
    if mode == 'orm':
        src_glb, ao_png, mr_jpg, out = sys.argv[2:6]
        ao = np.asarray(Image.open(ao_png).convert('L'))
        mask = uv_coverage(src_glb, ao.shape[0])
        print('couverture UV %.1f %%' % (100 * mask.mean()))
        ao = fill(ao, mask)
        if os.path.exists(mr_jpg):
            mr = np.asarray(Image.open(mr_jpg).convert('RGB').resize(ao.shape[::-1]))
            rough = mr[:, :, 1]
        else:
            rough = np.full_like(ao, 158)                       # rugosité 0,62 si le modèle n'en fournit pas
        orm = np.stack([ao, rough, np.zeros_like(ao)], axis=-1).astype(np.uint8)
        Image.fromarray(orm).save(out, lossless=True, quality=100, method=6)
    elif mode == 'normal':
        low_glb, normal_png, out = sys.argv[2:5]
        n = np.asarray(Image.open(normal_png).convert('RGB'))
        mask = uv_coverage(low_glb, n.shape[0])
        print('couverture UV %.1f %%' % (100 * mask.mean()))
        n = fill(n, mask)
        Image.fromarray(n).save(out, lossless=True, quality=100, method=6)
    print('ok', out, os.path.getsize(out))
