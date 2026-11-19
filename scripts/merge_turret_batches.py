import pathlib,sys,json,struct,collections
sys.path.insert(0,'scripts');import repair_building_surfaces as r
import numpy as np
p=pathlib.Path('assets/buildings/flak_turret.glb');doc,oldbin=r.read_glb(p);binary=bytearray(oldbin);merged=[]
def append(data,width,component,target):
 arr=np.asarray(data,dtype='<f4'if component==5126 else '<u4');binary.extend(b'\0'*((-len(binary))%4));off=len(binary);binary.extend(arr.tobytes());v=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':off,'byteLength':arr.nbytes,'target':target});a=len(doc['accessors']);acc={'bufferView':v,'componentType':component,'count':len(arr),'type':'SCALAR'if width==1 else 'VEC'+str(width)}
 if width==3 and target==34962:acc.update(min=arr.min(axis=0).tolist(),max=arr.max(axis=0).tolist())
 doc['accessors'].append(acc);return a
for mat in [1,2,0]:
 prims=[p for p in doc['meshes'][0]['primitives']if p['material']==mat];attrs={k:[]for k in ['POSITION','NORMAL','TEXCOORD_0']};ids=[];offset=0
 for prim in prims:
  n=len(r.accessor(doc,oldbin,prim['attributes']['POSITION']))
  for k in attrs:attrs[k].extend(r.accessor(doc,oldbin,prim['attributes'][k]).tolist())
  ids.extend((r.accessor(doc,oldbin,prim['indices']).reshape(-1)+offset).tolist());offset+=n
 output={k:append(data,2 if k=='TEXCOORD_0'else 3,5126,34962)for k,data in attrs.items()};merged.append({'attributes':output,'indices':append(ids,1,5125,34963),'material':mat,'mode':4})
doc['meshes'][0]['primitives']=merged;doc['buffers'][0]['byteLength']=len(binary);binary.extend(b'\0'*((-len(binary))%4));js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4);p.write_bytes(struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary);print('Turret still3 materialbatches',len(merged))
