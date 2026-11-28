// Local +Z follows the route between the two terminals.
export function buildAirfields(scene, islands, materials) {
  const B = BABYLON;
  const ports = islands.map(island => island.group.position.add(new B.Vector3(0, 13, 94)));
  const axis = ports[1].subtract(ports[0]); axis.y = 0; axis.normalize();
  const side = new B.Vector3(axis.z, 0, -axis.x);
  const yaw = Math.atan2(axis.x, axis.z);
  const services = [];
  const apron = materials.get('apron');
  apron.albedoTexture = new B.Texture('./assets/textures/nomad/aviation-runway-graphite-v1.jpg',scene);
  apron.albedoTexture.uScale=2; apron.albedoTexture.vScale=6;
  apron.albedoColor=B.Color3.FromHexString('#d5c9b1').toLinearSpace();
  for (const [i, port] of ports.entries()) {
    const root = new B.TransformNode(i ? 'eastAirfield' : 'westAirfield', scene);
    root.position.copyFrom(port); root.rotation.y = yaw;
    const batches = new Map();
    const add = (material, mesh, x, y, z) => {
      mesh.position.set(x,y,z);
      if (!batches.has(material)) batches.set(material, []);
      batches.get(material).push(mesh);
      return mesh;
    };
    const slab = (ink,x,y,z,w,h,d) => add(ink,B.MeshBuilder.CreateBox('airfieldFitting',{width:w,height:h,depth:d},scene),x,y,z);
    const drum = (ink,x,y,z,top,bottom,h) => add(ink,B.MeshBuilder.CreateCylinder('airfieldDrum',{height:h,diameterTop:top,diameterBottom:bottom,tessellation:16},scene),x,y,z);
    // A cantilevered landing stage with exposed ribs and a stepped passenger terminal.
    const deck = B.MeshBuilder.CreateBox('passengerRunway'+i,{width:24,height:.8,depth:81},scene);
    deck.parent=root;deck.position.y=-.4;deck.material=materials.get('apron');deck.checkCollisions=true;deck.receiveShadows=true;

    for(const x of [-11.5,11.5]){
      slab('ochre',x,-.9,0,.65,1.05,81);
      for(let z=-36;z<=36;z+=9){
        slab('ivory',x,.18,z,.45,.38,.65);
        slab('blue',x*.64,-2.2,z,.7,4.6,1).rotation.z=-Math.sign(x)*.65;
      }
    }
    slab('blue',0,-4,0,12,.8,78);
    for(let z=-32;z<=32;z+=8)slab('ivory',0,.025,z,.42,.045,3.7);
    for(const z of [-35,35])for(const x of [-6,-3,3,6])slab('ivory',x,.026,z,.58,.048,3);
    const terminal = i ? 1 : -1;
    const counter = (ink,x,y,z,w,h,d) => slab(ink,x*terminal,y,z*terminal,w,h,d);
    counter('blue',17,-.55,11,12,1.1,54);
    counter('ivory',19,2.3,4,8.5,4.6,22);
    counter('glass',19,3.5,4,8.7,1.23,21.6);
    for(let z=-5;z<=13;z+=3)counter('ivory',14.62,3.5,z,.25,1.3,.2);
    counter('red',19,4.68,4,9,.32,22.5);
    counter('ochre',14.6,2.7,8,3,.24,14);
    for(const z of [2,8,14])counter('blue',13.4,1.25,z,.13,2.5,.13);
    for(const z of [-2,4,10])counter('blue',14.6,1,z,.17,2,1.4);
    drum('ivory',19*terminal,4.2,-6*terminal,5,6,8);
    drum('glass',19*terminal,8.8,-6*terminal,6.3,5.7,1.9);
    drum('red',19*terminal,9.9,-6*terminal,6.6,6.6,.35);
    for(let n=0;n<8;n++){
      const a=n*Math.PI/4;
      drum('ivory',19*terminal+2.9*Math.sin(a),8.8,-6*terminal+2.9*Math.cos(a),.15,.15,1.9);
    }
    slab('ivory',19*terminal,12,-6*terminal,.18,4.3,.18);
    const sock=drum('red',19*terminal,13.75,-6*terminal+1,.4,.77,2.2);sock.rotation.x=1.32;
    const board=B.MeshBuilder.CreatePlane('terminalLettering',{width:10.5,height:1.55,sideOrientation:B.Mesh.DOUBLESIDE},scene);
    board.parent=root;board.position.set(14.68*terminal,5.55,4*terminal);
    board.rotation.y=terminal*Math.PI/2;
    const enamel=new B.StandardMaterial('terminalEnamel',scene);
    enamel.diffuseTexture=new B.Texture('./assets/textures/nomad/airfield-'+(i?'east':'west')+'.webp',scene);
    enamel.specularColor=B.Color3.Black(); board.material=enamel;
    counter('blue',14.85,5.45,4,.24,1.7,11);
    for(const [ink,parts] of batches){
      const mesh=B.Mesh.MergeMeshes(parts,true,true);mesh.parent=root;mesh.name=root.name+'_'+ink;
      mesh.material=materials.get(ink);mesh.receiveShadows=true;mesh.isPickable=false;
    }
    const cart=new B.TransformNode('baggageCart'+i,scene);
    cart.parent=root;
    const fitting=(mesh,ink,x,y,z)=>{
      mesh.parent=cart;mesh.position.set(x,y,z);mesh.material=materials.get(ink);mesh.isPickable=false;
      return mesh;
    };
    const bed=(ink,x,y,z,w,h,d)=>fitting(B.MeshBuilder.CreateBox('baggage',{width:w,height:h,depth:d},scene),ink,x,y,z);
    bed('ochre',0,.55,0,2.3,.26,1.25);
    bed('red',-.5,.94,0,.91,.54,.74);
    bed('ivory',.51,.95,.04,.96,.6,.82);
    for (const x of [-.76,.76])for(const z of [-.6,.6]){
      const wheel=fitting(B.MeshBuilder.CreateCylinder('cartWheel',{diameter:.59,height:.18,tessellation:12},scene),'blue',x,.30,z);
      wheel.rotation.x=Math.PI/2;
    }
    const workers=[];
    for(let n=0;n<3;n++){
      const person=new B.TransformNode('groundCrew'+i+'_'+n,scene);
      const body=(y,h,top,base,ink)=>{
        const mesh=B.MeshBuilder.CreateCylinder('stationUniform',{height:h,diameterTop:top,diameterBottom:base,tessellation:8},scene);
        mesh.parent=person;mesh.position.y=y;mesh.material=materials.get(ink);
      };
      for(const x of [-.11,.11]){
        const leg=B.MeshBuilder.CreateCylinder('uniformLeg',{height:.77,diameterTop:.18,diameterBottom:.15,tessellation:6},scene);
        leg.parent=person;leg.position.set(x,.39,0);leg.material=materials.get('blue');
      }
      body(.99,.57,.48,.35,n===1?'red':'blue');
      body(1.41,.29,.23,.24,'ochre');body(1.58,.14,.31,.38,'blue');
      const parts=person.getChildMeshes();
      for(const mat of new Set(parts.map(mesh=>mesh.material))){
        const merged=B.Mesh.MergeMeshes(parts.filter(mesh=>mesh.material===mat),true,true);
        merged.parent=person;merged.material=mat;merged.isPickable=false;
      }
      person.parent=root;
      workers.push(person);
    }
    services.push({cart,workers,sign:terminal});
    const from=islands[i].group.position.add(new B.Vector3(0,12,26));
    const to=port.add(side.scale(terminal*16)).addInPlace(axis.scale(terminal*14));
    const distance=B.Vector3.Distance(from,to);
    const pier=B.MeshBuilder.CreateBox('airfieldAccessPier'+i,{width:4,height:1.3,depth:distance},scene);
    pier.position.copyFrom(B.Vector3.Center(from,to));pier.lookAt(to);pier.material=materials.get('apron');pier.checkCollisions=true;
  }
  return {ports,axis,side,services};
}

