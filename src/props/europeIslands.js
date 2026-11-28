/**
 * «Осколки Европы Интербеллума (1920–1939)» — High-Detail Textured 3D European Islands & Architecture.
 * Built with Babylon.js 8 PBR paired albedo + tangent-space normal maps, CreateLathe profiles,
 * arched stone viaducts, half-timbered cottages, Alpine castles, and cascading cliff waterfalls.
 * Zero flat untextured white primitives.
 */

function c3(hex) {
  return BABYLON.Color3.FromHexString(hex);
}

function getOrCreateMat(scene, name, factory) {
  return scene.getMaterialByName(name) || factory();
}

/**
 * Generates paired Albedo + Normal textures for warm weathered European cut-stone masonry
 * with arched windows, stone cornices, and base weathering (no flat white cubes!).
 */
function createEuropeanMasonryTextures(scene) {
  const albedo = new BABYLON.DynamicTexture('euMasonryAlbedo', { width: 512, height: 512 }, scene, true);
  const normal = new BABYLON.DynamicTexture('euMasonryNormal', { width: 512, height: 512 }, scene, true);
  const ctx = albedo.getContext();
  const nCtx = normal.getContext();

  ctx.fillStyle = '#c4b79c';
  ctx.fillRect(0, 0, 512, 512);
  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, 512, 512);

  // 1. Cut-stone ashlar courses
  const rows = 16;
  const rh = 512 / rows;
  for (let r = 0; r < rows; r++) {
    const off = (r % 2) * 32;
    for (let x = -32; x < 512; x += 64) {
      const v = (((r * 19 + x * 7) % 22) - 11);
      ctx.fillStyle = `rgb(${190 + v}, ${176 + v}, ${149 + v})`;
      ctx.fillRect(x + off + 1, r * rh + 1, 62, rh - 2);
      ctx.strokeStyle = 'rgba(72, 62, 48, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + off + 1, r * rh + 1, 62, rh - 2);

      nCtx.fillStyle = 'rgb(128, 92, 240)';
      nCtx.fillRect(x + off, r * rh, 64, 2);
      nCtx.fillStyle = 'rgb(92, 128, 240)';
      nCtx.fillRect(x + off, r * rh, 2, rh);
    }
  }

  // 2. Stone horizontal belt cornices
  for (const cy of [128, 256, 384]) {
    ctx.fillStyle = '#a89a80';
    ctx.fillRect(0, cy - 4, 512, 8);
    nCtx.fillStyle = 'rgb(128, 178, 240)';
    nCtx.fillRect(0, cy - 4, 512, 4);
    nCtx.fillStyle = 'rgb(128, 78, 240)';
    nCtx.fillRect(0, cy, 512, 4);
  }

  // 3. Classical European arched windows (dark stone sills + warm interior glow + mullions)
  for (const wy of [42, 170, 298]) {
    for (let wx = 26; wx < 500; wx += 64) {
      const lit = ((wx + wy) % 3) !== 0;
      ctx.fillStyle = '#5a5043';
      ctx.fillRect(wx - 3, wy - 3, 28, 52);
      const pane = ctx.createLinearGradient(wx, wy, wx + 9, wy + 46);
      pane.addColorStop(0, lit ? '#65513d' : '#26363b');
      pane.addColorStop(.45, lit ? '#bea06e' : '#536969');
      pane.addColorStop(1, lit ? '#c2aa7d' : '#34464a');
      ctx.fillStyle = pane;
      ctx.fillRect(wx, wy, 22, 46);
      // Window mullions
      ctx.fillStyle = '#4e4438';
      ctx.fillRect(wx + 10, wy, 2, 46);
      ctx.fillRect(wx, wy + 20, 22, 2);
      // Recessed window normal
      nCtx.fillStyle = 'rgb(128,128,255)';
      nCtx.fillRect(wx, wy, 22, 46);
      nCtx.fillStyle = 'rgb(78,128,245)';
      nCtx.fillRect(wx - 2, wy, 2, 46);
      nCtx.fillStyle = 'rgb(175,128,245)';
      nCtx.fillRect(wx + 22, wy, 2, 46);
      ctx.fillStyle = '#decca6';
      ctx.fillRect(wx - 4, wy + 46, 30, 2);
      ctx.fillStyle = 'rgba(64,49,40,.36)';
      ctx.fillRect(wx - 3, wy + 49, 28, 3);
    }
  }

  // 4. Subtle mossy weathering along bottom plinth
  const grad = ctx.createLinearGradient(0, 420, 0, 512);
  grad.addColorStop(0, 'rgba(72, 76, 56, 0.0)');
  grad.addColorStop(1, 'rgba(62, 66, 48, 0.48)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 420, 512, 92);

  albedo.update();
  normal.update();
  return { albedo, normal };
}

/**
 * Generates paired Albedo + Normal textures for European Half-Timbered Cottage walls.
 */
