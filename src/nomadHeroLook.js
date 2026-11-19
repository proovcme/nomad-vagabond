/** Small authored flight-kit additions for the existing skinned nomad.
 * All garment meshes, skinning, UVs and animation tracks remain owned by the GLB.
 * Four new material batches, no lights/colliders, and a bounded cloth strip.
 */
export function styleNomadHero(scene, importResult, container = importResult?.meshes?.[0]) {
  if(!scene || !container || container.metadata?.nomadHeroLook)return container?.metadata?.nomadHeroLook || null;
  const B=BABYLON, sourceNodes=importResult.transformNodes||[];
  const bones=importResult.skeletons?.[0]?.bones||[];
  const find=(name)=>sourceNodes.find(n=>n.name===name)||bones.find(b=>b.name===name)?.getTransformNode();
  const chest=find('spine_03'),neck=find('neck_01')||chest,head=find('Head');
  if(!chest || !head)return null;
  container.computeWorldMatrix(true);for(const n of [chest,neck,head])n.computeWorldMatrix(true);
  const materials=[],meshes=[],frames=[];
  const mat=(name,hex,metallic,roughness)=>{const m=new B.PBRMaterial(name,scene);m.albedoColor=B.Color3.FromHexString(hex);m.metallic=metallic;m.roughness=roughness;m.environmentIntensity=.9;materials.push(m);return m;};
  const petrol=mat('nomadFlightKitPetrol','#254c50',.12,.83);
  const brass=mat('nomadFlightKitBrass','#c69a48',.58,.48);
  const ivory=mat('nomadFlightKitIvory','#e5dfba',.05,.78);
  const ochre=mat('nomadFlightKitScarf','#dca442',0,.94);
  ochre.backFaceCulling=false;ochre.twoSidedLighting=true;
  const clothTexture=scene.textures.find(t=>(t.url||t.name||'').endsWith('ochre-aircraft-canvas.png'));
  if(clothTexture)ochre.albedoTexture=clothTexture;
  // Use the authored goggles rather than layering another pair over the same face.
  const ownedMaterials=new Set(importResult.meshes.map(m=>m.material).filter(Boolean));
  for(const m of [...ownedMaterials])if(m.subMaterials)for(const sm of m.subMaterials)if(sm)ownedMaterials.add(sm);
  for(const m of ownedMaterials){
    if(m.name==='M_GoggleGlass'){m.albedoColor=B.Color3.FromHexString('#d6a750');m.alpha=.88;m.metallic=.12;m.roughness=.20;}
    if(m.name==='M_AgedBrass'){m.albedoColor.set(1.15,1.08,.9);m.metallic=.52;m.roughness=.52;}
    if(m.name==='M_AviatorLeather'){m.albedoColor.set(1.12,1.02,.88);m.metallic=.05;m.roughness=.77;}
    if(m.name==='M_FadedHenley'){m.albedoColor.set(1.05,1.04,.9);m.metallic=0;m.roughness=.93;}
    if(m.name==='M_WorkCanvas'){m.albedoColor.set(.72,.95,.92);m.metallic=.02;m.roughness=.90;}
  }
  function frame(name,node){
    // Babylon uses row-vector composition. This preserves model-space axes in
    // bind pose despite the imported neck/spine rotations; then follows its bone.
    const f=new B.TransformNode(name,scene),relative=container.getWorldMatrix().multiply(B.Matrix.Invert(node.getWorldMatrix()));
    f.parent=node;f.rotationQuaternion=B.Quaternion.Identity();relative.decompose(f.scaling,f.rotationQuaternion,f.position);frames.push(f);return f;
  }
  const chestFrame=frame('nomadFlightKitChest',chest),neckFrame=frame('nomadFlightKitNeck',neck);
  const batches=new Map([[petrol,[]],[brass,[]],[ivory,[]]]);
  const put=(mesh,material)=>{mesh.material=material;batches.get(material).push(mesh);return mesh;};
  function extrude(name,profile,z0,z1,material){
    const positions=[],indices=[],uvs=[];
    for(const z of[z0,z1])for(const [x,y] of profile){positions.push(x,y,z);uvs.push((x+.5)*2,y);}
    const n=profile.length;
    for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,n+j,i,n+j,n+i);}
    for(let i=1;i<n-1;i++)indices.push(0,i+1,i,n,n+i,n+i+1);
    const normals=[];B.VertexData.ComputeNormals(positions,indices,normals);const data=new B.VertexData();Object.assign(data,{positions,indices,normals,uvs});
    const mesh=new B.Mesh(name,scene);data.applyToMesh(mesh);return put(mesh,material);
  }
  const chamfer=(cx,cy,w,h,c)=>[[cx-w/2+c,cy-h/2],[cx+w/2-c,cy-h/2],[cx+w/2,cy-h/2+c],[cx+w/2,cy+h/2-c],[cx+w/2-c,cy+h/2],[cx-w/2+c,cy+h/2],[cx-w/2,cy+h/2-c],[cx-w/2,cy-h/2+c]];
  function tube(name,points,radius,material){return put(B.MeshBuilder.CreateTube(name,{path:points.map(p=>new B.Vector3(...p)),radius,tessellation:6,cap:B.Mesh.CAP_ALL},scene),material);}
  function disc(name,x,y,z,diameter,depth,material){const m=B.MeshBuilder.CreateCylinder(name,{diameter,height:depth,tessellation:16},scene);m.rotation.x=Math.PI/2;m.position.set(x,y,z);return put(m,material);}
  // A compact chamfered ether satchel, with collar, service rails and leather lid.
  extrude('nomadEtherSatchel',chamfer(0,1.285,.31,.36,.042),-.34,-.155,petrol);
  extrude('nomadSatchelLid',chamfer(0,1.46,.33,.095,.025),-.354,-.145,petrol);
  for(const x of[-.11,.11])tube('nomadSatchelEdgeRail',[[x,1.14,-.357],[x,1.40,-.357]],.009,brass);
  extrude('nomadSatchelServicePlate',chamfer(0,1.29,.16,.19,.018),-.36,-.347,brass);
  for(const y of[1.24,1.29,1.34])extrude('nomadEtherCellWindow',chamfer(0,y,.105,.025,.006),-.369,-.361,ivory);
  for(const x of[-.125,.125])for(const y of[1.17,1.405])disc('nomadSatchelRivet',x,y,-.363,.016,.008,brass);
  // Shoulder harness follows the torso. Profile strips have real width instead
  // of floating lines, and stay just outside the jacket's authored silhouette.
  for(const side of[-1,1]){
    tube('nomadHarnessOverShoulder',[[side*.10,1.12,-.355],[side*.155,1.42,-.20],[side*.145,1.50,-.035],[side*.13,1.45,.125],[side*.07,1.12,.142]],.022,petrol);
    extrude('nomadHarnessBuckle',chamfer(side*.095,1.245,.055,.07,.006),.145,.158,brass);
    extrude('nomadHarnessBuckleInset',chamfer(side*.095,1.245,.026,.04,.003),.159,.162,petrol);
  }
  // Asymmetric navigator's compass: readable ivory dial, brass case and dark pointer.
  disc('nomadCompassCase',-.105,1.365,.152,.112,.032,brass);
  disc('nomadCompassDial',-.105,1.365,.173,.088,.008,ivory);
  extrude('nomadCompassPointer',[[-.11,1.398],[-.097,1.352],[-.111,1.358]],.180,.183,petrol);
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4,x=-.105+Math.sin(a)*.035,y=1.365+Math.cos(a)*.035;
    disc('nomadCompassIndex',x,y,.181,.006,.003,petrol);
  }
  for(const [material,parts] of batches){
    const merged=B.Mesh.MergeMeshes(parts,true,true,undefined,false,false);merged.name=`nomadFlightKit_${material.name}`;merged.parent=chestFrame;merged.material=material;meshes.push(merged);
  }
  // A shaped neck wrap and one forked wind tail form a single cloth draw call.
  const scarfPositions=[],scarfIndices=[],scarfUV=[],segments=16;
  for(let j=0;j<2;j++)for(let i=0;i<=segments;i++){
    const a=i/segments*Math.PI*2;scarfPositions.push(Math.sin(a)*.112,1.555+j*.062+Math.sin(a)*.005,Math.cos(a)*.09-.005);scarfUV.push(i/segments*2,j);
  }
  for(let i=0;i<segments;i++){const a=i,b=i+1,c=i+segments+1,d=c+1;scarfIndices.push(a,b,d,a,d,c);}
  const tailStart=scarfPositions.length/3,tailRows=7;
  for(let i=0;i<tailRows;i++){
    const t=i/(tailRows-1),cx=-.074-.06*t,cy=1.565-.36*t,cz=-.055-.43*t,width=.105*(1-.2*t);
    for(const side of[-1,1]){scarfPositions.push(cx+side*width/2,cy+(i===tailRows-1&&side>0?.045:0),cz);scarfUV.push(side>0?1:0,t*2);}
  }
  for(let i=0;i<tailRows-1;i++){const a=tailStart+i*2;scarfIndices.push(a,a+1,a+3,a,a+3,a+2);}
  // Opaque two-sided cloth avoids transparency sorting and duplicated coplanar faces.
  const scarfNormals=[];B.VertexData.ComputeNormals(scarfPositions,scarfIndices,scarfNormals);
  const scarf=new B.Mesh('nomadOchreWindScarf',scene),scarfData=new B.VertexData();Object.assign(scarfData,{positions:scarfPositions,indices:scarfIndices,normals:scarfNormals,uvs:scarfUV});scarfData.applyToMesh(scarf,true);scarf.parent=neckFrame;scarf.material=ochre;meshes.push(scarf);
  const rest=scarfPositions.slice();let time=0,ticks=0;
  const observer=scene.onBeforeRenderObservable.add(()=>{
    if(!container.isEnabled()||++ticks%2)return;
    time+=Math.min(scene.getEngine().getDeltaTime()/1000,.05)*2;
    for(let i=tailStart;i<rest.length/3;i++){
      const t=Math.floor((i-tailStart)/2)/(tailRows-1),at=i*3;
      scarfPositions[at]=rest[at]+Math.sin(time*3.4-t*2.2)*.018*t;
      scarfPositions[at+2]=rest[at+2]+Math.sin(time*2.1-t*3.1)*.014*t;
    }
    scarf.updateVerticesData(B.VertexBuffer.PositionKind,scarfPositions,false,false);
  });
  for(const mesh of meshes){mesh.isPickable=false;mesh.checkCollisions=false;mesh.receiveShadows=true;mesh.metadata={cameraIgnore:true,nomadHeroKit:true};}
  let disposed=false;
  const result={meshes,frames,materials,headNode:head,chestNode:chest,neckNode:neck,
    snapshot:{batches:meshes.length,triangles:meshes.reduce((n,m)=>n+m.getTotalIndices()/3,0),modelSpaceHeightMetres:1.822,bones:[head.name,chest.name,neck.name],goggles:'authored GLB glass changed to warm amber',newLights:0,newColliders:0},
    dispose(){if(disposed)return;disposed=true;scene.onBeforeRenderObservable.remove(observer);frames.forEach(n=>n.dispose());materials.forEach(m=>m.dispose());}};
  container.metadata={...container.metadata,nomadHeroLook:result};scene.onDisposeObservable.addOnce(()=>result.dispose());return result;
}
