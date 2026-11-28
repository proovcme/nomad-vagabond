// Coordinates describe the old valley before the eastern field drifted 72 units away.
const gap = 72;
const fault = z => 39 + .14 * z + 2.6 * Math.sin(z * .15);
const originalX = x => x > 80 ? x - gap : x;

export function valleyElevation(x, z) {
  const u = originalX(x);
  const ridge = 17 * Math.exp(-((u + 24) ** 2 / 680 + (z + 6) ** 2 / 520));
  const pasture = 2.1 * Math.sin(u / 19) * Math.sin(z / 17);
  return ridge + pasture;
}

export function buildViaductBanks(scene, center, heading, scale, grassParts, rockParts) {
  const B = BABYLON;
  function mesh(name, points, indices, uvs, colors) {
    const m = new B.Mesh(name, scene), data = new B.VertexData();
    data.positions = points; data.indices = indices; data.uvs = uvs; data.normals = [];
    if (colors) data.colors = colors;
    B.VertexData.ComputeNormals(points, indices, data.normals);
    data.applyToMesh(m);
    m.position.copyFrom(center); m.rotation.y = heading; m.scaling.setAll(scale);
    return m;
  }
  for (const farm of [false, true]) {
    const positions = [], indices = [], uv = [], rim = [];
    const rows = 20, cols = 28, offset = farm ? gap : 0;
    for (let j = 0; j <= rows; j++) {
      const v = j / rows, z = -32 + v * 64;
      const taper = Math.abs(2 * v - 1) ** 3;
      const outer = farm ? 103 - 29*taper + 4*Math.cos(z*.15) : -62 + 22*taper + 5*Math.sin(z*.13);
      const split = fault(z);
      for (let i = 0; i <= cols; i++) {
        const t = i / cols;
        const u = farm ? split + (outer-split)*t : outer + (split-outer)*t;
        const away = farm ? t : 1-t;
        const cross = z + away*(2*v-1)*(5*Math.sin(u*.083) - (farm?8:3));
        positions.push(u+offset, valleyElevation(u+offset,cross), cross);
        uv.push((u+68)/180,(cross+42)/84);
        const k = j*(cols+1)+i;
        if(i && j) indices.push(k-cols-2,k-cols-1,k, k-cols-2,k,k-1);
      }
    }
    grassParts.push(mesh('oldValleySurface',positions,indices,uv));
    for(let i=0;i<=cols;i++) rim.push(i);
    for(let j=1;j<=rows;j++) rim.push(j*(cols+1)+cols);
    for(let i=cols-1;i>=0;i--) rim.push(rows*(cols+1)+i);
    for(let j=rows-1;j>0;j--) rim.push(j*(cols+1));
    const stone=[], faces=[], colors=[], stoneUV=[];
    function section(k) {
      const [x,top,z]=positions.slice(k*3,k*3+3), u=x-offset;
      const seam = -10 + .079*u - .14*z;
      const depth = farm ? 24+6*Math.cos(u*.09)+3*Math.sin(z*.22) :
        40+13*Math.cos((u+20)*.056)+7*Math.sin(z*.14+u*.05);
      const cx=farm?67:-12, ledge=1.3*Math.sin(z*.33+u*.19);
      const joint = Math.abs(Math.sin(z*.18+u*.23)) + .65*Math.cos(u*.29-z*.083);
      const spurX = (u-cx)*.048*joint, spurZ=z*.13*joint;
      return [[x,top,z],[x,top-1.4,z],[x+ledge+spurX,seam+1.8,z+.5*ledge+spurZ],
        [x+ledge+spurX,seam-1.5,z+.5*ledge+spurZ],[offset+cx+(u-cx)*.90,-depth*.72,z*.86+spurZ*1.5],
        [offset+cx+(u-cx)*.69+ledge,-depth,z*.62]];
    }
    const sections=rim.map(section);
    const inks=['#a47f4d','#ecab76','#ffe1a1','#d08a60','#a47b66','#846e63'].map(h=>B.Color3.FromHexString(h).toLinearSpace());
    function face(points, layer, shade) {
      const start=stone.length/3,c=inks[layer];
      for(const [x,y,z] of points){
        stone.push(x,y,z); stoneUV.push((x*.73+z*.64)*.046,y*.038);
        colors.push(c.r*shade,c.g*shade,c.b*shade,1);
      }
      faces.push(start,start+1,start+2);
      if(points.length===4)faces.push(start,start+2,start+3);
    }
    sections.forEach((a,i)=>{
      const b=sections[(i+1)%sections.length], grain=.95+.07*Math.sin(i*1.7);
      for(let h=0;h<5;h++) face([a[h],a[h+1],b[h+1],b[h]],h,grain);
      face([b[5],a[5],[offset+(farm?67:-12),farm?-33:-53,0]],5,grain);
    });
    rockParts.push(mesh('oldValleyFaults',stone,faces,stoneUV,colors));
  }
}
