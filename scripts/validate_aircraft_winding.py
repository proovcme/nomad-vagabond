#!/usr/bin/env python3
"""Audit/repair aircraft front-face index order against authored outward normals.
Only swaps indices of inward triangles. Vertex data, UVs, textures and shape stay unchanged.
"""
import argparse,hashlib,json,pathlib,shutil,struct,sys
import numpy as np
DTYPES={5121:np.dtype('u1'),5123:np.dtype('<u2'),5125:np.dtype('<u4'),5126:np.dtype('<f4')}
WIDTHS={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4}
def read_glb(path):
 raw=path.read_bytes();assert raw[:4]==b'glTF' and struct.unpack_from('<I',raw,4)[0]==2;assert struct.unpack_from('<I',raw,8)[0]==len(raw)
 at=12;chunks={}
 while at<len(raw):
  length,kind=struct.unpack_from('<II',raw,at);chunks[kind]=raw[at+8:at+8+length];at+=8+length
 return json.loads(chunks[0x4E4F534A]),chunks[0x004E4942]
def accessor(doc,blob,index):
 a=doc['accessors'][index];v=doc['bufferViews'][a['bufferView']];dtype=DTYPES[a['componentType']];width=WIDTHS[a['type']];offset=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',dtype.itemsize*width)
 assert offset%dtype.itemsize==0 and a.get('byteOffset',0)+(a['count']-1)*stride+dtype.itemsize*width<=v['byteLength']
 assert v.get('byteOffset',0)+v['byteLength']<=len(blob)
 return np.ndarray((a['count'],width),dtype=dtype,buffer=blob,offset=offset,strides=(stride,dtype.itemsize)).copy()
ROOT=pathlib.Path(__file__).resolve().parents[1]
NAMES=['scrapyard_plane','scrapyard_fighter','scrapyard_bomber','scrapyard_attacker']
def audit(doc,blob):
 rows=[]
 for mi,mesh in enumerate(doc['meshes']):
  for pi,p in enumerate(mesh['primitives']):
   positions=accessor(doc,blob,p['attributes']['POSITION']);normals=accessor(doc,blob,p['attributes']['NORMAL']);indices=accessor(doc,blob,p['indices']).reshape(-1,3)
   assert np.isfinite(positions).all() and np.isfinite(normals).all(),'Nonfinite geometry'
   assert len(normals)==len(positions) and indices.min()>=0 and indices.max()<len(positions),'Invalid vertex references'
   faces=positions[indices];cross=np.cross(faces[:,1]-faces[:,0],faces[:,2]-faces[:,0]);normal=normals[indices].mean(axis=1)
   length=np.linalg.norm(cross,axis=1);nlength=np.linalg.norm(normal,axis=1);valid=(length>1e-9)&(nlength>1e-6)
   cosine=np.zeros(len(faces));cosine[valid]=np.sum(cross[valid]*normal[valid],axis=1)/(length[valid]*nlength[valid])
   bad=np.flatnonzero(valid&(cosine<-.05))
   rows.append({'mesh':mi,'meshName':mesh.get('name'),'primitive':pi,'triangles':len(faces),'inwardTriangles':len(bad),'degenerateTriangles':int(sum(length<=1e-9)),'bad':bad,'indices':indices,'indexAccessor':p['indices']})
 return rows

def run(name,repair):
 path=ROOT/'assets/aircraft'/f'{name}.glb';raw=path.read_bytes();doc,blob=read_glb(path);rows=audit(doc,blob);before=sum(r['inwardTriangles']for r in rows);binary=bytearray(blob)
 index_views={doc['accessors'][r['indexAccessor']]['bufferView']for r in rows}
 if repair and before:
  backup=ROOT/'artifacts/deploy-20261114/aircraft-winding'/f'{name}.before.glb';backup.parent.mkdir(parents=True,exist_ok=True)
  if not backup.exists():shutil.copy2(path,backup)
  for row in rows:
   bad=row['bad']
   if not len(bad):continue
   a=doc['accessors'][row['indexAccessor']];v=doc['bufferViews'][a['bufferView']];dtype=DTYPES[a['componentType']];offset=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',dtype.itemsize)
   target=np.ndarray((a['count'],1),dtype=dtype,buffer=binary,offset=offset,strides=(stride,dtype.itemsize)).reshape(-1,3)
   target[bad]=row['indices'][bad][:,[0,2,1]]
  output=bytearray(raw);at=12
  while at<len(output):
   size,kind=struct.unpack_from('<II',output,at)
   if kind==0x004E4942:output[at+8:at+8+size]=binary;break
   at+=8+size
  path.write_bytes(output)
 finaldoc,finalbin=read_glb(path);after=audit(finaldoc,finalbin);assert finaldoc==doc
 backup_path=ROOT/'artifacts/deploy-20261114/aircraft-winding'/f'{name}.before.glb'
 reference_raw=raw
 if backup_path.exists():
  reference_doc,reference_blob=read_glb(backup_path);assert reference_doc==finaldoc,'Original asset JSON changed'
  reference_raw=backup_path.read_bytes()
  for view_index,view in enumerate(reference_doc['bufferViews']):
   if view_index in index_views:continue
   start=view.get('byteOffset',0);end=start+view['byteLength'];assert reference_blob[start:end]==finalbin[start:end],f'{name}: original nonindex bytes changed'
  for old,new in zip(audit(reference_doc,reference_blob),after):assert np.array_equal(np.sort(old['indices'],axis=1),np.sort(new['indices'],axis=1)),f'{name}: original triangle vertices changed'

 for i,view in enumerate(doc['bufferViews']):
  if i in index_views:continue
  start=view.get('byteOffset',0);end=start+view['byteLength'];assert blob[start:end]==finalbin[start:end],f'{name}: nonindex bytes changed'
 for old,new in zip(rows,after):
  assert np.array_equal(np.sort(old['indices'],axis=1),np.sort(new['indices'],axis=1)),f'{name}: triangle vertices changed'
 assert sum(r['degenerateTriangles']for r in rows)==sum(r['degenerateTriangles']for r in after)
 return {'file':str(path.relative_to(ROOT)),'triangles':sum(r['triangles']for r in rows),'beforeInwardTriangles':before,'afterInwardTriangles':sum(r['inwardTriangles']for r in after),'repaired':bool(repair and before),'sourceSHA256':hashlib.sha256(reference_raw).hexdigest(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'validation':{'jsonUnchanged':True,'allNonIndexBufferViewsByteIdentical':True,'eachTriangleUsesIdenticalVertices':True,'finiteGeometryAndAccessorBounds':True,'comparedToOriginalBackup':backup_path.exists()},'primitives':[{k:v for k,v in row.items()if k not in['bad','indices']}for row in after]}
if __name__=='__main__':
 parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--repair',action='store_true');parser.add_argument('--report',default='artifacts/deploy-20261114/aircraft-winding-audit.json');args=parser.parse_args()
 result={name:run(name,args.repair)for name in NAMES};out=ROOT/args.report;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,indent=2)+'\n')
 for name,row in result.items():print(name,json.dumps({k:v for k,v in row.items()if k not in['primitives','validation','file','sha256']}))
 if any(row['afterInwardTriangles']for row in result.values()):sys.exit(1)
