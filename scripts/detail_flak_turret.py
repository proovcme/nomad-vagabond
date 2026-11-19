import pathlib,sys,json,struct,collections,math
sys.path.insert(0,'scripts');import repair_building_surfaces as r
import numpy as np
p=pathlib.Path('assets/buildings/flak_turret.glb');doc,oldbin=r.read_glb(p)
if doc.get('extras',{}).get('nomadDetailedTurret'):raise SystemExit('Already detailed')
backup=pathlib.Path('artifacts/deploy-20261114/building-winding/flak_turret.before-detail.glb');backup.write_bytes(p.read_bytes())
parts={k:{'POSITION':[],'NORMAL':[],'TEXCOORD_0':[],'indices':[]}for k in [0,1,2]}
def tri(a,b,c,mat,desired=None):
 a,b,c=map(lambda q:np.asarray(q,dtype=float),[a,b,c]);normal=np.cross(b-a,c-a)
 if np.linalg.norm(normal)<1e-10:return
 if desired is not None and np.dot(normal,desired)<0:b,c=c,b;normal=-normal
 normal/=np.linalg.norm(normal);s=parts[mat];i=len(s['POSITION']);s['POSITION'].extend([a.tolist(),b.tolist(),c.tolist()]);s['NORMAL'].extend([normal.tolist()]*3);s['TEXCOORD_0'].extend([[0,0],[1,0],[1,1]]);s['indices'].extend([i,i+1,i+2])
def quad(a,b,c,d,mat,desired):tri(a,b,c,mat,desired);tri(a,c,d,mat,desired)
def ring(center,axis,outer,inner,length,mat):
 center=np.asarray(center);axis=np.asarray(axis);axis/=np.linalg.norm(axis);u=np.cross(axis,[0,0,1]);u/=np.linalg.norm(u);v=np.cross(axis,u);n=12
 for i in range(n):
  a=i/n*math.tau;b=(i+1)/n*math.tau;ra=u*math.cos(a)+v*math.sin(a);rb=u*math.cos(b)+v*math.sin(b);lo=center-axis*length/2;hi=center+axis*length/2
  quad(lo+ra*outer,lo+rb*outer,hi+rb*outer,hi+ra*outer,mat,ra+rb)
  if inner>0:quad(lo+ra*inner,hi+ra*inner,hi+rb*inner,lo+rb*inner,mat,-ra-rb)
  else:tri(lo,lo+rb*outer,lo+ra*outer,mat,-axis);tri(hi,hi+ra*outer,hi+rb*outer,mat,axis);continue
  quad(lo+ra*inner,lo+rb*inner,lo+rb*outer,lo+ra*outer,mat,-axis)
  quad(hi+ra*inner,hi+ra*outer,hi+rb*outer,hi+rb*inner,mat,axis)
def shield(zcenter):
 # Two narrow chamfered sloping wings leave both gun mechanisms clear.
 y0,y1,z0,z1,c=2.55,5.12,zcenter-.43,zcenter+.43,.15
 profile=[(z0+c,y0),(z1-c,y0),(z1,y0+c),(z1,y1-c),(z1-c,y1),(z0+c,y1),(z0,y1-c),(z0,y0+c)]
 vertices=[]
 for offset in[-.13,.13]:
  for z,y in profile:vertices.append(np.array([2.86-(y-y0)*.30+offset,y,z]))
 center=np.mean(vertices,axis=0);n=len(profile)
 def add(a,b,c):tri(vertices[a],vertices[b],vertices[c],0,(vertices[a]+vertices[b]+vertices[c])/3-center)
 for i in range(n):j=(i+1)%n;add(i,j,n+j);add(i,n+j,n+i)
 for i in range(1,n-1):add(0,i,i+1);add(n,n+i+1,n+i)
for z in[-1.98,1.98]:shield(z)
axis=np.array([1,.24,0]);axis/=np.linalg.norm(axis)
for z in[-.85,.85]:
 for x in[4.8,6.65]:ring([x,3.67+(x-4.8)*.24,z],axis,.35,.265,.18,1)
 ring([3.4,3.32,z],axis,.55,.475,.18,1)
for i in range(10):
 angle=i/10*math.tau;ring([math.cos(angle)*2.85,2.055,math.sin(angle)*2.85],np.array([0.,1.,0.]),.13,0,.13,2)
binary=bytearray(oldbin)
def append_accessor(data,kind,width,component):
 arr=np.asarray(data,dtype='<f4'if component==5126 else'<u4');binary.extend(b'\0'*((-len(binary))%4));offset=len(binary);binary.extend(arr.tobytes());vi=len(doc['bufferViews']);doc['bufferViews'].append({'buffer':0,'byteOffset':offset,'byteLength':arr.nbytes,'target':34963 if kind=='indices'else 34962});ai=len(doc['accessors']);a={'bufferView':vi,'componentType':component,'count':len(arr),'type':'SCALAR'if width==1 else'VEC'+str(width)}
 if kind=='POSITION':a.update(min=arr.min(axis=0).tolist(),max=arr.max(axis=0).tolist())
 doc['accessors'].append(a);return ai
for material,s in parts.items():
 attrs={k:append_accessor(s[k],k,3 if k!='TEXCOORD_0'else 2,5126)for k in ['POSITION','NORMAL','TEXCOORD_0']};idx=append_accessor(s['indices'],'indices',1,5125);doc['meshes'][0]['primitives'].append({'attributes':attrs,'indices':idx,'material':material,'mode':4})
doc.setdefault('extras',{})['nomadDetailedTurret']={'description':'Armored sloping shield wings, three recuperator/barrel collars per gun and ten base fasteners','newTriangles':sum(len(s['indices'])//3 for s in parts.values())};doc['buffers'][0]['byteLength']=len(binary);binary.extend(b'\0'*((-len(binary))%4));js=json.dumps(doc,separators=(',',':')).encode();js+=b' '*((-len(js))%4);p.write_bytes(struct.pack('<III',0x46546c67,2,12+8+len(js)+8+len(binary))+struct.pack('<II',len(js),0x4e4f534a)+js+struct.pack('<II',len(binary),0x004e4942)+binary)
print(doc['extras']['nomadDetailedTurret'])
