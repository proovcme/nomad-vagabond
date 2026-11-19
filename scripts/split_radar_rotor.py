import json,struct,pathlib,sys,copy,collections
sys.path.insert(0,'scripts');import repair_building_surfaces as r
import numpy as np
p=pathlib.Path('assets/buildings/radar_array.glb');doc,oldbin=r.read_glb(p)
if any(n.get('name')=='radarRotor'for n in doc['nodes']):raise SystemExit('Already split')
backup=pathlib.Path('artifacts/deploy-20261114/building-winding/radar_array.before-rotor-split.glb');backup.write_bytes(p.read_bytes())
binary=bytearray(oldbin);static=[];moving=[];evidence=[]
for pi,primitive in enumerate(doc['meshes'][0]['primitives']):
 pos=r.accessor(doc,oldbin,primitive['attributes']['POSITION']);ids=r.accessor(doc,oldbin,primitive['indices']).reshape(-1,3);adj=collections.defaultdict(set)
 for i,f in enumerate(ids):
  for v in f:adj[tuple(np.round(pos[v],4))].add(i)
 todo=set(range(len(ids)));move=[];stay=[]
 while todo:
  start=todo.pop();group={start};q=[start]
  while q:
   for v in ids[q.pop()]:
    for n in list(adj[tuple(np.round(pos[v],4))]&todo):todo.remove(n);group.add(n);q.append(n)
  points=pos[ids[list(group)].flatten()];isMoving=float(points[:,1].max())>5
  (move if isMoving else stay).extend(sorted(group));evidence.append({'primitive':pi,'triangles':len(group),'moving':isMoving,'min':points.min(axis=0).tolist(),'max':points.max(axis=0).tolist()})
 for selection,target in [(stay,static),(move,moving)]:
  if not selection:continue
  selected=np.asarray(ids[selection].reshape(-1),dtype='<u4');binary.extend(b'\0'*((-len(binary))%4));offset=len(binary);binary.extend(selected.tobytes());vi=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':selected.nbytes,'target':34963});ai=len(doc['accessors']);doc['accessors'].append({'bufferView':vi,'componentType':5125,'count':len(selected),'type':'SCALAR'});pr=copy.deepcopy(primitive);pr['indices']=ai;target.append(pr)
doc['meshes']=[{'name':'radarBaseGeometry','primitives':static},{'name':'radarUpperDishGeometry','primitives':moving}]
doc['nodes']=[{'name':'radar_array','children':[1,2]},{'name':'radarBase','mesh':0},{'name':'radarRotor','translation':[0,3.6,0],'children':[3]},{'name':'radarRotorMesh','mesh':1,'translation':[0,-3.6,0]}];doc['scenes']=[{'nodes':[0]}];doc['scene']=0;doc['buffers'][0]['byteLength']=len(binary);binary.extend(b'\0'*((-len(binary))%4));js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4);raw=struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary;p.write_bytes(raw)
pathlib.Path('artifacts/deploy-20261114/building-winding/radar-rotor-split.json').write_text(json.dumps({'pivot':[0,3.6,0],'staticTriangles':sum(doc['accessors'][p['indices']]['count']//3 for p in static),'movingTriangles':sum(doc['accessors'][p['indices']]['count']//3 for p in moving),'components':evidence},indent=2))
print('Static',sum(len(ids)for ids in []),'primitives',len(static),'movingprimitives',len(moving),'faces',sum(doc['accessors'][p['indices']]['count']//3 for p in static+moving))
