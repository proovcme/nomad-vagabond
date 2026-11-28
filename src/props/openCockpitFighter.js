// Fittings are authored in the Gemini GLB's unscaled airframe coordinates (nose -Z).
export function fitOpenCockpitFighter(meshes, scene, finish, occupied) {
  const B = BABYLON, frame = meshes.find(m => m.name === 'airframe');
  if (!frame) return;
  const red = finish(scene,'vermilion','#ed4822');
  const alloy = finish(scene,'cowlAlloy','#cdc7ae');
  const black = finish(scene,'engineIron','#34383a');
  const leather = finish(scene,'seatLeather','#734329');
  const parts = new Map();
  function add(mesh, material) {
    if (!parts.has(material)) parts.set(material,[]);
    parts.get(material).push(mesh);
    return mesh;
  }
  function oval(name,x,y,z,w,h,d,material) {
    const mesh=B.MeshBuilder.CreateSphere(name,{diameter:1,segments:16},scene);
    mesh.position.set(x,y,z);mesh.scaling.set(w,h,d);return add(mesh,material);
  }
  function pipe(path,radius,material) {
    return add(B.MeshBuilder.CreateTube('airframeTube',{path:path.map(p=>B.Vector3.FromArray(p)),radius,tessellation:8},scene),material);
  }
  function turn(name,profile,material) {
    const mesh=B.MeshBuilder.CreateLathe(name,{shape:profile.map(([z,r])=>new B.Vector3(r,z,0)),tessellation:48,sideOrientation:B.Mesh.DOUBLESIDE},scene);
    mesh.rotation.x=Math.PI/2;mesh.position.y=1.78;mesh.scaling.z=1.23;
    return add(mesh,material);
  }

  // Recess the decking below the cockpit coaming and shorten the old engine casing.
  const p=frame.getVerticesData('position',true,true);
  // The canopy bows and top runner are welded into the GLB frame, beside the glazing.
  const indices=frame.getIndices(), openFrame=[];
  for(let k=0;k<indices.length;k+=3){
    const tri=[indices[k],indices[k+1],indices[k+2]];
    const inBow=[-1.45,-.92,-.35].some(z=>tri.every(i=>Math.abs(p[3*i+2]-z)<.035 && Math.abs(p[3*i])<.59));
    const inRunner=tri.every(i=>Math.abs(p[3*i])<.05 && p[3*i+1]>3.0 && p[3*i+2]>=-1.51 && p[3*i+2]<=-.24);
    if(!inBow && !inRunner)openFrame.push(...tri);
  }
  frame.setIndices(openFrame);
  for(let i=0;i<p.length;i+=3){
    const x=p[i],y=p[i+1],z=p[i+2];
    if(Math.abs(x)<1.22 && z< -2.48)p[i+2]=-2.48+(z+2.48)*.46;
    const seat=(x/.62)**2+((z+.75)/.94)**2;
    if(seat<1 && y>2.52)p[i+1]-=Math.min(.65,y-2.52)*(1-seat);
  }
  frame.setVerticesData('position',p);frame.refreshBoundingInfo();
  meshes.find(m=>m.name==='cockpit_glass')?.setEnabled(false);
  const glow=meshes.find(m=>m.name==='cockpit_glow');
  if(glow){
    const pos=glow.getVerticesData('position'),ids=Array.from(glow.getIndices());
    const lamps=[];
    for(let k=0;k<ids.length;k+=3){
      const tri=ids.slice(k,k+3);
      if(tri.every(i=>Math.abs(pos[3*i])>2))lamps.push(...tri);
    }
    glow.setIndices(lamps);
  }
  turn('radialBonnet',[[-2.45,.77],[-2.61,.97],[-2.88,1.02],[-3.22,1.01],[-3.33,.96],[-3.37,.81],[-3.31,.76]],red);
  turn('rolledLip',[[-3.27,.996],[-3.34,.963],[-3.387,.86],[-3.365,.78],[-3.32,.75]],alloy);
  turn('engineBackplate',[[-3.03,.03],[-3.03,.84]],black);
  for(let j=0;j<9;j++){
    const a=2*Math.PI*j/9, dx=Math.cos(a),dy=Math.sin(a)*1.23;
    pipe([[.24*dx,1.78+.24*dy,-3.14],[.83*dx,1.78+.83*dy,-3.14]],.135,black);
    for(const r of [.55,.65,.75])pipe([[r*dx,1.78+r*dy,-3.14],[(r+.035)*dx,1.78+(r+.035)*dy,-3.14]],.155,alloy);
  }
  const shaft=meshes.find(m=>m.name.startsWith('propeller_'));
  if(shaft)shaft.position.z=-3.54*frame.scaling.z;

  for(const side of [-1,1]){
    pipe([[side*.52,2.63,-1.70],[side*3.73,1.79,-1.38]],.015,alloy);
    pipe([[side*.52,2.63,-1.70],[side*3.67,1.80,-.90]],.012,alloy);
  }
  oval('seatWell',0,2.70,-.73,1.10,.25,1.61,black);
  const rim=Array.from({length:41},(_,i)=>{const a=i*Math.PI/20;return [.54*Math.cos(a),2.77,-.73+.79*Math.sin(a)];});
  pipe(rim,.053,leather);
  oval('seatBack',0,2.89,-.20,.70,.46,.23,leather);
  const arch=rim.slice(20).map(([x,y,z],i)=>[x,y+.49*Math.sin(i*Math.PI/20),z+.10*Math.sin(i*Math.PI/20)]);
  const glass=B.MeshBuilder.CreateRibbon('fighterWindscreen',{pathArray:[rim.slice(20).map(v=>B.Vector3.FromArray(v)),arch.map(v=>B.Vector3.FromArray(v))],sideOrientation:B.Mesh.DOUBLESIDE},scene);
  glass.parent=frame;glass.material=meshes.find(m=>m.name==='cockpit_glass')?.material;
  pipe(arch,.023,alloy);
  if(occupied){
    oval('jacket',0,2.91,-.60,.61,.48,.40,leather);
    oval('pilotFace',0,3.23,-.67,.33,.41,.35,finish(scene,'pilotFace','#cf956f'));
    oval('flightHelmet',0,3.31,-.62,.39,.40,.39,leather);
    for(const x of [-.092,.092])oval('goggle',x,3.28,-.816,.16,.105,.055,black);
  }
  for(const [material,group] of parts){
    const joined=B.Mesh.MergeMeshes(group,true,true);joined.name='fighterDetail_'+material.name;
    joined.parent=frame;joined.material=material;joined.receiveShadows=true;
  }
  for(const gear of meshes.filter(m=>/^gear_[LR]$/.test(m.name))){
    const shell=B.MeshBuilder.CreateLathe('fighterWheelSpat',{shape:[[-.71,.03],[-.60,.27],[-.34,.44],[.04,.46],[.40,.34],[.75,.16],[.99,.012]].map(([z,r])=>new B.Vector3(r,z,0)),tessellation:24,sideOrientation:B.Mesh.DOUBLESIDE},scene);
    shell.rotation.x=Math.PI/2;shell.scaling.set(.65,1,1);shell.position.set(gear.name==='gear_L'?.12:-.12,.60,0);
    shell.material=red;shell.parent=gear;shell.receiveShadows=true;
  }
}
