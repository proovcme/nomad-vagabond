export function makeGeometry(scene,p){
  const B=BABYLON,M=B.MeshBuilder;
  if(p.kind==='box')return M.CreateBox(p.name,{size:1},scene);
  if(p.kind==='sphere')return M.CreateSphere(p.name,{diameter:1,segments:14},scene);
  if(p.kind!=='loft')return M.CreateCylinder(p.name,{height:1,diameterBottom:1,diameterTop:p.kind==='cone'?0:1,tessellation:24},scene);
  const positions=[],uvs=[],indices=[],normals=[],n=p.sides;
  for(const [x,y,w,h] of p.sections){
    for(let j=0;j<=n;j++){
      const a=2*Math.PI*j/n;
      positions.push(x,y+h*Math.sin(a),w*Math.cos(a));uvs.push(x/4,j/n);
    }
  }
  for(let i=1;i<p.sections.length;i++)for(let j=0;j<n;j++){
    const a=(i-1)*(n+1)+j,b=a+n+1;
    indices.push(a,a+1,b,a+1,b+1,b);
  }
  // Independent end cap normals keep the cut edge crisp.
  for(const end of [0,p.sections.length-1]){
    const [x,y,w,h]=p.sections[end],c=positions.length/3;
    positions.push(x,y,0);uvs.push(.5,.5);
    for(let j=0;j<=n;j++){
      const a=j*2*Math.PI/n;
      positions.push(x,y+h*Math.sin(a),w*Math.cos(a));uvs.push(.5+.5*Math.cos(a),.5+.5*Math.sin(a));
      if(j){const k=c+j;indices.push(...(end?[c,k,k+1]:[c,k+1,k]));}
    }
  }
  B.VertexData.ComputeNormals(positions,indices,normals);
  for(let i=0;i<p.sections.length;i++){
    const a=i*(n+1)*3,b=a+n*3;
    const v=new B.Vector3(normals[a]+normals[b],normals[a+1]+normals[b+1],normals[a+2]+normals[b+2]).normalize();
    v.toArray(normals,a);v.toArray(normals,b);
  }
  const mesh=new B.Mesh(p.name,scene);
  Object.assign(new B.VertexData(),{positions,indices,normals,uvs}).applyToMesh(mesh);
  return mesh;
}
