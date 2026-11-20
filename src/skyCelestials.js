/** Painted post-Shattering geology in the daytime sky; no lights, sprites or navigation rings. */
export class SkyCelestials {
  constructor(scene,camera) {
    this.scene=scene;this.camera=camera;this.disposed=false;this.time=0;
    this.root=new BABYLON.TransformNode('shatteredSkyCelestials',scene);
    this.primaryDirection=new BABYLON.Vector3(-.46,.21,-.86).normalize();
    this.secondaryDirection=new BABYLON.Vector3(.42,.24,-.87).normalize();
    this.materials=[];this.meshes=[];this.chips=[];
    this._registerShaders();
    this.primaryMaterial=this._material('shatteredIvoryMoon',this.primaryDirection,false);
    this.secondaryMaterial=this._material('smallOchreMoon',this.secondaryDirection,true);

    const right=BABYLON.Vector3.Cross(BABYLON.Axis.Y,this.primaryDirection.scale(-1)).normalize();
    const up=BABYLON.Vector3.Cross(this.primaryDirection.scale(-1),right).normalize();
    const moonCenter=this.primaryDirection.scale(2200);

    // Truly split shattered moon: two jagged separated halves with a visible sky chasm + molten core remnant!
    const splitAxis=right.scale(0.76).add(up.scale(0.65)).normalize();
    this.primary=this._splitHalf('fracturedIvoryMoon_A',36,24,0.014,1);
    this.primary.material=this.primaryMaterial;this.primary.scaling.setAll(255);
    this.primary.position.copyFrom(moonCenter).addInPlace(splitAxis.scale(62));
    this.primary.rotation.z=-0.09;

    this.primaryB=this._splitHalf('fracturedIvoryMoon_B',36,24,0.014,-1);
    this.primaryB.material=this.primaryMaterial;this.primaryB.scaling.setAll(245);
    this.primaryB.position.copyFrom(moonCenter).addInPlace(splitAxis.scale(-68));
    this.primaryB.rotation.z=0.13;

    // Glowing exposed planetary core & magma-ether fissure drifting in the chasm between the two halves
    const coreMat=new BABYLON.StandardMaterial('shatteredMoonCoreMat',scene);
    coreMat.emissiveColor=BABYLON.Color3.FromHexString('#ff7824');
    coreMat.disableLighting=true;coreMat.alpha=0.88;coreMat.alphaMode=BABYLON.Engine.ALPHA_ADD;coreMat.disableDepthWrite=true;
    this.materials.push(coreMat);
    this.coreGlow=BABYLON.MeshBuilder.CreateSphere('shatteredMoonCore', { diameter: 155, segments: 12 }, scene);
    this.coreGlow.position.copyFrom(moonCenter).addInPlace(splitAxis.scale(-2));
    this.coreGlow.scaling.set(0.42, 1.55, 0.42);
    this.coreGlow.rotation.z=0.72;
    this.coreGlow.material=coreMat;
    this._configure(this.coreGlow);

    this.secondary=this._sphere('distantOchreMoon',24,16,0.005);
    this.secondary.material=this.secondaryMaterial;this.secondary.scaling.setAll(88);
    this.secondary.position.copyFrom(this.secondaryDirection.scale(2750));

    // Broken continental rim pieces + chasm debris bridge floating between the two split halves
    const fragments=[
      [0.02,0.04,24,.04],[-0.08,-0.12,18,.08],[0.14,0.18,16,-.06],[-0.16,-0.24,14,.05],[0.22,-0.18,12,.09],
      [1.07,.29,34,.12],[-.94,-.58,26,-.1],
      [1.24,.39,18,.1],[1.42,.47,14,-.13],[1.62,.58,11,.2],
      [1.85,.66,9,-.14],[-1.18,-.72,15,.11],[-1.42,-.86,10,-.08],
      [2.12,.74,13,.08],[2.42,.82,9,-.12],[-1.68,-.98,12,.14],[-1.95,-1.12,8,-.06],
      [0.88,-.34,16,.15],[-0.72,.44,14,-.11],[2.78,.89,7,.05],[-2.28,-1.22,6,-.09],
    ];
    const chipParts=[];
    fragments.forEach(([x,y,size,depth],index)=>{
      const direction=this.primaryDirection.scale(2200+depth*100).add(right.scale(x*260)).add(up.scale(y*260));
      const chip=BABYLON.MeshBuilder.CreateIcoSphere(`shatteredMoonFragment_${index}`,{radius:1,subdivisions:1,flat:true},scene);
      const positions=chip.getVerticesData(BABYLON.VertexBuffer.PositionKind);
      for(let i=0;i<positions.length;i+=3){const factor=1+.16*Math.sin(i*1.71+index*2.3);positions[i]*=factor;positions[i+1]*=factor;positions[i+2]*=factor;}
      chip.updateVerticesData(BABYLON.VertexBuffer.PositionKind,positions);
      const normals=[];BABYLON.VertexData.ComputeNormals(positions,chip.getIndices(),normals);chip.updateVerticesData(BABYLON.VertexBuffer.NormalKind,normals);
      chip.position.copyFrom(direction);chip.scaling.set(size,size*.69,size*.83);
      chip.rotation.set(index*.7,index*.91,index*.42);
      chip.computeWorldMatrix(true);
      chipParts.push(chip);
    });
    const mergedChips=BABYLON.Mesh.MergeMeshes(chipParts,true,true,undefined,false,false);
    if(mergedChips){mergedChips.name='shatteredMoonFragments';mergedChips.material=this.primaryMaterial;this._configure(mergedChips);this.chips.push(mergedChips);}
    this._fragmentCount=fragments.length;

    // Kept clean: split shattered moon + debris arc (no orbital ring)
    this.update(0);
    scene.onDisposeObservable.addOnce(()=>this.dispose());
  }