const calls = [
  [36,'pilot','Ласточка','Вижу полосу. Пассажирский тридцать шестой, разрешите посадку.','civil-approach'],
  [42,'dispatcher',null,'Ласточка, ветер вдоль полосы. Посадку разрешаю.','civil-cleared'],
  [61,'pilot','Ласточка','У перрона. Почту и пассажиров можно принимать.','civil-parked'],
  [5,'dispatcher',null,'Ласточка, документы на борту. Счастливого рейса.','civil-depart'],
];

export function updateShuttle(line, time) {
  const {ports,axis,side} = line.fields;
  const clock=time+26, leg=Math.floor(clock/68), t=clock%68, origin=leg%2, sign=origin?-1:1;
  const from=ports[origin], to=ports[1-origin], plane=line.planes[1].root;
  const length=Math.hypot(to.x-from.x,to.z-from.z);
  const speed=(length-48)/(46-12);
  const point=plane.position;
  let travel, lateral=-4*sign, yawOffset=0, height=0, pitch=0;
  if(t<6) travel=-27;
  else if(t<12){const u=(t-6)/6; travel=-27+51*u*u;}
  else if(t<46){
    const u=(t-12)/34;
    travel=24+(length-48)*u;
    height=(to.y-from.y)*u+32*Math.sin(Math.PI*u);
    pitch=Math.atan2((to.y-from.y+32*Math.PI*Math.cos(Math.PI*u))/34,speed);
  }else{
    height=to.y-from.y;
    if(t<52){const u=(t-46)/6; travel=length-24+51*(2*u-u*u);}
    else{
      const a=Math.PI*Math.min(1,(t-52)/6);
      travel=length+27+4*Math.sin(a);
      lateral=-4*sign*Math.cos(a);
      yawOffset=a;
    }
  }
  point.set(from.x+axis.x*sign*travel+side.x*lateral,from.y+height+1.83,
    from.z+axis.z*sign*travel+side.z*lateral);
  plane.rotation.set(pitch,Math.atan2(-sign*axis.x,-sign*axis.z)+yawOffset,0);
  for(const hub of line.planes[1].hubs)hub.rotation.z=time*(t>58||t<6?7:32);
  // The ramp team comes out only after the aircraft has turned and stopped.
  for(const [index,{cart,workers,sign:station}] of line.fields.services.entries()){
    const dwell=index===1-origin && t>=58?t-58:index===origin && t<6?t+10:-1;
    const ramp=dwell<0?0:Math.max(0,Math.min(1,dwell/3,(16-dwell)/4));
    cart.position.set(station*(16-9*ramp),0,station*(17+13*ramp));
    workers.forEach((person,n)=>{
      const step=Math.max(0,Math.min(1,(ramp-.08*n)/(1-.08*n)));
      person.position.set(station*(14.6+n*.7-8*step),0,station*(14+n*1.25+16*step));
      person.rotation.y=station*(step>.8?1.9:.45);
    });
  }
  const since=line.lastClock??clock;
  for(const [at,who,call,text,clip] of calls){
    if(since<leg*68+at && clock>=leg*68+at){
      const field=(at===5?origin:1-origin)?'Восточный аэродром':'Западный аэродром';
      line.onRadio?.(who,call||field,text,clip);
    }
  }
  line.lastClock=clock;
}