function createTimberCottageTextures(scene) {
  const albedo = new BABYLON.DynamicTexture('euTimberAlbedo', { width: 256, height: 256 }, scene, true);
  const normal = new BABYLON.DynamicTexture('euTimberNormal', { width: 256, height: 256 }, scene, true);
  const ctx = albedo.getContext();
  const nCtx = normal.getContext();

  ctx.fillStyle = '#d8ccb2';
  ctx.fillRect(0, 0, 256, 256);
  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, 256, 256);

  // Flecks of lime and coarse sand in the render, carried through the normal map.
  for(let i=1;i<=8500;i++) {
    const hash=Math.imul(i ^ (i>>>3),0x45d9f3b)>>>0;
    const x=hash&255,y=(hash>>>12)&255;
    ctx.fillStyle=(hash&1024)?'rgba(95,77,56,.13)':'rgba(255,242,211,.28)';
    ctx.fillRect(x,y,1+(hash>>>28)%3,2);
    nCtx.fillStyle=(hash&1024)?'rgb(117,132,253)':'rgb(137,122,253)';
    nCtx.fillRect(x,y,2,2);
  }
  // Dark oak timber framing beams
  ctx.fillStyle = '#4d3b2c';
  nCtx.fillStyle = 'rgb(156,156,245)';
  for (const y of [0, 120, 240]) {
    ctx.fillRect(0, y, 256, 14);
    nCtx.fillRect(0, y, 256, 14);
  }
  for (let x = 0; x < 256; x += 64) {
    ctx.fillRect(x, 0, 12, 256);
    nCtx.fillRect(x, 0, 12, 256);

  }
  // Upper-storey casements sit inside the oak bays, with a shaded reveal and a projecting sill.
  for (const x of [22, 86, 150, 214]) {
    ctx.fillStyle = '#5c5044';
    ctx.fillRect(x - 3, 42, 32, 49);
    ctx.fillStyle = '#2e494b';
    ctx.fillRect(x, 46, 26, 41);
    ctx.fillStyle = '#698080';
    ctx.fillRect(x + 2, 48, 10, 17);
    ctx.fillStyle = '#d9be90';
    ctx.fillRect(x + 12, 46, 2, 41);
    ctx.fillRect(x, 65, 26, 2);
    ctx.fillRect(x - 5, 89, 36, 4);
    nCtx.fillStyle = 'rgb(128,92,249)';
    nCtx.fillRect(x - 5, 89, 36, 2);
  }
  // Split grain follows each post and lintel rather than crossing the lime infill.
  for (let i = 0; i < 440; i++) {
    const h = Math.imul(i + 1, 0x45d9f3b) >>> 0;
    ctx.fillStyle = h & 16 ? 'rgba(228,190,132,.21)' : 'rgba(38,27,19,.32)';
    ctx.fillRect((h % 4)*64 + ((h >>> 8)%10), (h >>> 12)%232, 1, 4 + (h >>> 24)%20);
    ctx.fillRect((h >>> 12)%248, (h%2)*120 + ((h >>> 7)%12), 3 + (h >>> 24)%16, 1);
  }
  // Stone foundation plinth
  ctx.fillStyle = '#8b8272';
  ctx.fillRect(0, 196, 256, 60);

  albedo.update();
  normal.update();
  return { albedo, normal };
}

/**
 * Generates paired Albedo + Normal shingle roof tiles (slate blue or terracotta red).
 */
function createRoofTileTextures(scene, name, baseHex, darkHex) {
  const albedo = new BABYLON.DynamicTexture(`${name}_alb`, { width: 256, height: 256 }, scene, true);
  const normal = new BABYLON.DynamicTexture(`${name}_nrm`, { width: 256, height: 256 }, scene, true);
  const ctx = albedo.getContext();
  const nCtx = normal.getContext();

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 256, 256);
  nCtx.fillStyle = 'rgb(128,128,255)';
  nCtx.fillRect(0, 0, 256, 256);

  const rows = 16;
  const rh = 256 / rows;
  for (let r = 0; r < rows; r++) {
    ctx.fillStyle = darkHex;
    ctx.fillRect(0, r * rh, 256, 3);
    nCtx.fillStyle = 'rgb(128, 76, 240)';
    nCtx.fillRect(0, r * rh, 256, 3);
    nCtx.fillStyle = 'rgb(128, 170, 240)';
    nCtx.fillRect(0, r * rh + 3, 256, 2);
    const stagger = (r % 2) * 8;
    for (let tile = -1; tile < 16; tile++) {
      const x = tile * 16 + stagger;
      const grain = ((tile + 16) % 16 * 71 + r * 43 + r * tile * tile) & 31;
      ctx.fillStyle = grain < 16 ? `rgba(235,198,147,${.06 + grain*.008})`
                                  : `rgba(49,45,40,${.08 + (grain-16)*.01})`;
      ctx.fillRect(x+1, r*rh+3, 15, rh-3);
      ctx.fillStyle = darkHex;
      ctx.fillRect(x, r*rh+2, 1, rh-2);
      ctx.fillStyle = 'rgba(244,217,171,.28)';
      ctx.fillRect(x+2+(grain%3), (r+1)*rh-1, 5+grain%7, 1);
    }
  }
  albedo.update();
  normal.update();
  albedo.wrapU = albedo.wrapV = normal.wrapU = normal.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
  albedo.uScale = normal.uScale = 1.4;
  albedo.vScale = normal.vScale = 1;
  return { albedo, normal };
}