  /** Generates a truly split jagged hemisphere cleaved along the diagonal fault plane. */
  _splitHalf(name, longitude, latitude, roughness, side) {
    const positions = [], normals = [], indices = [];
    const planeN = new BABYLON.Vector3(0.76, 0.65, 0.0).normalize();
    for (let j = 0; j <= latitude; j++) {
      const phi = (j / latitude) * Math.PI;
      for (let i = 0; i <= longitude; i++) {
        const theta = (i / longitude) * Math.PI * 2;
        let nx = Math.sin(phi) * Math.cos(theta);
        let ny = Math.cos(phi);
        let nz = Math.sin(phi) * Math.sin(theta);
        const radius = 1 + roughness * (Math.sin(theta * 7 + ny * 8) * 0.65 + Math.sin(theta * 13 - ny * 11) * 0.35) * Math.sin(phi);
        let px = nx * radius, py = ny * radius, pz = nz * radius;
        const proj = px * planeN.x + py * planeN.y;
        const jag = (Math.sin(pz * 9.0 + py * 6.0) * 0.045 + Math.cos(px * 11.0 - pz * 7.0) * 0.03);
        if (side > 0 && proj < jag) {
          const shift = jag - proj;
          px += planeN.x * shift; py += planeN.y * shift;
          nx = -planeN.x; ny = -planeN.y; nz = 0;
        } else if (side < 0 && proj > jag) {
          const shift = proj - jag;
          px -= planeN.x * shift; py -= planeN.y * shift;
          nx = planeN.x; ny = planeN.y; nz = 0;
        }
        positions.push(px, py, pz);
        normals.push(nx, ny, nz);
      }
    }
    const stride = longitude + 1;
    for (let j = 0; j < latitude; j++) {
      for (let i = 0; i < longitude; i++) {
        const a = j * stride + i, b = a + 1, c = a + stride, d = c + 1;
        indices.push(a, c, b, b, c, d);
      }
    }
    const mesh = new BABYLON.Mesh(name, this.scene), data = new BABYLON.VertexData();
    Object.assign(data, { positions, normals, indices });
    data.applyToMesh(mesh);
    return this._configure(mesh);
  }

  _configure(mesh) {
    mesh.parent=this.root;mesh.renderingGroupId=0;mesh.isPickable=false;mesh.checkCollisions=false;
    mesh.receiveShadows=false;mesh.metadata={celestial:true};this.meshes.push(mesh);return mesh;
  }

