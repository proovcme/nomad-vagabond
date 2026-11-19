#!/usr/bin/env python3
"""Audit/clip positive-area overlaps of identically oriented coplanar GLB triangles.
Requires numpy and shapely (pip install --target /tmp/ow-geometry numpy shapely).
Default is read-only; --repair backs up targets and writes corrected binary geometry.
Keeps original images/materials and interpolates NORMAL/UV using barycentric weights.
"""
import argparse, collections, json, math, pathlib, shutil, struct, sys
sys.path.insert(0, '/tmp/ow-geometry')
import numpy as np
from shapely.geometry import Polygon
from shapely.ops import triangulate, unary_union

ROOT = pathlib.Path(__file__).resolve().parents[1]
DTYPES = {5121: np.dtype('u1'), 5123: np.dtype('<u2'), 5125: np.dtype('<u4'), 5126: np.dtype('<f4')}
WIDTHS = {'SCALAR': 1, 'VEC2': 2, 'VEC3': 3, 'VEC4': 4}
EPS = 1e-7

def read_glb(path):
    raw = path.read_bytes()
    assert raw[:4] == b'glTF'
    at = 12
    chunks = {}
    while at < len(raw):
        length, kind = struct.unpack_from('<II', raw, at)
        chunks[kind] = raw[at+8:at+8+length]
        at += length + 8
    return json.loads(chunks[0x4E4F534A]), chunks[0x004E4942]

def accessor(doc, binary, index):
    a = doc['accessors'][index]
    v = doc['bufferViews'][a['bufferView']]
    dtype = DTYPES[a['componentType']]
    width = WIDTHS[a['type']]
    offset = v.get('byteOffset', 0) + a.get('byteOffset', 0)
    stride = v.get('byteStride', dtype.itemsize * width)
    return np.ndarray((a['count'], width), dtype=dtype, buffer=binary, offset=offset, strides=(stride, dtype.itemsize)).copy()

def triangles(doc, binary):
    result = []
    primitive_id = 0
    for mesh in doc['meshes']:
        for primitive in mesh['primitives']:
            assert primitive.get('mode', 4) == 4
            attrs = {name: accessor(doc, binary, i) for name, i in primitive['attributes'].items()}
            assert set(attrs) <= {'POSITION', 'NORMAL', 'TEXCOORD_0'}, set(attrs)
            indices = accessor(doc, binary, primitive['indices']).reshape(-1, 3)
            for face, ids in enumerate(indices):
                p = attrs['POSITION'][ids].astype(np.float64)
                normal = np.cross(p[1]-p[0], p[2]-p[0])
                length = np.linalg.norm(normal)
                if length < 1e-10:
                    continue
                normal /= length
                d = np.dot(normal, p[0])
                # Same orientation only: opposite-facing closed-solid faces remain intact.
                key = tuple(np.round(normal, 5)) + (round(float(d), 5),)
                axis = int(np.argmax(np.abs(normal)))
                axes = [i for i in range(3) if i != axis]
                poly = Polygon(p[:, axes])
                result.append(dict(pid=primitive_id, face=face, points=p, attrs={k:v[ids] for k,v in attrs.items()}, normal=normal, key=key, axes=axes, poly=poly, area=poly.area))
            primitive_id += 1
    return result

def audit(rows):
    groups = collections.defaultdict(list)
    for row in rows:
        groups[row['key']].append(row)
    pairs = 0
    area = 0
    samples = []
    for group in groups.values():
        for i, a in enumerate(group):
            for b in group[i+1:]:
                overlap = a['poly'].intersection(b['poly']).area
                if overlap > EPS:
                    pairs += 1
                    area += overlap / abs(a['normal'][3 - sum(a['axes'])])
                    if len(samples) < 12:
                        samples.append({'a':[a['pid'], a['face']], 'b':[b['pid'], b['face']], 'area':round(overlap, 6), 'plane':list(a['key'])})
    return {'triangles':len(rows), 'overlapping_pairs':pairs, 'overlap_area_world_units2':round(float(area), 8), 'examples':samples}, groups