export function getEuropePalette(scene) {
  const B = BABYLON;
  const isNull = scene.getEngine() instanceof B.NullEngine;

  const chalk = getOrCreateMat(scene, 'euChalkCliffMat', () => {
    const m = new B.PBRMaterial('euChalkCliffMat', scene);
    m.albedoColor = c3('#d8d2c2'); // sunlit White Cliffs of Dover chalk-limestone (textured, never flat white!)
    m.metallic = 0.0; m.roughness = 0.92;
    if (!isNull) {
      const diff = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', scene);
      diff.uScale = diff.vScale = 3.2;
      m.albedoTexture = diff;
      const bump = new B.Texture('./assets/benchmark/textures/aerial_rocks_02/nor_gl.jpg', scene);
      bump.uScale = bump.vScale = 3.2;
      m.bumpTexture = bump;
      m.bumpTexture.level = 1.25;
    }
    return m;
  });

  const limestone = getOrCreateMat(scene, 'euLimestoneMat', () => {
    const m = new B.PBRMaterial('euLimestoneMat', scene);
    m.albedoColor = c3('#ddd3be');
    m.metallic = 0.02; m.roughness = 0.84;
    if (!isNull) {
      const t = createEuropeanMasonryTextures(scene);
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.9;
    }
    return m;
  });

  const timber = getOrCreateMat(scene, 'euTimberFacadeMat', () => {
    const m = new B.PBRMaterial('euTimberFacadeMat', scene);
    m.albedoColor = c3('#e2d8c4');
    m.metallic = 0.02; m.roughness = 0.82;
    if (!isNull) {
      const t = createTimberCottageTextures(scene);
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.85;
    }
    return m;
  });

  const slateRoof = getOrCreateMat(scene, 'euSlateRoofMat', () => {
    const m = new B.PBRMaterial('euSlateRoofMat', scene);
    m.albedoColor = c3('#dedbd4');
    m.metallic = 0; m.roughness = 0.83;
    if (!isNull) {
      const t = createRoofTileTextures(scene, 'euSlate', '#505d6b', '#2c343d');
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.8;
    }
    return m;
  });

  const terracotta = getOrCreateMat(scene, 'euTerracottaMat', () => {
    const m = new B.PBRMaterial('euTerracottaMat', scene);
    m.albedoColor = c3('#f1dbc4');
    m.metallic = 0; m.roughness = 0.92;
    if (!isNull) {
      const t = createRoofTileTextures(scene, 'euTerra', '#b34f34', '#6e2c1b');
      m.albedoTexture = t.albedo;
      m.bumpTexture = t.normal;
      m.bumpTexture.level = 0.8;
    }
    return m;
  });

  const iron = getOrCreateMat(scene, 'euIronLatticeMat', () => {
    const m = new B.PBRMaterial('euIronLatticeMat', scene);
    m.albedoColor = c3('#4d545c');
    m.metallic = 0.68; m.roughness = 0.42;
    return m;
  });

  const grass = getOrCreateMat(scene, 'euMeadowGrassMat', () => {
    const m = new B.PBRMaterial('euMeadowGrassMat', scene);
    m.albedoColor = c3('#96aa6f');
    m.metallic = 0.0; m.roughness = 0.92;
    if (!isNull) {
      const diff = new B.Texture('./assets/benchmark/textures/aerial_grass_rock/Diffuse.jpg', scene);
      diff.uScale = diff.vScale = 4.0;
      m.albedoTexture = diff;
      const bump = new B.Texture('./assets/benchmark/textures/aerial_grass_rock/nor_gl.jpg', scene);
      bump.uScale = bump.vScale = 4.0;
      m.bumpTexture = bump;
      m.bumpTexture.level = 0.85;
    }
    return m;
  });

  const waterfallMat = getOrCreateMat(scene, 'euHorizonWaterfallMat', () => {
    const m = new B.StandardMaterial('euHorizonWaterfallMat', scene);
    m.emissiveColor = c3('#e4f3fc');
    m.diffuseColor = c3('#ffffff');
    m.disableLighting = true;
    m.backFaceCulling = false;
    m.depthWrite = false;
    if (!isNull) {
      const wfTex = new B.DynamicTexture('euWaterfallGradTex', { width: 64, height: 128 }, scene, false);
      const wCtx = wfTex.getContext();
      const g = wCtx.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0.0, 'rgba(255,255,255,0.88)');
      g.addColorStop(0.55, 'rgba(225,244,255,0.62)');
      g.addColorStop(1.0, 'rgba(220,240,255,0.0)');
      wCtx.fillStyle = g;
      wCtx.fillRect(0, 0, 64, 128);
      wfTex.update();
      wfTex.hasAlpha = true;
      m.diffuseTexture = wfTex;
      m.opacityTexture = wfTex;
    } else {
      m.alpha = 0.65;
    }
    return m;
  });

  const warmWin = getOrCreateMat(scene, 'euWarmWindowMat', () => {
    const m = new B.StandardMaterial('euWarmWindowMat', scene);
    m.emissiveColor = c3('#ffd27d');
    m.diffuseColor = c3('#ffe8b6');
    m.disableLighting = true;
    return m;
  });

  return { chalk, limestone, timber, slateRoof, terracotta, iron, grass, waterfallMat, warmWin };
}

function mergeGroup(meshes, name, parent, material, shadowGen = null) {
  if (!meshes.length) return null;
  for (const m of meshes) m.computeWorldMatrix(true);
  const merged = BABYLON.Mesh.MergeMeshes(meshes, true, true, undefined, false, false);
  if (!merged) return null;
  merged.name = name;
  merged.parent = parent;
  merged.material = material;
  merged.receiveShadows = true;
  merged.isPickable = false;
  if (shadowGen) shadowGen.addShadowCaster(merged, false);
  return merged;
}

export function applyDoverChalkCliffs(builtSat, scene) {
  const pal = getEuropePalette(scene);
  if (builtSat?.island?.rock) builtSat.island.rock.material = pal.chalk;
  if (builtSat?.node) {
    for (const m of builtSat.node.getChildMeshes()) {
      if (m.name.includes('satelliteRoots_')) m.material = pal.chalk;
    }
  }
}

/**
 * Helper: Creates a pitched gable roof prism (much more European than a cone!).
 */
function addGableRoof(arr, scene, name, width, height, depth, x, y, z, ry = 0) {
  const B = BABYLON, halfSpan = depth / 2;
  const pitch = Math.atan2(height, halfSpan);
  for (const side of [-1, 1]) {
    const slope = B.MeshBuilder.CreateBox(name + side, {
      width, height: .18, depth: Math.hypot(height, halfSpan) + .08,
    }, scene);
    const offset = side * halfSpan * .5;
    slope.position.set(x + Math.sin(ry)*offset, y + height*.5, z + Math.cos(ry)*offset);
    slope.rotationQuaternion = B.Quaternion.RotationYawPitchRoll(ry, side*pitch, 0);
    arr.push(slope);
  }
  // Close both gables underneath the ridge so the loft reads solid at eye level.
  for (const side of [-1, 1]) {
    const end = new B.Mesh(name + 'Gable' + side, scene);
    const vd = new B.VertexData();
    const ex = side * (width*.5 - .14);
    vd.positions = [ex,0,-halfSpan, ex,height,0, ex,0,halfSpan];
    vd.indices = side > 0 ? [2,1,0] : [0,1,2];
    vd.normals = [side,0,0,side,0,0,side,0,0];
    vd.uvs = [0,0,.5,1,1,0];
    vd.applyToMesh(end);
    end.position.set(x,y,z); end.rotation.y = ry;
    arr.push(end);
  }
}

