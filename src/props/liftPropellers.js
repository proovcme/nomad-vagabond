// Each station is a mirrored pair. Dimensions are local to the hull or rock body.
const drives = new WeakMap();

export function installLiftPropellers(root, stations, material) {
  const B=BABYLON, scene=root.getScene(), rotors=[], mounts=[];
  for(const {x,y,offset,radius,anchorY,anchorZ} of stations){
    for(const side of [-1,1]){
      const z=side*offset;
      for(const dx of [-.45,.45]){
        const path=[new B.Vector3(x+dx*radius,anchorY,side*anchorZ),new B.Vector3(x,y+radius*.26,z)];
        mounts.push(B.MeshBuilder.CreateTube('engineBearer',{path,radius:radius*.055,tessellation:8},scene));
      }
      const hub=B.MeshBuilder.CreateLathe('liftGearbox',{shape:[[.07,-.12],[.16,-.05],[.19,.16],[.16,.31],[.09,.37]].map(([r,h])=>new B.Vector3(r*radius,h*radius,0)),tessellation:20},scene);
      hub.position.set(x,y,z);mounts.push(hub);
      const axle=B.MeshBuilder.CreateCylinder('propellerBoss',{height:radius*.16,diameterTop:radius*.19,diameterBottom:radius*.13,tessellation:12},scene);
      axle.position.y=-radius*.11;
      axle.setVerticesData('color',Array.from({length:axle.getTotalVertices()},()=>[.86,.55,.21,1]).flat());
      const blades=[axle];
      for(let blade=0;blade<4;blade++){
        // Swept timber blades with a twisted, closed aerofoil and brass tips.
        const rings=[[.08,.055,0,.46],[.22,.092,.01,.36],[.46,.125,.04,.25],[.72,.115,.085,.19],[.93,.070,.12,.13],[1,.012,.13,.10]];
        const paths=rings.map(([r,chord,sweep,pitch])=>Array.from({length:12},(_,j)=>{
          const a=j*Math.PI/6, c=Math.cos(a);
          return new B.Vector3(r*radius,(c*pitch+Math.sin(a)*.22)*chord*radius,(sweep+c*chord)*radius*side);
        }));
        const skin=B.MeshBuilder.CreateRibbon('propBlade',{pathArray:paths,closePath:true,sideOrientation:B.Mesh.DOUBLESIDE},scene);
        const coords=skin.getVerticesData('position'),colors=[];
        for(let i=0;i<coords.length;i+=3){
          const tip=coords[i]>radius*.90;
          colors.push(...(tip?[.96,.72,.29,1]:[.49,.22,.082,1]));
        }
        skin.setVerticesData('color',colors);skin.rotation.y=blade*Math.PI/2;blades.push(skin);
      }
      const rotor=B.Mesh.MergeMeshes(blades,true,true);
      rotor.name='liftPropeller';rotor.parent=root;rotor.position.set(x,y,z);rotor.rotation.y=x*.17;
      rotor.material=material.blade;rotor.receiveShadows=true;rotor.isPickable=false;
      rotors.push({mesh:rotor,side});
    }
  }
  const fixed=B.Mesh.MergeMeshes(mounts,true,true);fixed.name='liftGearboxes';fixed.parent=root;
  fixed.material=material.mount;fixed.receiveShadows=true;fixed.isPickable=false;
  const drive={root,rotors,power:1,speed:1};
  if(!drives.has(scene))drives.set(scene,new Set());
  const active=drives.get(scene);active.add(drive);root.onDisposeObservable.addOnce(()=>active.delete(drive));
  return drive;
}

export function animateLiftPropellers(scene,dt){
  for(const drive of drives.get(scene)||[]){
    if(!drive.root.isEnabled())continue;
    drive.speed+=Math.max(-dt*.45,Math.min(dt*.45,drive.power-drive.speed));
    for(const {mesh,side} of drive.rotors)mesh.rotation.y+=side*dt*drive.speed*5;
  }
}
