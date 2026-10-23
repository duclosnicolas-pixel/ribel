import json, struct, numpy as np
def read_glb(path):
    with open(path,'rb') as f: data=f.read()
    magic,ver,length=struct.unpack_from('<III',data,0)
    assert magic==0x46546C67
    off=12; chunks={}
    while off<length:
        clen,ctype=struct.unpack_from('<II',data,off); off+=8
        chunks[ctype]=data[off:off+clen]; off+=clen
    gl=json.loads(chunks[0x4E4F534A]); binb=chunks.get(0x004E4942)
    def acc(i):
        a=gl['accessors'][i]; bv=gl['bufferViews'][a['bufferView']]
        comp={5126:np.float32,5125:np.uint32,5123:np.uint16,5121:np.uint8}[a['componentType']]
        n={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}[a['type']]
        start=bv.get('byteOffset',0)+a.get('byteOffset',0)
        stride=bv.get('byteStride',0)
        if stride and stride!=np.dtype(comp).itemsize*n:
            raw=np.frombuffer(binb,dtype=np.uint8,count=stride*a['count'],offset=start).reshape(a['count'],stride)
            return raw[:,:np.dtype(comp).itemsize*n].copy().view(comp).reshape(a['count'],n)
        return np.frombuffer(binb,dtype=comp,count=a['count']*n,offset=start).reshape(a['count'],n) if n>1 else np.frombuffer(binb,dtype=comp,count=a['count'],offset=start)
    prim=gl['meshes'][0]['primitives'][0]
    P=acc(prim['attributes']['POSITION']); I=acc(prim['indices']).reshape(-1,3)
    return gl,P,I
