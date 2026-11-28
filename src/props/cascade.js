// UV.y runs from one at the lip to zero in the spray.
export function cascadeMesh(scene,name,lip,height,width,drift,throwScale=1) {
  const B=BABYLON, positions=[],indices=[],uvs=[],normals=[];
  const bands=10,rows=16;
  for(let r=0;r<=rows;r++){
    const t=r/rows;
    for(let j=0;j<=bands;j++){
      const u=j/bands, p=lip(u);
      const plume=Math.sin(u*Math.PI*3.3+.4);
      const distance=width*throwScale*(1-Math.exp(-4*t))*(.73+.09*plume)+width*t*t*.34;
      const spread=(u-.5)*width*t*t*.42;
      positions.push(p.x+drift.x*distance+drift.z*spread,
        p.y-height*t*t*(.95+.05*plume),p.z+drift.z*distance-drift.x*spread);
      uvs.push(u,1-t);
      if(r&&j){const a=r*(bands+1)+j,b=a-bands-1;indices.push(a,b,b-1,a,b-1,a-1);}
    }
  }
  B.VertexData.ComputeNormals(positions,indices,normals);
  const data=new B.VertexData();Object.assign(data,{positions,indices,normals,uvs});
  const mesh=new B.Mesh(name,scene);data.applyToMesh(mesh);mesh.isPickable=false;return mesh;
}
export const riverX=z=>10+(z+4)/56*8+Math.sin(z*.14)*3.5;
export const riverLevel=z=>-.55-Math.max(0,z-9)*.045;