def clip(groups):
    output = collections.defaultdict(list)
    changed = 0
    for group in groups.values():
        covered = None
        # Small authored details take precedence over large panel surfaces.
        for row in sorted(group, key=lambda x:(x['area'], x['pid'], x['face'])):
            poly = row['poly']
            remaining = poly if covered is None else poly.difference(covered)
            overlap = poly.area - remaining.area
            if overlap <= EPS:
                output[row['pid']].append(row['attrs'])
            else:
                changed += 1
                parts = [remaining] if remaining.geom_type == 'Polygon' else list(getattr(remaining, 'geoms', []))
                accepted_area = 0
                for part in parts:
                    if part.geom_type != 'Polygon' or part.area <= EPS:
                        continue
                    for triangle in triangulate(part):
                        if triangle.area <= EPS or not part.covers(triangle):
                            continue
                        accepted_area += triangle.area
                        xy = np.array(triangle.exterior.coords[:3])
                        original_xy = row['points'][:, row['axes']]
                        basis = np.vstack([original_xy.T, np.ones(3)])
                        weights = np.linalg.solve(basis, np.vstack([xy.T, np.ones(3)])).T
                        attrs = {name: weights @ value for name, value in row['attrs'].items()}
                        p = attrs['POSITION']
                        if np.dot(np.cross(p[1]-p[0],p[2]-p[0]), row['normal']) < 0:
                            attrs = {name: value[[0,2,1]] for name,value in attrs.items()}
                        if 'NORMAL' in attrs:
                            norm = np.linalg.norm(attrs['NORMAL'],axis=1,keepdims=True)
                            attrs['NORMAL'] /= np.maximum(norm,1e-12)
                        output[row['pid']].append(attrs)
                assert abs(accepted_area - remaining.area) < 1e-5, ('triangulation lost area', accepted_area, remaining.area)
            covered = poly if covered is None else unary_union([covered, poly])
    return output, changed

def write(doc, binary, output, path):
    data = bytearray(binary[:doc['buffers'][0]['byteLength']])
    def append(array, component_type, typ, accessor_index):
        data.extend(b'\0' * (-len(data) % 4))
        offset = len(data)
        payload = array.tobytes()
        data.extend(payload)
        view_index = len(doc['bufferViews'])
        doc['bufferViews'].append({'buffer':0, 'byteOffset':offset, 'byteLength':len(payload)})
        a = {'bufferView':view_index,'componentType':component_type,'count':len(array),'type':typ}
        if typ == 'VEC3':
            a['min'] = array.min(axis=0).tolist()
            a['max'] = array.max(axis=0).tolist()
        doc['accessors'][accessor_index] = a
    pid = 0
    for mesh in doc['meshes']:
        for primitive in mesh['primitives']:
            faces = output[pid]
            assert faces, 'Cannot remove entire primitive without reindexing'
            count = len(faces) * 3
            for name, index in primitive['attributes'].items():
                array = np.concatenate([face[name] for face in faces]).astype('<f4')
                append(array,5126,'VEC'+str(array.shape[1]),index)
            append(np.arange(count,dtype='<u4').reshape(-1,1),5125,'SCALAR',primitive['indices'])
            pid += 1
    doc['buffers'][0]['byteLength'] = len(data)
    encoded = json.dumps(doc,separators=(',',':')).encode()
    encoded += b' ' * (-len(encoded)%4)
    data.extend(b'\0' * (-len(data)%4))
    total = 12 + 8 + len(encoded) + 8 + len(data)
    path.write_bytes(struct.pack('<4sII',b'glTF',2,total)+struct.pack('<II',len(encoded),0x4E4F534A)+encoded+struct.pack('<II',len(data),0x004E4942)+data)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repair',action='store_true')
    parser.add_argument('--report',default='artifacts/first-pass/models/surface-repair-report.json')
    args=parser.parse_args()
    report={}
    for name in ['flak_turret','radar_array','ether_generator','control_tower']:
        path=ROOT/'assets/buildings'/f'{name}.glb'
        doc,binary=read_glb(path)
        before,groups=audit(triangles(doc,binary))
        entry={'before':before,'modified':False}
        if args.repair and name in ['flak_turret','radar_array','ether_generator'] and before['overlapping_pairs']:
            backup=ROOT/'artifacts/first-pass/models'/f'{name}.original.glb'
            backup.parent.mkdir(parents=True,exist_ok=True)
            if not backup.exists(): shutil.copy2(path,backup)
            output,changed=clip(groups)
            temp=path.with_suffix('.repair.glb')
            write(doc,binary,output,temp)
            after_doc,after_binary=read_glb(temp)
            after,_=audit(triangles(after_doc,after_binary))
            if after['overlapping_pairs']:
                temp.unlink()
                raise RuntimeError(f'{name}: overlapping surfaces remain: {after}')
            temp.replace(path)
            entry.update(modified=True,changed_source_triangles=changed,after=after,backup=str(backup.relative_to(ROOT)))
        report[name]=entry
        print(name,json.dumps({k:v for k,v in before.items() if k!='examples'}),'->', {k:v for k,v in entry.get('after',{}).items() if k!='examples'})
    report_path=ROOT/args.report
    report_path.parent.mkdir(parents=True,exist_ok=True)
    report_path.write_text(json.dumps(report,indent=2)+'\n')

if __name__=='__main__': main()
