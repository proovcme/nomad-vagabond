// A continuous rim joins the turf to stepped, fissured rock. Both pieces go into the horizon batches.
export function headland(scene, seed, radius, depth, stoneParts, turfParts, center) {
  const B=BABYLON, count=48,profiles=[[1,0],[1.015,.05],[.94,.20],[.96,.25],[.92,.42],[.78,.47],[.83,.66],[.52,.74]];
  const points=[],colors=[],uvs=[],indices=[],normals=[];
  for(const [layer,[scale,drop]] of profiles.entries()){
    for(let j=0;j<=count;j++){
      const a=j%count*Math.PI*2/count,fold=Math.sin(7*a+seed)*.046+Math.sin(3*a+.3*seed)*.082;
      const tooth=.13*Math.sin(5*a+seed)+.1*Math.cos(3*a-seed);
      // Fracture the lower beds into stepped buttresses, with a broad overhang at one end.
      const joint=Math.pow(.5+.5*Math.sin(5*a+seed),4);
      const undercut=drop*(.18*Math.cos(a-seed)+.15*joint);
      const r=radius*(1+fold)*(scale+undercut);
      points.push(r*Math.cos(a)-drop*radius*.12,-depth*drop*(1+tooth+.29*joint*drop),r*.91*Math.sin(a));
      const shelfShade=[1,.94,.76,.94,.84,.66,.76,.62][layer];
      const light=(.84+.12*Math.cos(3*a+.5)+.08*Math.sin(12*a+.6*layer))*shelfShade;
      colors.push(light,light*(.98-.07*drop),light*(.93-.12*drop),1);uvs.push(j/count*4,drop*2);
      if(j&&layer){const k=layer*(count+1)+j,b=k-count-1;indices.push(k,b-1,b,k,k-1,b-1);}
    }
  }
  const bottom=points.length/3;
  points.push(-radius*.18,-depth*.87,0);colors.push(.46,.36,.29,1);uvs.push(.5,2);
  const last=(profiles.length-1)*(count+1);
  for(let j=0;j<count;j++)indices.push(bottom,last+j+1,last+j);
  // Test one normal against the radial direction, since the scene uses right-handed rendering.
  B.VertexData.ComputeNormals(points,indices,normals);
  if(normals[0]<0){indices.reverse();B.VertexData.ComputeNormals(points,indices,normals);}
  const shell=new B.Mesh('terracedHeadland',scene);
  const data=new B.VertexData();Object.assign(data,{positions:points,indices,normals,colors,uvs});data.applyToMesh(shell);
  shell.position.copyFrom(center);stoneParts.push(shell);
  const grass=new B.Mesh('headlandMeadow',scene),top=new B.VertexData();
  top.positions=[0,0,0,...points.slice(0,count*3)];top.indices=[];top.uvs=[];top.normals=[];
  for(let j=0;j<=count;j++){
    top.uvs.push(.5+top.positions[j*3]/(2.4*radius),.5+top.positions[j*3+2]/(2.4*radius));
    top.normals.push(0,1,0);
    if(j)top.indices.push(0,j,j%count+1);
  }
  top.applyToMesh(grass);grass.position.copyFrom(center);turfParts.push(grass);
}

export function bridgeLift(scene,kind,scale,heading,base,materials,rotors) {
  const B=BABYLON,root=new B.TransformNode('bridgeLift_'+kind,scene);
  root.position.copyFrom(base);root.rotation.y=heading;root.scaling.setAll(scale);
  const batches=new Map();
  function part(ink,mesh,x,y,z){
    mesh.position.set(x,y,z);
    if(!batches.has(ink))batches.set(ink,[]);
    batches.get(ink).push(mesh);return mesh;
  }
  function stay(a,b,r,ink){
    part(ink,B.MeshBuilder.CreateTube('liftStay',{path:[B.Vector3.FromArray(a),B.Vector3.FromArray(b)],radius:r,tessellation:6},scene),0,0,0);
  }
  const beam=(ink,name,x,y,z,w,h,d)=>part(ink,B.MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},scene),x,y,z);
  beam('deck','trackBed',37.5,11.5,0,75,.6,5.7);
  for(const z of [-1,1])beam('metal','rail',37.5,11.91,z,75,.22,.16);
  for(const z of [-2.75,2.75]){
    beam('metal','upperChord',37.5,13.8,z,75,.38,.37);
    beam('metal','lowerChord',37.5,10.65,z,75,.46,.42);
    for(let bay=0;bay<15;bay++){
      const x=bay*5;
      stay([x,10.65,z],[x+2.5,13.8,z],.18,'red');
      stay([x+2.5,13.8,z],[x+5,10.65,z],.18,'red');
    }
  }
  for(const x of [0,75])beam('stone','cliffAbutment',x,9.6,0,4,2.9,7.4);
  for(const x of [22.5,52.5]){
    if(kind==='balloon'){
      const z=x<30?-7:7,h=x<30?38:33;
      const skin=B.MeshBuilder.CreateLathe('bridgeGasCell',{shape:[[.02,-16],[2.2,-14.5],[4.1,-11],[5,-5],[5.1,3],[4.4,9],[2.7,13],[.04,16]].map(([r,y])=>new B.Vector3(r,y,0)),tessellation:20},scene);
      part('canvas',skin,x,h,z).rotation.z=Math.PI/2;
      for(const [dx,r] of [[-9,4.43],[3,5.04],[11,4.12]]){
        const belt=B.MeshBuilder.CreateTorus('belt',{diameter:2*r,thickness:.19,tessellation:24},scene);
        part('metal',belt,x+dx,h,z).rotation.z=Math.PI/2;
      }
      part('red',B.MeshBuilder.CreateBox('keel',{width:14,height:1.5,depth:2.5},scene),x,h-5.1,z);
      for(const dx of [-6,6])for(const side of [-1,1]){
        stay([x+dx,h-4.8,z+side*.9],[x+dx*1.8,13.8,side*2.75 ],.24,'metal');
      }
    }else{
      const hubY=5.4;
      for(const side of [-1,1]){
        const z=side*7;
        stay([x-4,10.65,side*2.75],[x,hubY,z],.48,'metal');
        stay([x+4,10.65,side*2.75],[x,hubY,z],.48,'metal');
        part('red',B.MeshBuilder.CreateCylinder('liftNacelle',{height:3,diameterTop:3.3,diameterBottom:2.3,tessellation:12},scene),x,hubY,z);
        const rotor=new B.TransformNode('bridgePropeller',scene);rotor.parent=root;rotor.position.set(x,hubY-1.9,z);
        const blades=[];
        for(let n=0;n<3;n++){
          const blade=B.MeshBuilder.CreateSphere('laminatedBlade',{diameter:1,segments:8},scene);
          const angle=n*2*Math.PI/3;blade.scaling.set(1.45,.35,7.2);
          blade.rotation.y=angle;blade.position.set(Math.sin(angle)*3.4,0,Math.cos(angle)*3.4);blades.push(blade);
        }
        const prop=B.Mesh.MergeMeshes(blades,true,true);prop.parent=rotor;prop.material=materials.metal;rotors.push(rotor);
      }
    }
  }
  for(const [ink,parts] of batches){
    const mesh=B.Mesh.MergeMeshes(parts,true,true);mesh.name=`bridge_${kind}_${ink}`;mesh.parent=root;mesh.material=materials[ink];mesh.isPickable=false;mesh.freezeWorldMatrix();
  }
}