/**
 * 1. British Coasts: White Cliffs of Dover village, gothic abbey church, half-timbered cottages & lathed coastal lighthouse!
 */
export function buildDoverCliffVillage(scene, parent, island, rx = 24, rz = 19) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euDoverVillage', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], timber = [], slate = [], red = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Sculpted Lathed British Coastal Lighthouse (Babylon.js CreateLathe!)
  const lx = rx * 0.54, lz = -rz * 0.24, ly = hAt(lx, lz);
  const lhProfile = [
    new B.Vector3(2.2, 0, 0), new B.Vector3(1.9, 2.0, 0), new B.Vector3(1.5, 6.5, 0),
    new B.Vector3(1.25, 10.2, 0), new B.Vector3(1.65, 10.6, 0), new B.Vector3(1.65, 11.2, 0),
    new B.Vector3(1.1, 11.2, 0),
  ];
  const lhBody = B.MeshBuilder.CreateLathe('dvLhLathe', { shape: lhProfile, tessellation: 14 }, scene);
  put(stone, lhBody, lx, ly - 0.3, lz);
  put(red, B.MeshBuilder.CreateCylinder('dvLhBand', { diameterTop: 2.7, diameterBottom: 3.1, height: 3.2, tessellation: 14 }, scene), lx, ly + 6.4, lz);
  put(glow, B.MeshBuilder.CreateCylinder('dvLhLamp', { diameter: 1.85, height: 1.7, tessellation: 12 }, scene), lx, ly + 11.9, lz);
  put(red, B.MeshBuilder.CreateCylinder('dvLhDome', { diameterTop: 0.25, diameterBottom: 2.6, height: 1.9, tessellation: 12 }, scene), lx, ly + 13.5, lz);

  // English Stone Parish Church with pitched gable roof, buttresses & twin spires
  const cx = -3, cz = -2, cy = hAt(cx, cz);
  put(stone, B.MeshBuilder.CreateBox('dvChurchNave', { width: 9.8, height: 5.8, depth: 5.4 }, scene), cx, cy + 2.6, cz);
  addGableRoof(slate, scene, 'dvChurchGable', 10.4, 3.2, 5.8, cx, cy + 5.6, cz, 0);
  for (const tz of [-1.9, 1.9]) {
    put(stone, B.MeshBuilder.CreateBox(`dvTower_${tz}`, { width: 2.8, height: 11.2, depth: 2.8 }, scene), cx - 4.6, cy + 5.2, cz + tz);
    put(slate, B.MeshBuilder.CreateCylinder(`dvSpire_${tz}`, { diameterTop: 0.2, diameterBottom: 3.1, height: 4.8, tessellation: 4 }, scene), cx - 4.6, cy + 13.0, cz + tz, 0, Math.PI * 0.25);
  }

  // Half-timbered English cottages with pitched terracotta/slate gable roofs & stone chimneys
  const cottages = [
    { x: 4.5, z: 5.5, ry: 0.3, redRoof: true },
    { x: -7.5, z: 6.2, ry: -0.4, redRoof: false },
    { x: 1.5, z: -8.0, ry: 0.8, redRoof: true },
    { x: -10.0, z: -6.5, ry: 0.1, redRoof: false },
  ];
  const joinery=[], windowGlass=[], brick=[];
  function cottageFinish(name, hex, roughness) {
    return getOrCreateMat(scene,name,()=>{
      const mat=new B.PBRMaterial(name,scene);
      mat.albedoColor=c3(hex).toLinearSpace();mat.metallic=0;mat.roughness=roughness;
      return mat;
    });
  }
  const oak=cottageFinish('dvOiledOak','#694634',.84);
  const glazing=cottageFinish('dvOldGlazing','#789590',.29);
  const firedBrick=cottageFinish('dvFiredBrick','#a15d40',.91);
  if (!(scene.getEngine() instanceof B.NullEngine) && !firedBrick.albedoTexture) {
    const clay=new B.DynamicTexture('dvFlemishBond',{width:256,height:256},scene,true);
    const ctx=clay.getContext();ctx.fillStyle='#95877a';ctx.fillRect(0,0,256,256);
    for(let r=0;r<16;r++) for(let c=-1;c<8;c++) {
      const x=c*32+(r%2)*16, shade=(r*37+((c+8)%8)*29+r*r*7)%34;
      ctx.fillStyle=`rgb(${137+shade},${76+shade},${55+shade})`;
      ctx.fillRect(x,r*16+1,30,14);
      ctx.fillStyle='rgba(220,180,130,.26)';ctx.fillRect(x+1,r*16+2,28,1);
    }
    clay.update();firedBrick.albedoColor.set(.94,.85,.77);firedBrick.albedoTexture=clay;
    const glassTex=new B.DynamicTexture('dvWindowSky',{width:64,height:128},scene,true);
    const gc=glassTex.getContext(),gradient=gc.createLinearGradient(0,0,20,128);
    gradient.addColorStop(0,'#c0c5ac');gradient.addColorStop(.46,'#8eacb1');gradient.addColorStop(.63,'#596e70');gradient.addColorStop(1,'#3e4340');
    gc.fillStyle=gradient;gc.fillRect(0,0,64,128);glassTex.update();
    glazing.albedoColor.set(.78,.88,.88);glazing.albedoTexture=glassTex;
  }
  cottages.forEach((c, idx) => {
    // Sample each rotated footprint. The uphill wall stays clear of the turf,
    // and the foundation extends below the downhill corner.
    const grade=[];
    for (const dx of [-2.5,0,2.5]) for(const dz of [-2,0,2]) {
      grade.push(hAt(c.x+Math.cos(c.ry)*dx+Math.sin(c.ry)*dz,c.z-Math.sin(c.ry)*dx+Math.cos(c.ry)*dz));
    }
    const y=Math.max(...grade)+.08;
    const footing=y-Math.min(...grade)+.68;
    put(timber, B.MeshBuilder.CreateBox(`dvCot_${idx}`, { width: 5.0, height: 3.2, depth: 3.8 }, scene), c.x, y + 1.4, c.z, 0, c.ry);
    addGableRoof(c.redRoof ? red : slate, scene, `dvCotR_${idx}`, 5.5, 2.2, 4.2, c.x, y + 3.0, c.z, c.ry);
    const roofSide = c.redRoof ? red : slate;
    const detail = (arr, tag, width, height, depth, dx, dy, dz) => {
      const px = c.x + Math.cos(c.ry)*dx + Math.sin(c.ry)*dz;
      const pz = c.z - Math.sin(c.ry)*dx + Math.cos(c.ry)*dz;
      put(arr, B.MeshBuilder.CreateBox(tag + idx, {width,height,depth}, scene), px,y+dy,pz,0,c.ry);
    };
    detail(brick,'dvFoundation',5.15,footing,3.95,0,.38-footing*.5,0);
    detail(joinery,'dvPlankDoor',.94,1.92,.14,-1.10,1.09,1.94);
    detail(windowGlass,'dvDoorLight',.51,.47,.05,-1.10,1.67,2.03);
    // Projecting frames, sill and shaded glass give the walls depth at street level.
    for(const side of [-1,1]) {
      const centers=side>0?[.96]:[-1.25,1.25];
      for(const wx of centers) {
        const z=side*1.94;
        detail(joinery,'dvWindowCase',1.2,1.32,.14,wx,1.75,z);
        detail(windowGlass,'dvWindowPane',1.01,1.12,.06,wx,1.75,z+side*.095);
        detail(joinery,'dvWindowStile',.068,1.13,.06,wx,1.75,z+side*.15);
        detail(joinery,'dvWindowBar',1.02,.075,.055,wx,1.87,z+side*.18);
        detail(joinery,'dvWindowSill',1.36,.13,.31,wx,1.06,z+side*.07);
      }
    }
    for(const end of [-1,1]) {
      detail(joinery,'dvGableBeam',.18,.16,3.84,end*2.46,2.89,0);
      detail(joinery,'dvAtticFrame',.2,.82,.72,end*2.60,3.65,0);
      detail(windowGlass,'dvAtticPane',.08,.62,.53,end*2.72,3.65,0);
    }
    detail(brick,'dvDoorstep',1.45,.24,.65,-1.1,.14,2.12);
    const approachHeight=hAt(c.x-Math.cos(c.ry)*1.1+Math.sin(c.ry)*3.2,c.z+Math.sin(c.ry)*1.1+Math.cos(c.ry)*3.2);
    const steps=Math.min(18,Math.ceil(Math.max(0,y-approachHeight)/.24));
    for(let step=0;step<steps;step++){
      const top=.04-(step+1)*.23, height=Math.max(.24,footing+top);
      detail(brick,'dvPorchTread'+step,1.45,height,.32,-1.1,top-height*.5,2.59+step*.31);
    }
    detail(roofSide,'dvDoorCanopy',1.72,.16,.82,-1.1,2.22,2.14);
    for (const dx of [-1.78,-.42]) detail(joinery,'dvPorchPost'+dx,.12,2,.12,dx,1.14,2.43);
    detail(brick,'dvChimney',.64,2.72,.68,1.40,4.13,.57);
    detail(brick,'dvChimneyCrown',.82,.23,.86,1.40,5.53,.57);
    detail(joinery,'dvFlue',.43,.045,.47,1.40,5.66,.57);
  });

  mergeGroup(joinery,'euVillageOak',root,oak);
  mergeGroup(windowGlass,'euVillageWindows',root,glazing);
  mergeGroup(brick,'euVillageBrickwork',root,firedBrick);
  mergeGroup(stone, 'euDoverStone', root, pal.limestone, null);
  mergeGroup(timber, 'euDoverTimber', root, pal.timber, null);
  mergeGroup(slate, 'euDoverSlate', root, pal.slateRoof, null);
  mergeGroup(red, 'euDoverRed', root, pal.terracotta, null);
  mergeGroup(glow, 'euDoverGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 2. Continental Sky-City: Parisian Eiffel-inspired curved lattice spire, textured Haussmann blocks & arched viaduct!
 */
export function buildContinentalSkyCity(scene, parent, island, rx = 22, rz = 18) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euContinentalCity', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], slate = [], iron = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Iconic 40m Parisian Curved Lattice Iron Spire (4 sweeping arched legs + 2 observation decks)
  const sx = 0, sz = 0, sy = hAt(sx, sz);
  for (const [lx, lz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
    const path = [
      new B.Vector3(sx + lx * 4.4, sy - 0.5, sz + lz * 4.4),
      new B.Vector3(sx + lx * 2.4, sy + 9.0, sz + lz * 2.4),
      new B.Vector3(sx + lx * 1.1, sy + 20.0, sz + lz * 1.1),
      new B.Vector3(sx + lx * 0.3, sy + 36.0, sz + lz * 0.3),
    ];
    iron.push(B.MeshBuilder.CreateTube(`euSpireCurve_${lx}_${lz}`, { path, radius: 0.48, tessellation: 6 }, scene));
  }
  put(iron, B.MeshBuilder.CreateBox('euSpireDeck1', { width: 6.4, height: 1.0, depth: 6.4 }, scene), sx, sy + 11.5, sz);
  put(iron, B.MeshBuilder.CreateBox('euSpireDeck2', { width: 3.6, height: 0.9, depth: 3.6 }, scene), sx, sy + 22.5, sz);
  put(iron, B.MeshBuilder.CreateCylinder('euSpireNeedle', { diameterTop: 0.14, diameterBottom: 0.85, height: 8.5, tessellation: 8 }, scene), sx, sy + 39.5, sz);
  put(glow, B.MeshBuilder.CreateSphere('euSpireBeacon', { diameter: 1.4, segments: 8 }, scene), sx, sy + 44.0, sz);

  // Textured Haussmann Parisian boulevard blocks with mansard roofs & domes
  const blocks = [
    { x: -9.5, z: -4.5, w: 7.8, h: 6.8, d: 5.4, ry: 0.2 },
    { x:  9.0, z: -5.0, w: 7.2, h: 6.0, d: 5.2, ry: -0.25 },
    { x: -8.0, z:  6.5, w: 7.5, h: 5.8, d: 5.0, ry: -0.15 },
    { x:  8.5, z:  5.8, w: 6.8, h: 6.4, d: 4.8, ry: 0.3 },
  ];
  blocks.forEach((b, idx) => {
    const y = hAt(b.x, b.z);
    put(stone, B.MeshBuilder.CreateBox(`euHaus_${idx}`, { width: b.w, height: b.h, depth: b.d }, scene), b.x, y + b.h * 0.5 - 0.3, b.z, 0, b.ry);
    const cornice=B.MeshBuilder.CreateBox('euHausCornice',{width:b.w+.32,height:.24,depth:b.d+.32},scene);
    put(stone,cornice,b.x,y+b.h-.27,b.z,0,b.ry);
    const roof=B.MeshBuilder.CreateCylinder('euMansard',{diameterTop:1.04,diameterBottom:Math.SQRT2,height:2.15,tessellation:4},scene);
    roof.bakeTransformIntoVertices(B.Matrix.RotationY(Math.PI/4));
    roof.scaling.set(b.w+.38,1,b.d+.38);
    put(slate,roof,b.x,y+b.h+.88,b.z,0,b.ry);
  });

  // Stone Multi-Arch Railway Viaduct jutting off the island flank
  const vy = hAt(rx * 0.6, 0);
  put(stone, B.MeshBuilder.CreateBox('euViaductDeck', { width: 18.0, height: 1.3, depth: 3.6 }, scene), rx * 0.94, vy + 3.0, 0);
  for (const px of [-6, 0, 6]) {
    put(stone, B.MeshBuilder.CreateBox(`euViaductPier_${px}`, { width: 1.6, height: 8.5, depth: 3.2 }, scene), rx * 0.94 + px, vy - 1.5, 0);
  }
  for (const ax of [-3, 3]) {
    put(stone, B.MeshBuilder.CreateTorus(`euViaductArch_${ax}`, { diameter: 4.8, thickness: 1.0, tessellation: 14 }, scene), rx * 0.94 + ax, vy + 0.6, 0, Math.PI * 0.5, 0, 0);
  }

  mergeGroup(stone, 'euCityStone', root, pal.limestone, null);
  mergeGroup(slate, 'euCitySlate', root, pal.slateRoof, null);
  mergeGroup(iron, 'euCityIron', root, pal.iron, null);
  mergeGroup(glow, 'euCityGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 3. Alpine Highlands: Textured European Schloss Castle overlooking the Forest Island waterfall!
 */
export function buildAlpineCastleDiorama(scene, parent, pos, shadowGen = null) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euAlpineCastle', scene);
  root.parent = parent;
  root.position.copyFrom(pos);

  const stone = [], timber = [], slate = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  // Main textured Alpine Schloss keep with pitched gable roof & timber courtyard wing
  put(stone, B.MeshBuilder.CreateBox('euCastKeep', { width: 14.5, height: 11.8, depth: 9.8 }, scene), 0, 5.6, 0);
  addGableRoof(slate, scene, 'euCastKeepGable', 15.2, 5.2, 10.6, 0, 11.6, 0, 0);
  put(timber, B.MeshBuilder.CreateBox('euCastWing', { width: 10.8, height: 7.6, depth: 6.6 }, scene), -10.8, 3.3, 2.0);
  addGableRoof(slate, scene, 'euCastWingGable', 11.4, 3.6, 7.2, -10.8, 7.2, 2.0, 0);

  // Cylindrical corner turrets with lathed conical slate spires
  const towers = [
    { x:  7.4, z:  4.8, h: 16.8, d: 4.4 },
    { x:  7.4, z: -4.8, h: 13.8, d: 3.8 },
    { x: -6.8, z: -4.8, h: 19.0, d: 4.6 },
    { x: -15.4, z: 4.6, h: 12.2, d: 3.6 },
  ];
  towers.forEach((t, i) => {
    put(stone, B.MeshBuilder.CreateCylinder(`euCastTow_${i}`, { diameterTop: t.d * 0.94, diameterBottom: t.d, height: t.h, tessellation: 14 }, scene), t.x, t.h * 0.5, t.z);
    put(slate, B.MeshBuilder.CreateCylinder(`euCastSpire_${i}`, { diameterTop: 0.22, diameterBottom: t.d * 1.24, height: 6.4, tessellation: 14 }, scene), t.x, t.h + 3.0, t.z);
  });

  mergeGroup(stone, 'euCastleStone', root, pal.limestone, shadowGen);
  mergeGroup(timber, 'euCastleTimber', root, pal.timber, shadowGen);
  mergeGroup(slate, 'euCastleSlate', root, pal.slateRoof, shadowGen);
  mergeGroup(glow, 'euCastleGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 4. Old-World Gothic Abbey Ruins (weathered textured masonry arches & ruined cathedral bell tower).
 */
export function buildGothicRuinsDiorama(scene, parent, island) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const root = new B.TransformNode('euGothicRuins', scene);
  root.parent = parent;
  const hAt = (x, z) => (typeof island?.getHeight === 'function' ? island.getHeight(x, z) : 1.6);

  const stone = [], slate = [], glow = [];
  const put = (arr, m, x, y, z, rx0 = 0, ry0 = 0, rz0 = 0) => { m.position.set(x, y, z); m.rotation.set(rx0, ry0, rz0); arr.push(m); };

  const cy = hAt(0, 0);
  // Textured Gothic nave buttresses & sweeping pointed arch ribs
  for (let i = -2; i <= 2; i++) {
    const px = i * 5.2;
    const h = i === 0 ? 11.8 : 9.4 - Math.abs(i) * 1.0;
    put(stone, B.MeshBuilder.CreateBox(`euGothL_${i}`, { width: 1.8, height: h, depth: 2.0 }, scene), px, cy + h * 0.5, -5.4);
    put(stone, B.MeshBuilder.CreateBox(`euGothR_${i}`, { width: 1.8, height: h * 0.86, depth: 2.0 }, scene), px, cy + h * 0.42, 5.4);
    if (i > -2 && i < 2) {
      const archPath = [
        new B.Vector3(px, cy + h * 0.72, -5.0),
        new B.Vector3(px, cy + h * 1.05, 0),
        new B.Vector3(px, cy + h * 0.72, 5.0),
      ];
      stone.push(B.MeshBuilder.CreateTube(`euGothArch_${i}`, { path: archPath, radius: 0.55, tessellation: 6 }, scene));
    }
  }
  put(stone, B.MeshBuilder.CreateBox('euGothTower', { width: 5.8, height: 15.8, depth: 5.8 }, scene), -13.5, cy + 7.6, 0);
  put(slate, B.MeshBuilder.CreateCylinder('euGothCap', { diameterTop: 0.8, diameterBottom: 6.4, height: 4.5, tessellation: 4 }, scene), -13.5, cy + 17.5, 0, 0, Math.PI * 0.25);
  put(glow, B.MeshBuilder.CreateSphere('euGothBrazier', { diameter: 1.5, segments: 8 }, scene), 0, cy + 2.6, 0);

  mergeGroup(stone, 'euGothicStone', root, pal.limestone, null);
  mergeGroup(slate, 'euGothicSlate', root, pal.slateRoof, null);
  mergeGroup(glow, 'euGothicGlow', root, pal.warmWin, null);
  return root;
}

/**
 * 5. Sunlit 360° Horizon of Organic European Sky-Islands:
 *    Multi-mass craggy chalk cliffs + real textured green meadows + textured European towns/castles/spires
 *    + cascading white cliff waterfalls plunging into the clouds (5 merged draw calls total!).
 */
export function buildEuropeHorizonArchipelago(scene, sculptCraggyRock) {
  const B = BABYLON;
  const pal = getEuropePalette(scene);
  const chalkParts = [], meadowParts = [], cityParts = [], roofParts = [], waterfallParts = [];
  const put = (arr, m, px, py, pz, rx = 0, ry = 0, rz = 0) => {
    m.position.set(px, py, pz); m.rotation.set(rx, ry, rz); m.computeWorldMatrix(true); arr.push(m);
  };

  const islands = [
    [0.32,  920, 26, 'paris',   1.35],
    [1.08,  980, 38, 'dover',   1.40],
    [1.85,  880, 18, 'alpine',  1.30],
    [2.65, 1020, 34, 'viaduct', 1.45],
    [3.42,  910, 22, 'dover',   1.35],
    [4.18,  960, 32, 'paris',   1.42],
    [4.95,  870, 24, 'alpine',  1.30],
    [5.68,  950, 20, 'viaduct', 1.38],
    [0.70, 1420, 58, 'paris',   1.85],
    [2.25, 1520, 48, 'alpine',  1.90],
    [3.80, 1460, 52, 'dover',   1.85],
    [5.30, 1480, 44, 'viaduct', 1.80],
  ];

  islands.forEach(([ang, dist, y, kind, s], idx) => {
    const cx = Math.cos(ang) * dist;
    const cz = Math.sin(ang) * dist;
    const face = ang + Math.PI * 0.5;
    const ux = Math.cos(face), uz = Math.sin(face);
    const nx = -Math.cos(ang), nz = -Math.sin(ang); // inward toward center

    // 5-part organic multi-root sculpted cliff cluster (never a single geometric cone!)
    const core = B.MeshBuilder.CreateCylinder(`euHCliff_${idx}`, { diameterTop: 94 * s, diameterBottom: 26 * s, height: 66 * s, tessellation: 10, subdivisions: 3 }, scene);
    if (sculptCraggyRock) sculptCraggyRock(core, 91 + idx * 17.3, 0.34);
    put(chalkParts, core, cx, y - 28 * s, cz, 0, ang);
    for (const [ox, oz, dTop, h, seedOff] of [
      [-32, -8, 52, 62, 11], [34, 6, 48, 56, 23], [-12, 26, 42, 52, 37], [16, -24, 40, 48, 53],
    ]) {
      const sh = B.MeshBuilder.CreateCylinder(`euHSh_${idx}_${seedOff}`, { diameterTop: dTop * s, diameterBottom: 7 * s, height: h * s, tessellation: 8, subdivisions: 2 }, scene);
      if (sculptCraggyRock) sculptCraggyRock(sh, 131 + idx * 13 + seedOff, 0.36);
      put(chalkParts, sh, cx + (ux * ox + nx * oz) * s, y - (28 + (seedOff % 9)) * s, cz + (uz * ox + nz * oz) * s, 0, ang + seedOff * 0.2);
    }

    // Textured lush green European meadow cap
    const cap = B.MeshBuilder.CreateCylinder(`euHCap_${idx}`, { diameterTop: 90 * s, diameterBottom: 96 * s, height: 6 * s, tessellation: 10 }, scene);
    put(meadowParts, cap, cx, y + 6 * s, cz, 0, ang);

    // Cascading white cliff waterfall plunging from the island edge into the cloud sea (artbook signature!)
    if (idx % 2 === 0) {
      const wf = B.MeshBuilder.CreateBox(`euHWaterfall_${idx}`, { width: 10 * s, height: 85 * s, depth: 2.2 * s }, scene);
      put(waterfallParts, wf, cx + nx * 44 * s, y - 36 * s, cz + nz * 44 * s, 0, ang + Math.PI * 0.5);
    }

    if (kind === 'paris') {
      put(cityParts, B.MeshBuilder.CreateBox(`euHCit1_${idx}`, { width: 34 * s, height: 14 * s, depth: 22 * s }, scene), cx, y + 14 * s, cz, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHSpire_${idx}`, { diameterTop: 1.6 * s, diameterBottom: 14 * s, height: 58 * s, tessellation: 4 }, scene), cx, y + 42 * s, cz, 0, ang + Math.PI * 0.25);
      put(cityParts, B.MeshBuilder.CreateBox(`euHCit2_${idx}`, { width: 20 * s, height: 18 * s, depth: 16 * s }, scene), cx - ux * 24 * s, y + 16 * s, cz - uz * 24 * s, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHDome_${idx}`, { diameterTop: 4 * s, diameterBottom: 18 * s, height: 10 * s, tessellation: 8 }, scene), cx - ux * 24 * s, y + 29 * s, cz - uz * 24 * s);
    } else if (kind === 'dover') {
      put(cityParts, B.MeshBuilder.CreateCylinder(`euHLh_${idx}`, { diameterTop: 3.5 * s, diameterBottom: 6.5 * s, height: 28 * s, tessellation: 10 }, scene), cx + ux * 28 * s, y + 22 * s, cz + uz * 28 * s);
      put(cityParts, B.MeshBuilder.CreateBox(`euHManor_${idx}`, { width: 26 * s, height: 12 * s, depth: 16 * s }, scene), cx - ux * 12 * s, y + 14 * s, cz - uz * 12 * s, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHManorR_${idx}`, { diameterTop: 2 * s, diameterBottom: 24 * s, height: 10 * s, tessellation: 4 }, scene), cx - ux * 12 * s, y + 24 * s, cz - uz * 12 * s, 0, ang + Math.PI * 0.25);
    } else if (kind === 'alpine') {
      put(cityParts, B.MeshBuilder.CreateBox(`euHKeep_${idx}`, { width: 24 * s, height: 22 * s, depth: 16 * s }, scene), cx, y + 18 * s, cz, 0, ang);
      put(roofParts, B.MeshBuilder.CreateCylinder(`euHKeepR_${idx}`, { diameterTop: 2 * s, diameterBottom: 22 * s, height: 11 * s, tessellation: 4 }, scene), cx, y + 34 * s, cz, 0, ang + Math.PI * 0.25);
      for (const side of [-1, 1]) {
        put(cityParts, B.MeshBuilder.CreateCylinder(`euHTow_${idx}_${side}`, { diameterTop: 6.5 * s, diameterBottom: 8 * s, height: 32 * s, tessellation: 10 }, scene), cx + ux * side * 15 * s, y + 24 * s, cz + uz * side * 15 * s);
        put(roofParts, B.MeshBuilder.CreateCylinder(`euHCon_${idx}_${side}`, { diameterTop: 0.8 * s, diameterBottom: 9.5 * s, height: 16 * s, tessellation: 10 }, scene), cx + ux * side * 15 * s, y + 48 * s, cz + uz * side * 15 * s);
      }
    } else {
      const cliff2 = B.MeshBuilder.CreateCylinder(`euHCliffB_${idx}`, { diameterTop: 56 * s, diameterBottom: 10 * s, height: 64 * s, tessellation: 9, subdivisions: 2 }, scene);
      if (sculptCraggyRock) sculptCraggyRock(cliff2, 203 + idx * 11, 0.34);
      put(chalkParts, cliff2, cx + ux * 70 * s, y - 28 * s, cz + uz * 70 * s, 0, ang);
      put(meadowParts, B.MeshBuilder.CreateCylinder(`euHCapB_${idx}`, { diameterTop: 52 * s, diameterBottom: 56 * s, height: 6 * s, tessellation: 9 }, scene), cx + ux * 70 * s, y + 5 * s, cz + uz * 70 * s);
      put(cityParts, B.MeshBuilder.CreateBox(`euHBridge_${idx}`, { width: 74 * s, height: 7 * s, depth: 8 * s }, scene), cx + ux * 35 * s, y + 11 * s, cz + uz * 35 * s, 0, face);
    }
  });

  const finalize = (arr, name, mat) => {
    if (!arr.length) return;
    const m = B.Mesh.MergeMeshes(arr, true, true, undefined, false, false);
    if (m) {
      m.name = name;
      m.material = mat;
      m.isPickable = false;
      m.checkCollisions = false;
      m.receiveShadows = false;
      m.freezeWorldMatrix();
    }
  };
  finalize(chalkParts, 'horizonEuropeChalkCliffs', pal.chalk);
  finalize(meadowParts, 'horizonEuropeMeadows', pal.grass);
  finalize(cityParts, 'horizonEuropeCities', pal.limestone);
  finalize(roofParts, 'horizonEuropeSpires', pal.slateRoof);
  finalize(waterfallParts, 'horizonEuropeWaterfalls', pal.waterfallMat);
}
