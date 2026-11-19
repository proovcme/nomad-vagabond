import assert from 'node:assert/strict';
import { generateIslandGeometry } from '../src/islandGenerator.js';
import { createHash } from 'node:crypto';
const hash = g => createHash('sha256').update(JSON.stringify([g.top.positions,g.rock.positions])).digest('hex');
for (const style of ['forest','industrial']) for (const seed of [108,309,'AETHER-742','AUTUMN-12']) {
  const geometry = generateIslandGeometry({seed, style});
  assert.equal(hash(geometry),hash(generateIslandGeometry({seed, style})),'deterministic seed');
  assert.notEqual(hash(geometry),hash(generateIslandGeometry({seed:String(seed)+'x', style})),'distinct seeds');
  const ids = new Map(), edges = new Map();
  let nextID = 0;
  for (const mesh of [geometry.top,geometry.rock]) {
    assert(mesh.positions.every(Number.isFinite));
    assert(mesh.normals.every(Number.isFinite));
    const welded=[];
    for(let i=0;i<mesh.positions.length;i+=3){
      const key=mesh.positions.slice(i,i+3).map(n=>n.toFixed(5)).join(',');
      if(!ids.has(key))ids.set(key,nextID++);
      welded.push(ids.get(key));
      assert(Math.abs(Math.hypot(...mesh.normals.slice(i,i+3))-1)<1e-5,'unit normal');
    }
    for(let i=0;i<mesh.indices.length;i+=3){
      const triangle=mesh.indices.slice(i,i+3);
      const points=triangle.map(id=>mesh.positions.slice(id*3,id*3+3));
      const a=points[1].map((n,k)=>n-points[0][k]),b=points[2].map((n,k)=>n-points[0][k]);
      const cross=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
      assert(Math.hypot(...cross)>1e-7,'no degenerate triangle');
      if(mesh===geometry.top)assert(cross[1]<0,'Babylon clockwise top faces up');
      for(let j=0;j<3;j++){
        const aa=welded[triangle[j]],bb=welded[triangle[(j+1)%3]],key=[aa,bb].sort((a,b)=>a-b).join(',');
        const record=edges.get(key)||{count:0,direction:0};record.count++;record.direction+=aa<bb?1:-1;edges.set(key,record);
      }
    }
  }
  assert([...edges.values()].every(e=>e.count===2&&e.direction===0),'closed oriented manifold after material/UV seam welding');
  for(let i=0;i<geometry.top.positions.length;i+=3){
    const [x,y,z]=geometry.top.positions.slice(i,i+3);
    assert(Math.abs(geometry.getHeight(x,z)-y)<1e-8,'surface height matches mesh samples');
  }
  console.log(style,seed,'PASS',geometry.top.indices.length/3+geometry.rock.indices.length/3,'triangles',ids.size,'welded vertices',hash(geometry).slice(0,12));
}
