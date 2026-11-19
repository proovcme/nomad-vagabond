#!/usr/bin/env python3
"""Deterministic texture-only GLB repack. Geometry, skinning and animation accessors stay byte-identical.
Resizes large embedded PNGs, renormalizes downsampled tangent-space normals,
keeps the skin/face base-color atlas at 2048, and shares identical embedded image payloads.
"""
import argparse, hashlib, io, json, pathlib, shutil, struct
import numpy as np
from PIL import Image

def digest(data): return hashlib.sha256(data).hexdigest()
def parse(path):
    data=path.read_bytes()
    magic,version,total=struct.unpack_from('<III',data)
    assert magic==0x46546C67 and version==2 and total==len(data)
    chunks=[];offset=12
    while offset<len(data):
        length,kind=struct.unpack_from('<II',data,offset);offset+=8
        assert offset+length<=len(data)
        chunks.append((kind,data[offset:offset+length]));offset+=length
    assert len(chunks)==2 and chunks[0][0]==0x4E4F534A and chunks[1][0]==0x004E4942
    return json.loads(chunks[0][1]),chunks[1][1],data

def optimize(source,destination,report_path,backup):
    assert source.resolve()!=destination.resolve(),'Output must be a candidate path, never the live input'
    original,oldbin,oldfile=parse(source)
    assert len(original['buffers'])==1 and 'uri' not in original['buffers'][0]
    doc=json.loads(json.dumps(original))
    if backup:
        backup.parent.mkdir(parents=True,exist_ok=True)
        if backup.exists(): assert digest(backup.read_bytes())==digest(oldfile),'Backup already contains another source version'
        else:shutil.copy2(source,backup)
    image_views={image['bufferView'] for image in doc.get('images',[]) if 'bufferView'in image}
    assert all(a.get('bufferView') not in image_views for a in doc.get('accessors',[]))
    normal_images=set()
    for material in doc.get('materials',[]):
        if 'normalTexture' in material:normal_images.add(doc['textures'][material['normalTexture']['index']]['source'])
    payloads={};rows=[]
    for i,image in enumerate(doc.get('images',[])):
        assert image.get('mimeType')=='image/png' and 'bufferView'in image
        view=original['bufferViews'][image['bufferView']];start=view.get('byteOffset',0)
        encoded=oldbin[start:start+view['byteLength']];bitmap=Image.open(io.BytesIO(encoded));bitmap.load()
        oldsize=bitmap.size;mode=bitmap.mode
        alpha_before=bitmap.getchannel('A').getextrema() if 'A' in bitmap.getbands() else None
        # The skin atlas includes the face. Keep its original 2k base-color detail.
        limit=2048 if image.get('name')=='T_Superhero_Male_Dark' else 1024
        resized=max(oldsize)>limit
        if resized:
            scale=limit/max(oldsize);size=(max(1,round(oldsize[0]*scale)),max(1,round(oldsize[1]*scale)))
            bitmap=bitmap.resize(size,Image.Resampling.LANCZOS)
            if i in normal_images:
                pixels=np.asarray(bitmap).copy();vectors=pixels[:,:,:3].astype(np.float32)/127.5-1
                length=np.maximum(np.linalg.norm(vectors,axis=2,keepdims=True),1e-8)
                pixels[:,:,:3]=np.rint(np.clip((vectors/length+1)*127.5,0,255)).astype(np.uint8)
                bitmap=Image.fromarray(pixels,mode=mode)
            output=io.BytesIO();bitmap.save(output,format='PNG',optimize=True,compress_level=9)
            encoded=output.getvalue()
        payloads[image['bufferView']]=encoded
        alpha_after=bitmap.getchannel('A').getextrema() if 'A' in bitmap.getbands() else None
        assert bitmap.mode==mode
        rows.append({'index':i,'name':image.get('name'),'normalMap':i in normal_images,'beforeDimensions':oldsize,'afterDimensions':bitmap.size,'beforeBytes':view['byteLength'],'afterBytes':len(encoded),'resized':resized,'alphaBefore':alpha_before,'alphaAfter':alpha_after,'payloadSHA256':digest(encoded)})
    newbin=bytearray();shared={};shared_count=0
    for i,view in enumerate(doc['bufferViews']):
        previous=original['bufferViews'][i];start=previous.get('byteOffset',0)
        encoded=payloads.get(i,oldbin[start:start+previous['byteLength']])
        key=digest(encoded) if i in image_views else None
        if key and key in shared:
            newoffset=shared[key];shared_count+=1
        else:
            newbin.extend(b'\0'*((-len(newbin))%4));newoffset=len(newbin);newbin.extend(encoded)
            if key:shared[key]=newoffset
        view['byteOffset']=newoffset;view['byteLength']=len(encoded)
    doc['buffers'][0]['byteLength']=len(newbin)
    newbin.extend(b'\0'*((-len(newbin))%4))
    js=json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode();js+=b' '*((-len(js))%4)
    output=struct.pack('<III',0x46546C67,2,12+8+len(js)+8+len(newbin))+struct.pack('<II',len(js),0x4E4F534A)+js+struct.pack('<II',len(newbin),0x004E4942)+newbin
    destination.parent.mkdir(parents=True,exist_ok=True);destination.write_bytes(output)
    # Validate the serialized artifact rather than only in-memory construction.
    verified,verifiedbin,_=parse(destination)
    for field in ['accessors','meshes','skins','animations','nodes','materials','textures','samplers','scenes']:
        assert original.get(field)==verified.get(field),f'{field} changed'
    for i,(old,new) in enumerate(zip(original['bufferViews'],verified['bufferViews'])):
        assert new.get('byteOffset',0)%4==0
        assert new.get('byteOffset',0)+new['byteLength']<=verified['buffers'][0]['byteLength']
        oldbytes=oldbin[old.get('byteOffset',0):old.get('byteOffset',0)+old['byteLength']]
        newbytes=verifiedbin[new.get('byteOffset',0):new.get('byteOffset',0)+new['byteLength']]
        if i not in image_views:assert oldbytes==newbytes,f'Geometry/animation bufferView {i} differs'
    component_sizes={5120:1,5121:1,5122:2,5123:2,5125:4,5126:4}
    type_sizes={'SCALAR':1,'VEC2':2,'VEC3':3,'VEC4':4,'MAT2':4,'MAT3':9,'MAT4':16}
    for i,accessor in enumerate(verified['accessors']):
        if 'bufferView' not in accessor:continue
        view=verified['bufferViews'][accessor['bufferView']]
        element_size=component_sizes[accessor['componentType']]*type_sizes[accessor['type']]
        end=accessor.get('byteOffset',0)+(accessor['count']-1)*view.get('byteStride',element_size)+element_size
        assert end<=view['byteLength'],f'Accessor {i} exceeds bufferView'
    vertices=triangles=0
    for mesh in verified['meshes']:
        for primitive in mesh['primitives']:
            count=verified['accessors'][primitive['attributes']['POSITION']]['count'];vertices+=count
            assert primitive.get('mode',4)==4
            indices=verified['accessors'][primitive['indices']];view=verified['bufferViews'][indices['bufferView']]
            assert indices['componentType'] in [5121,5123,5125]
            fmt={5121:'B',5123:'H',5125:'I'}[indices['componentType']];size=component_sizes[indices['componentType']]
            start=view.get('byteOffset',0)+indices.get('byteOffset',0)
            values=[struct.unpack_from('<'+fmt,verifiedbin,start+k*view.get('byteStride',size))[0] for k in range(indices['count'])]
            assert len(values)%3==0 and min(values)>=0 and max(values)<count
            triangles+=len(values)//3
    report={'source':str(source),'candidate':str(destination),'backup':str(backup) if backup else None,'sourceSHA256':digest(oldfile),'candidateSHA256':digest(output),'beforeBytes':len(oldfile),'afterBytes':len(output),'reductionPercent':round((1-len(output)/len(oldfile))*100,2),'vertices':vertices,'triangles':triangles,'nodes':len(verified['nodes']),'skins':len(verified['skins']),'animations':len(verified['animations']),'imagePayloadsShared':shared_count,'validation':{'unchangedAccessorJSON':True,'nonImageBufferViewsByteIdentical':True,'allBufferViewsAlignedAndInBounds':True,'allAccessorsInBounds':True,'allIndicesInVertexRange':True,'materialsSkinningAndAnimationsUnchanged':True,'liveSourceSHA256Unchanged':digest(source.read_bytes())==digest(oldfile)},'images':rows}
    report_path.parent.mkdir(parents=True,exist_ok=True);report_path.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({k:v for k,v in report.items() if k not in ['images','validation']},indent=2))

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('source',type=pathlib.Path);parser.add_argument('candidate',type=pathlib.Path);parser.add_argument('--report',required=True,type=pathlib.Path);parser.add_argument('--backup',type=pathlib.Path)
    args=parser.parse_args();optimize(args.source,args.candidate,args.report,args.backup)