  _sphere(name,longitude,latitude,roughness) {
    const positions=[0,1,0],normals=[0,1,0],indices=[];
    for(let j=1;j<latitude;j++){
      const phi=j/latitude*Math.PI;
      for(let i=0;i<longitude;i++){
        const theta=i/longitude*Math.PI*2;
        const nx=Math.sin(phi)*Math.cos(theta),ny=Math.cos(phi),nz=Math.sin(phi)*Math.sin(theta);
        const radius=1+roughness*(Math.sin(theta*7+ny*8)*.65+Math.sin(theta*13-ny*11)*.35)*Math.sin(phi);
        positions.push(nx*radius,ny*radius,nz*radius);normals.push(nx,ny,nz);
      }
    }
    const south=positions.length/3;positions.push(0,-1,0);normals.push(0,-1,0);
    for(let i=0;i<longitude;i++){
      const next=(i+1)%longitude;indices.push(0,1+next,1+i);
      for(let j=0;j<latitude-2;j++){
        const a=1+j*longitude+i,b=1+j*longitude+next,c=a+longitude,d=b+longitude;
        indices.push(a,b,d,a,d,c);
      }
      const row=1+(latitude-2)*longitude;indices.push(row+i,row+next,south);
    }
    // Latitude parameterization above has inward winding; explicitly choose outward fronts.
    for(let i=0;i<indices.length;i+=3){
      const a=indices[i]*3,b=indices[i+1]*3,c=indices[i+2]*3;
      const u=[positions[b]-positions[a],positions[b+1]-positions[a+1],positions[b+2]-positions[a+2]];
      const v=[positions[c]-positions[a],positions[c+1]-positions[a+1],positions[c+2]-positions[a+2]];
      const dot=(u[1]*v[2]-u[2]*v[1])*positions[a]+(u[2]*v[0]-u[0]*v[2])*positions[a+1]+(u[0]*v[1]-u[1]*v[0])*positions[a+2];
      if(dot<0)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
    }
    const mesh=new BABYLON.Mesh(name,this.scene),data=new BABYLON.VertexData();
    Object.assign(data,{positions,normals,indices});data.applyToMesh(mesh);
    return this._configure(mesh);
  }

  _material(name,direction,warm) {
    const mat=new BABYLON.ShaderMaterial(name,this.scene,{vertex:'shatteredCelestial',fragment:'shatteredCelestial'},
      {attributes:['position','normal'],uniforms:['worldViewProjection','world','uViewDirection','uRight','uUp','uWarm','uFragment'],needAlphaBlending:true,defines:['#define IMAGEPROCESSINGPOSTPROCESS']});
    const view=direction.scale(-1),right=BABYLON.Vector3.Cross(BABYLON.Axis.Y,view).normalize(),up=BABYLON.Vector3.Cross(view,right).normalize();
    mat.setVector3('uViewDirection',view);mat.setVector3('uRight',right);mat.setVector3('uUp',up);
    mat.setFloat('uWarm',warm?1:0);mat.setFloat('uFragment',0);
    mat.disableDepthWrite=true;mat.backFaceCulling=false;mat.alphaMode=BABYLON.Engine.ALPHA_COMBINE;
    this.materials.push(mat);return mat;
  }

