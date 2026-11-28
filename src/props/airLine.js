import { PortLedger } from '../portLedger.js';
import { buildAirfields, updateShuttle } from './airfields.js';
// Civil traffic uses -Z as its nose, matching the playable aircraft.
export class AirLine {
  constructor(scene, industrial, forest) {
    const B=BABYLON;
    const materials=new Map();
    const paint=(name,hex,metallic=.12)=>{
      const m=new B.PBRMaterial('line_'+name,scene);
      m.albedoColor=B.Color3.FromHexString(hex).toLinearSpace();
      m.roughness=.73; m.metallic=metallic; m.backFaceCulling=false;
      materials.set(name,m);
    };
    paint('ivory','#f5dfa9'); paint('blue','#254052'); paint('red','#c3482c');
    paint('glass','#407375',.32); paint('alloy','#b7b9a8',.55); paint('ochre','#dca451');
    for(const name of ['express','feeder','envelope']){
      paint(name,'#ffffff',name==='envelope'?.05:.19);
      const texture=new B.Texture('./assets/textures/nomad/airline-'+name+'.webp',scene,false,false);
      materials.get(name).albedoTexture=texture;
    }
    paint('apron','#565c59');
    this.ledger=new PortLedger();
    this.fields=buildAirfields(scene,[industrial,forest],materials);
    let batches=new Map();
    const part=(m,ink,x=0,y=0,z=0)=>{
      m.position.set(x,y,z);
      if(!batches.has(ink))batches.set(ink,[]);
      batches.get(ink).push(m); return m;
    };
    const finish=(root)=>{
      for(const [ink,meshes] of batches){
        const m=B.Mesh.MergeMeshes(meshes,true,true); m.name=root.name+'_'+ink;
        m.parent=root;m.material=materials.get(ink);m.receiveShadows=true;m.isPickable=false;
      }
      batches=new Map();
    };
    const beam=(a,b,width,ink)=>{
      const v=B.Vector3.FromArray(a),w=B.Vector3.FromArray(b),d=w.subtract(v);
      const mid=v.add(w).scale(.5);
      const m=part(B.MeshBuilder.CreateCylinder('strut',{diameter:width,height:d.length(),tessellation:7},scene),ink,mid.x,mid.y,mid.z);
      m.rotationQuaternion=B.Quaternion.FromUnitVectorsToRef(B.Axis.Y,d.normalize(),new B.Quaternion());
    };
    const skin=(paths,ink,x=0,y=0,z=0)=>{
      const n=paths[0].length,points=[],uv=[],indices=[],normals=[];
      for(const [i,ring] of paths.entries()){
        for(let j=0;j<=n;j++){
          points.push(...ring[j%n].asArray());uv.push(i/(paths.length-1),j/n);
          if(i && j){
            const a=i*(n+1)+j,b=a-(n+1);
            indices.push(a,b,b-1,a,b-1,a-1);
          }
        }
      }
      B.VertexData.ComputeNormals(points,indices,normals);
      const mid=Math.floor(paths.length/2),center=paths[mid].reduce((v,p)=>v.addInPlace(p),B.Vector3.Zero()).scale(1/n);
      const normal=B.Vector3.FromArray(normals,3*mid*(n+1));
      if(B.Vector3.Dot(normal,paths[mid][0].subtract(center))<0){
        for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
        B.VertexData.ComputeNormals(points,indices,normals);
      }
      const mesh=new B.Mesh('formedSkin',scene),data=new B.VertexData();
      Object.assign(data,{positions:points,indices,normals,uvs:uv});data.applyToMesh(mesh);
      return part(mesh,ink,x,y,z);
    };
    const hull=(stations,ink,x=0,y=0,z=0)=>{
      const rings=stations.map(([at,wide,tall,base=0])=>Array.from({length:24},(_,i)=>{
        const a=(i-6)*Math.PI/12;return new B.Vector3(wide*Math.cos(a),base+tall*Math.sin(a),at);
      }));
      return skin(rings,ink,x,y,z);
    };
    const foil=(span,chord,sweep,ink,x,y,z)=>{
      const section=[[0,0],[.13,.075],[.38,.105],[.73,.065],[1,0],[.65,-.033],[.2,-.042]];
      const rows=[[-1,.10],[-.93,.42],[-.67,.75],[-.19,1],[.19,1],[.67,.75],[.93,.42],[1,.10]];
      return skin(rows.map(([f,k])=>section.map(([u,v])=>new B.Vector3(f*span/2,v*k*chord+.035*Math.abs(f)*span,(u-.32)*chord*k+sweep*Math.abs(f)))),ink,x,y,z);
    };
    const box=(ink,x,y,z,w,h,d)=>part(B.MeshBuilder.CreateBox('fitting',{width:w,height:h,depth:d},scene),ink,x,y,z);
    this.planes=[];
    for(let i=0;i<2;i++){
      const twin=i===0,root=new B.TransformNode(twin?'passengerExpress':'passengerFeeder',scene);
      const coat=twin?'ivory':'red',width=twin?1.46:.98,tail=twin?10:7;
      hull([[-tail,.04,.05],[-tail*.82,.68*width,.75],[-tail*.56,width,1.48],[-tail*.32,width,1.58],
        [tail*.2,width*.92,1.46],[tail*.60,width*.61,.90],[tail*.94,.28,.40],[tail,.04,.06]],twin?'express':'feeder');
      foil(twin?26:17,twin?4.5:3.25,1.45,twin?'blue':'ivory',0,-.77,-1.4);
      foil(twin?9.7:6.7,2.5,1.25,coat,0,.04,tail*.75);
      const fin=foil(4.8,3.05,1.25,twin?'red':'blue',0,1.45,tail*.77);
      fin.rotation.z=Math.PI/2;fin.scaling.x=.88;
      for(const side of [-1,1]){
        const pane=box('glass',side*width*.65,.82,-tail*.72,.63,.73,1.47);
        pane.rotation.y=side*.39;pane.rotation.z=side*.24;
      }
      for(const sign of [-1,1]){
        const x=sign*(twin?3.85:2.13);
        beam([x*.85,-.6,-1.2],[x,-1.45,-1.45],.15,'alloy');
        const wheel=part(B.MeshBuilder.CreateCylinder('landingWheel',{diameter:.8,height:.32,tessellation:16},scene),'blue',x,-1.43,-1.45);
        wheel.rotation.z=Math.PI/2;
      }
      const hubs=[];
      for(const x of twin?[-4.35,4.35]:[0]){
        const z=twin?-2.7:-tail+.35;
        hull([[-1.23,.06,.06],[-1.11,.76,.74],[-.71,.85,.83],[.9,.76,.72],[2.15,.19,.23]],'alloy',x,-.39,z);
        const hub=new B.TransformNode('airlinePropeller',scene);hub.parent=root;hub.position.set(x,-.39,z-1.29);
        const blades=B.MeshBuilder.CreateRibbon('laminatedPropeller',{pathArray:[-1,0,1].map(s=>[
          new B.Vector3(s*1.52,-s*.07,0),new B.Vector3(s*1.54,.10-s*.07,.04),new B.Vector3(s*1.22,.17-s*.07,.01)]),sideOrientation:B.Mesh.DOUBLESIDE},scene);
        blades.parent=hub;blades.material=materials.get('blue');hubs.push(hub);
      }
      finish(root);this.planes.push({root,hubs});
    }
    const mast=(island,x,z,name)=>{
      const root=new B.TransformNode(name,scene);root.parent=island.group;
      root.position.set(x,island.getTopHeightLocal?.(x,z)??2,z);
      const levels=[[0,3.0],[6,2.35],[13,1.72],[20,1.13],[26,.64]];
      for(let j=0;j<levels.length-1;j++){
        const [y,r]=levels[j],[next,s]=levels[j+1];
        for(let k=0;k<4;k++){
          const corner=(n,yy,rr)=>[rr*Math.cos(n*Math.PI/2+.78),yy,rr*Math.sin(n*Math.PI/2+.78)];
          const a=corner(k,y,r),b=corner(k+1,y,r),c=corner(k,next,s),d=corner(k+1,next,s);
          beam(a,c,.31,'blue');beam(a,b,.24,'blue');beam(j%2?b:a,j%2?c:d,.18,'ochre');
        }
      }
      for(const [y,d,h,ink] of [[20,4.6,.40,'ochre'],[21.2,3.1,1.92,'glass'],[22.3,3.85,.42,'ivory'],[26.3,1.65,.85,'red']]){
        part(B.MeshBuilder.CreateCylinder('mastHead',{height:h,diameter:d,tessellation:12},scene),ink,0,y,0);
      }
      finish(root);return root;
    };
    this.berths=[mast(industrial,-21,16,'westMooringMast'),mast(forest,27,11,'eastMooringMast')];
    const moored=new B.TransformNode('passengerAirship',scene);
    const rings=[[-.02,.02,.02],[2,3.4,3.3],[7,6.3,6.1],[15,8,7.8],[26,8.8,8.2],[39,8.6,8],[50,7.1,6.8],[60,4.45,4.2],[68,.28,.28],[69,.03,.03]];
    hull(rings,'envelope');
    for(const [at,r,h] of rings.slice(2,-2)){
      const path=Array.from({length:33},(_,j)=>new B.Vector3(Math.cos(j*Math.PI/16)*(r+.035),Math.sin(j*Math.PI/16)*(h+.035),at));
      part(B.MeshBuilder.CreateTube('envelopeSeam',{path,radius:.052,tessellation:5},scene),'ochre');
    }
    hull([[-7,.04,.04],[-5.8,1.9,1.1],[-4,2.1,1.6],[5,2.1,1.6],[7.2,1.45,1.05],[8,.03,.03]],'blue',0,-7.9,23);
    for(const s of [-1,1]){
      for(let j=0;j<8;j++)box('ivory',s*2.02,-7.79,18.6+j*1.29,.15,.72,.91);
      hull([[-2.5,.04,.04],[-1.3,.9,.8],[1,.86,.74],[2.5,.06,.06]],'alloy',s*6.1,-6.30,36);
      beam([s*4.2,-6.4,34],[s*6.1,-6.3,36],.27,'blue');
    }
    foil(21,7.6,4.3,'red',0,0,57.5);
    foil(22,8,4.3,'ivory',0,0,58).rotation.z=Math.PI/2;
    finish(moored);moored.parent=this.berths[0];moored.position.y=26.6;this.moored=moored;
    this.update(0);
  }
  update(time){
    this.moored.rotation.y=.28+.13*Math.sin(time*.066);
    this.moored.rotation.x=.016*Math.sin(time*.17);
    const {root,hubs}=this.planes[0];
    const a=time*.055;
    root.position.set(-135+Math.cos(a)*205,70+7*Math.sin(a*2),-135+Math.sin(a)*165);
    root.rotation.y=Math.atan2(205*Math.sin(a),-165*Math.cos(a));
    root.rotation.z=-.10-.035*Math.cos(a);
    for(const hub of hubs)hub.rotation.z=time*38;
    this.ledger.update(time);
    updateShuttle(this,time);
  }
}
