// Port machine works, in island coordinates. Batch static joinery by finish.
export function buildPortMachineWorks(scene, parent, steel, shadowGen) {
  const B = BABYLON;
  const groups = new Map();
  function finish(name, colour, roughness, metallic = 0) {
    const m = new B.PBRMaterial(name, scene);
    m.albedoColor = B.Color3.FromHexString(colour).toLinearSpace();
    m.metallic = metallic;
    m.roughness = roughness;
    return m;
  }
  const stone = finish('portCastStone','#ecd4a6',.91);
  const enamel = finish('portWorksEnamel','#225e62',.62,.12);
  const tiles = new B.Texture('./assets/textures/nomad/port-glazed-block.webp',scene);
  tiles.uScale=1;tiles.vScale=3;
  enamel.albedoTexture=tiles;
  stone.albedoTexture=tiles;
  const brass = finish('portOxidisedBrass','#d0a261',.50,.58);
  const glass = finish('portWiredGlass','#ffffff',.39);
  glass.albedoTexture = new B.Texture('./assets/textures/nomad/port-machine-glass.webp',scene);
  glass.emissiveColor.set(.035,.036,.022);
  const sign = finish('portPorcelainSign','#ffffff',.55,.12);
  sign.albedoTexture = new B.Texture('./assets/textures/nomad/port-workshop-sign.webp',scene);
  // The design is printed only on the visible face, with the UV origin at lower left.
  function print(name, mat, x,y,z,w,h,side=false) {
    const mesh=new B.Mesh(name,scene), data=new B.VertexData();
    data.positions=[-w/2,-h/2,0,w/2,-h/2,0,w/2,h/2,0,-w/2,h/2,0];
    data.indices=[0,2,1,0,3,2];
    data.normals=[0,0,1,0,0,1,0,0,1,0,0,1];
    data.uvs=[0,0,1,0,1,1,0,1];
    data.applyToMesh(mesh);
    if(side) mesh.rotation.y=Math.PI/2;
    mat.backFaceCulling=false;
    put(mesh,mat,x,y,z);
  }
  function put(mesh,mat,x,y,z) {
    mesh.position.set(x,y,z);
    if(!groups.has(mat))groups.set(mat,[]);
    groups.get(mat).push(mesh);
    return mesh;
  }
  function block(mat,x,y,z,w,h,d) {
    return put(B.MeshBuilder.CreateBox('portJoinery',{width:w,height:h,depth:d},scene),mat,x,y,z);
  }
  function drum(mat,x,y,z,d,h,tessellation=32) {
    return put(B.MeshBuilder.CreateCylinder('portCasting',{diameter:d,height:h,tessellation},scene),mat,x,y,z);
  }
  function bay(x,z,w,side) {
    const y=8.25,h=7.8;
    function section(mat,along,dy,out,width,height,depth) {
      return side ? block(mat,x+out,y+dy,z-along,depth,height,width)
                  : block(mat,x+along,y+dy,z+out,width,height,depth);
    }
    section(enamel,0,0,.14,w+.24,h+.22,.16);
    print('portFactoryLights',glass,x+(side ? .30 : 0),y,z+(side ? 0 : .30),w,h,side);
    for(const edge of [-1,1]) {
      section(stone,edge*(w*.5+.25),0,.18,.29,h+.55,.47);
      section(enamel,edge*w*.165,0,.37,.10,h,.13);
    }
    section(stone,0,-h/2-.18,.25,w+.95,.32,.79);
    section(stone,0,h/2+.21,.19,w+.81,.36,.65);
    section(enamel,0,.78,.39,w,.16,.17);
  }
  for(const x of [-23.9,-17.65,-11.4])bay(x,1,4.95,false);
  for(const z of [-5.1,-11.95])bay(-1,z,5.35,true);
  // Wrap the crown around the public elevations; step the stone courses back to the roof.
  for(const [y,d,h] of [[13.38,.48,.32],[13.96,.80,.30]]) {
    block(stone,-14,y,1.15,26.45,h,d);
    block(stone,-.82,y,-7.92,d,h,17.30);
  }
  // Dispatch tower forms a landmark on the corner, with a clock above the roofline.
  block(enamel,-3.7,12.12,2.38,4.60,19.5,3.9);
  block(stone,-3.7,21.95,2.38,4.90,.45,4.20);
  block(enamel,-3.7,22.62,2.38,3.75,.89,3.06);
  block(stone,-3.7,23.25,2.38,3.24,.36,2.64);
  for(const x of [-5.67,-1.73]){
    block(stone,x,12.4,4.44,.36,18.68,.39);
    block(brass,x,12.9,4.67,.10,16.52,.11);
  }
  const cx=-3.7,cy=19.37;
  for(const [mat,d,z] of [[brass,3.14,4.52],[stone,2.84,4.66]]){
    const face=drum(mat,cx,cy,z,d,.15,48);
    face.rotation.x=Math.PI/2;
  }
  for(let tick=0;tick<12;tick++){
    const a=tick*Math.PI/6;
    block(enamel,cx+1.16*Math.sin(a),cy+1.16*Math.cos(a),4.78,.08,.25,.06).rotation.z=-a;
  }
  for(const [angle,length] of [[-.97,.71],[.88,1.02]]) {
    block(enamel,cx+Math.sin(angle)*length/2,cy+Math.cos(angle)*length/2,4.87,.105,length,.075).rotation.z=-angle;
  }
  // A pair of tall ribbed louvres below the clock, above the goods entrance.
  block(steel,cx,12.1,4.42,2.61,7.2,.19);
  for(let i=0;i<15;i++)block(brass,cx,8.9+i*.45,4.60,2.38,.12,.21);
  // Staff entrance, glazed fanlight, kick plates and the raised stone surround.
  block(stone,cx,5.18,4.54,3.35,5.65,.42);
  block(steel,cx,5.02,4.83,2.74,5.12,.24);
  print('portFanlight',glass,cx,6.88,5.04,2.42,.76);
  for(const dx of [-.63,.63]){
    block(enamel,cx+dx,4.57,5.02,1.18,3.50,.16);
    print('portDoorLight',glass,cx+dx,5.20,5.16,.89,1.78);
    block(brass,cx+dx,3.08,5.19,.91,.30,.09);
    block(brass,cx+dx*.45,4.21,5.24,.06,.54,.12);
  }
  block(stone,cx,2.55,5.17,3.43,.38,1.44);
  // A smaller side light gives the stairwell depth from the direction of approach.
  print('portStairwellGlass',glass,-1.31,14.9,2.45,2.28,9.25,true);
  for(const z of [1.22,3.69]) block(stone,-1.20,14.9,z,.30,9.61,.22);
  block(enamel,-17.65,14.01,1.80,17.20,1.86,.32);
  print('portWorksName',sign,-17.65,14.01,2.02,16.96,1.67);

  // Lower loading platform, cantilever brackets and a rolled front fascia.
  const roof=B.MeshBuilder.CreateBox('indHangarRoof',{width:19.0,height:.26,depth:5.6},scene);
  roof.parent=parent;roof.position.set(-16.5,5.82,4.36);roof.material=enamel;roof.receiveShadows=true;
  block(stone,-16.5,2.72,3.54,19.2,.83,4.94);
  block(brass,-16.5,5.77,7.20,19.25,.27,.23);
  for(const x of [-23.9,-17.65,-11.4]){
    block(steel,x,4.36,1.76,4.20,2.53,.23);
    for(let row=0;row<7;row++)block(enamel,x,3.35+row*.33,1.94,3.98,.24,.12);
    block(brass,x,3.36,2.05,.63,.09,.12);
  }
  for(let step=0;step<3;step++){
    block(stone,-7.64,2.41+step*.13,7.14-step*.41,2.0,.16+step*.26,.46);
  }
  for(const x of [-25.2,-18.95,-12.70,-7.8]){
    block(enamel,x,4.17,2.04,.19,3.02,.25);
    block(enamel,x,4.94,3.43,.18,.22,3.33).rotation.x=-.44;
  }

  // The works sends machined shafts to the crane on a short dock railway.
  const railZ=9.65;
  for(const offset of [-.64,.64]){
    block(steel,1.5,2.47,railZ+offset,43,.14,.10);
  }
  for(let x=-19.4;x<23;x+=1.35){
    block(enamel,x,2.39,railZ,.17,.07,1.72);
  }
  const truckX=-13.9;
  for(const dx of [-1.43,1.43]){
    for(const dz of [-.64,.64]){
      drum(steel,truckX+dx,2.85,railZ+dz,.64,.17,16).rotation.x=Math.PI/2;
      drum(brass,truckX+dx,2.85,railZ+dz+Math.sign(dz)*.12,.26,.08,12).rotation.x=Math.PI/2;
    }
  }
  block(enamel,truckX,3.30,railZ,4.54,.32,1.93);
  for(const dx of [-1.29,1.29])block(brass,truckX+dx,3.55,railZ,.23,.23,1.72);
  for(const [dy,dz] of [[0,-.34],[0,.34],[.55,0]]){
    drum(steel,truckX,3.95+dy,railZ+dz,.65,4.86,20).rotation.z=Math.PI/2;
    for(const dx of [-1.29,1.29]){
      drum(brass,truckX+dx,3.95+dy,railZ+dz,.69,.14,20).rotation.z=Math.PI/2;
    }
  }

  for(const [mat,parts] of groups){
    const mesh=B.Mesh.MergeMeshes(parts,true,true);
    mesh.name='portWorks_'+mat.name;
    mesh.parent=parent;mesh.material=mat;mesh.receiveShadows=true;
    shadowGen?.addShadowCaster(mesh,false);
  }
  shadowGen?.addShadowCaster(roof,false);
}