  _registerShaders() {
    BABYLON.Effect.ShadersStore.shatteredCelestialVertexShader=`
      precision highp float;
      attribute vec3 position; attribute vec3 normal;
      uniform mat4 worldViewProjection; uniform mat4 world;
      varying vec3 vSurface; varying vec3 vNormal;
      void main(){vSurface=normalize(position);vNormal=normalize(mat3(world)*normal);gl_Position=worldViewProjection*vec4(position,1.0);}
    `;
    BABYLON.Effect.ShadersStore.shatteredCelestialFragmentShader=`
      precision highp float;
      varying vec3 vSurface; varying vec3 vNormal;
      uniform vec3 uViewDirection; uniform vec3 uRight; uniform vec3 uUp;
      uniform float uWarm; uniform float uFragment;
      float hash2(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+34.12);return fract(p.x*p.y);}
      float noise2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(hash2(i),hash2(i+vec2(1,0)),f.x),mix(hash2(i+vec2(0,1)),hash2(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){return noise2(p)*.66+noise2(p*2.15+vec2(5.1,2.7))*.34;}
      float basin(vec2 p,vec2 center,float radius){float r=length((p-center)/radius);float rim=(r-.93)*8.0;return exp(-r*r*2.5)*-.13+exp(-rim*rim)*.09;}
      void main(){
        vec3 n=normalize(vNormal),p=normalize(vSurface);
        vec2 face=vec2(dot(n,uRight),dot(n,uUp));
        float facing=clamp(dot(n,uViewDirection),0.0,1.0);
        float land=fbm(face*4.2+vec2(3.0,1.0));
        float broad=noise2(face*2.4+vec2(7.1,3.4));
        float strata=sin(p.y*17.0+land*7.5)*.018;
        // Noble pale lunar marble & atmospheric slate-grey maria (not spotted green/teal asteroid)
        vec3 ivory=vec3(.86,.84,.78),mare=vec3(.56,.58,.62),slate=vec3(.30,.35,.43);
        vec3 warmFace=vec3(.80,.70,.58),warmShade=vec3(.44,.42,.40);
        vec3 geology=mix(mare,ivory,smoothstep(.26,.68,land+broad*.15));
        geology=mix(geology,warmFace,uWarm*.68);
        float craters=(basin(face,vec2(-.32,.30),.23)+basin(face,vec2(.38,.14),.14)+basin(face,vec2(.02,-.44),.18)+basin(face,vec2(-.49,-.27),.09))*0.55;
        geology+=craters+strata*0.65;
        vec3 light=normalize(uViewDirection*.58-uRight*.63+uUp*.54);
        float sunlight=smoothstep(-.40,.78,dot(n,light));
        geology=mix(mix(slate,warmShade,uWarm),geology,.42+.58*sunlight);
        // Ancient diagonal fault: subtle dark chasm with muted mineral rim
        float bent=face.x*.76+face.y*.65-.035+(noise2(face*10.0)-.5)*.034;
        float scar=abs(bent);
        float broken=(1.0-smoothstep(.012,.030,scar))*(1.0-uWarm*.75);
        geology=mix(geology,vec3(.18,.22,.28),broken*.72);
        float mineral=(1.0-smoothstep(.002,.006,scar))*(1.0-uWarm);
        geology=mix(geology,vec3(.64,.66,.64),mineral*.45);
        // High-altitude warm amber-taupe atmospheric wash integrates the moon seamlessly into the Project Nomads sky
        float invFace=1.0-facing;
        float limb=invFace*invFace*invFace;
        geology=mix(geology,vec3(.68,.58,.46),0.26+limb*.38);
        float alpha=smoothstep(.0,.12,facing)*.84;
        // Fast linear conversion (avoids 3x per-pixel pow() near the sun)
        vec3 gClamp=max(geology,vec3(0.0));
        gl_FragColor=vec4(gClamp*gClamp,alpha);
      }
    `;
  }

  update(dt) {
    if(this.disposed)return;this.time+=Math.max(0,Math.min(dt,.1));
    // One camera-relative parent avoids double application of Babylon infiniteDistance offsets.
    this.root.position.copyFrom(this.camera.parent?this.camera.globalPosition:this.camera.position);
    if(this._ringVeinMat) this._ringVeinMat.alpha = 0.36 + 0.24 * Math.sin(this.time * 1.15);
    if(this.coreGlow) this.coreGlow.scaling.y = 1.38 + 0.14 * Math.sin(this.time * 0.9);
  }

  get snapshot(){return {meshes:this.meshes.length,triangles:this.meshes.reduce((n,m)=>n+m.getTotalIndices()/3,0),
    primaryAngularDiameterDegrees:2*Math.atan(260/2200)*180/Math.PI,orbitalFragments:this._fragmentCount||this.chips.length,
    rootPosition:this.root.position.asArray(),primaryDirection:this.primaryDirection.asArray(),newLights:0,colliders:0};}

  dispose(){if(this.disposed)return;this.disposed=true;this.root.dispose();this.materials.forEach(m=>m.dispose());}
}
