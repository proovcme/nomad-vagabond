#!/usr/bin/env python3
"""Check glTF triangle front faces against authored outward vertex normals.
Read-only by default. --repair flips only index order and keeps a before backup.
"""
import argparse,json,pathlib,sys,struct,collections,shutil
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parent))
import repair_building_surfaces as glb
import numpy as np
ROOT=pathlib.Path(__file__).resolve().parents[1]
NAMES=['flak_turret','radar_array','ether_generator','control_tower']
def run(name,repair=False):
 path=ROOT/'assets/buildings'/f'{name}.glb';doc,blob=glb.read_glb(path);binary=bytearray(blob);rows=[];wrong_count=0
 for mi,mesh in enumerate(doc['meshes']):
  for pi,p in enumerate(mesh['primitives']):
   positions=glb.accessor(doc,blob,p['attributes']['POSITION']);normals=glb.accessor(doc,blob,p['attributes']['NORMAL']);indices=glb.accessor(doc,blob,p['indices']).reshape(-1,3)
   pts=positions[indices];face=np.cross(pts[:,1]-pts[:,0],pts[:,2]-pts[:,0]);authored=normals[indices].mean(axis=1)
   flen=np.linalg.norm(face,axis=1);nlen=np.linalg.norm(authored,axis=1);valid=(flen>1e-9)&(nlen>1e-6)
   cosine=np.zeros(len(face));cosine[valid]=np.sum(face[valid]*authored[valid],axis=1)/(flen[valid]*nlen[valid])
   bad=np.flatnonzero(valid&(cosine<-.05));wrong_count+=len(bad)
   if repair and len(bad):
    a=doc['accessors'][p['indices']];v=doc['bufferViews'][a['bufferView']];dtype=glb.DTYPES[a['componentType']];offset=v.get('byteOffset',0)+a.get('byteOffset',0);stride=v.get('byteStride',dtype.itemsize)
    target=np.ndarray((a['count'],1),dtype=dtype,buffer=binary,offset=offset,strides=(stride,dtype.itemsize)).reshape(-1,3)
    target[bad]=target[bad][:,[0,2,1]]
   rows.append({'mesh':mi,'primitive':pi,'material':p.get('material'),'triangles':len(face),'inwardTriangles':len(bad),'degenerateTriangles':int(sum(flen<=1e-9)),'missingNormalTriangles':int(sum(nlen<=1e-6))})
 if repair and wrong_count:
  backup=ROOT/'artifacts/deploy-20261114/building-winding'/f'{name}.before.glb';backup.parent.mkdir(parents=True,exist_ok=True)
  if not backup.exists():shutil.copy2(path,backup)
  raw=bytearray(path.read_bytes());at=12
  while at<len(raw):
   size,kind=struct.unpack_from('<II',raw,at)
   if kind==0x004E4942:raw[at+8:at+8+size]=binary;break
   at+=8+size
  path.write_bytes(raw)
 return {'inwardTriangles':wrong_count,'triangles':sum(r['triangles']for r in rows),'primitives':rows,'repaired':bool(repair and wrong_count)}
if __name__=='__main__':
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--repair',action='store_true');p.add_argument('--report',default='artifacts/deploy-20261114/building-winding-audit.json');args=p.parse_args()
 result={name:run(name,args.repair)for name in NAMES}
 output=ROOT/args.report;output.parent.mkdir(parents=True,exist_ok=True);output.write_text(json.dumps(result,indent=2)+'\n')
 for name,r in result.items():print(name,json.dumps({'triangles':r['triangles'],'inwardTriangles':r['inwardTriangles'],'repaired':r['repaired']}))
 if not args.repair and any(r['inwardTriangles']for r in result.values()):sys.exit(1)
