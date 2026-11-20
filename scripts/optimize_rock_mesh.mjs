// Offline static-mesh simplification; runtime needs no meshoptimizer decoder.
import fs from 'node:fs';import path from 'node:path';
import {MeshoptSimplifier as M} from 'meshoptimizer';
await M.ready;
const input='assets/benchmark/models/boulder_01/boulder_01_1k.gltf',dir=path.dirname(input),doc=JSON.parse(fs.readFileSync(input));
const binPath=path.join(dir,doc.buffers[0].uri),bin=fs.readFileSync(binPath),backup='artifacts/deploy-20261114/optimization/boulder-original';
fs.mkdirSync(backup,{recursive:true});
for(const p of [input,binPath])if(!fs.existsSync(path.join(backup,path.basename(p))))fs.copyFileSync(p,path.join(backup,path.basename(p)));
function array(index,Ctor){const a=doc.accessors[index],v=doc.bufferViews[a.bufferView],n={SCALAR:1,VEC2:2,VEC3:3}[a.type];if(v.byteStride)throw Error('Interleaved view unsupported');return new Ctor(bin.buffer,bin.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*n).slice();}
const evidence=[];
for(const mesh of doc.meshes)for(const p of mesh.primitives){
 const a=doc.accessors[p.indices],indices=array(p.indices,Uint32Array),positions=array(p.attributes.POSITION,Float32Array),normals=array(p.attributes.NORMAL,Float32Array),uv=array(p.attributes.TEXCOORD_0,Float32Array);
 const attributes=new Float32Array(positions.length/3*5);
 for(let i=0;i<positions.length/3;i++)attributes.set([...normals.subarray(i*3,i*3+3),...uv.subarray(i*2,i*2+2)],i*5);
 const [simplified,error]=M.simplifyWithAttributes(indices,positions,3,attributes,5,[.25,.25,.25,.2,.2],null,24000,.015,['LockBorder','Permissive']);
 if(!simplified.length||simplified.length>=indices.length)throw Error('No simplification achieved');
 if(simplified.some(i=>i>=positions.length/3))throw Error('Invalid index');
 const v=doc.bufferViews[a.bufferView],offset=(v.byteOffset||0)+(a.byteOffset||0);
 Buffer.from(simplified.buffer,simplified.byteOffset,simplified.byteLength).copy(bin,offset);
 a.count=simplified.length;
 evidence.push({beforeTriangles:indices.length/3,afterTriangles:simplified.length/3,relativeError:error,preserved:'Original positions, normals, UVs, materials and textures; only triangle indices changed'});
}
fs.writeFileSync(binPath,bin);fs.writeFileSync(input,JSON.stringify(doc));fs.writeFileSync('artifacts/deploy-20261114/optimization/rock-mesh.json',JSON.stringify(evidence,null,2));console.log(evidence);
