import { fieldRepairTexture } from './repairTexture.js';
const PROFILES = {
  cargo: { color: '#baa27b', spinner: [[.38,.14],[.41,-.10],[.34,-.26],[.21,-.40],[.045,-.48]] },
  fighter: { color: '#a34232', spinner: [[.43,.14],[.46,-.06],[.40,-.25],[.29,-.45],[.135,-.61],[.024,-.66]] },
  attacker: { color: '#596048', spinner: [[.36,.14],[.41,-.06],[.42,-.27],[.31,-.45],[.055,-.54]] },
  bomber: { color: '#8e9691', spinner: [[.31,.12],[.37,-.06],[.34,-.20],[.20,-.35],[.035,-.47]] },
};

// Fit riveted canopy bows to the actual glass with a cross-section through its triangles.
function canopyBow(glass, z, minimumY) {
  const B = BABYLON, verts = glass.getVerticesData('position'), faces = glass.getIndices();
  const points = new Map();
  for (let i = 0; i < faces.length; i += 3) {
    for (let k = 0; k < 3; k++) {
      const a = faces[i + k] * 3, b = faces[i + (k + 1) % 3] * 3;
      if ((verts[a + 2] > z) === (verts[b + 2] > z)) continue;
      const t = (z - verts[a + 2]) / (verts[b + 2] - verts[a + 2]);
      const x = verts[a] + (verts[b] - verts[a]) * t;
      const y = verts[a + 1] + (verts[b + 1] - verts[a + 1]) * t;
      if (y > minimumY) points.set(`${Math.round(x * 500)}_${Math.round(y * 500)}`, new B.Vector3(x * 1.013, y + .012, z));
    }
  }
  return [...points.values()].sort((a, b) =>
    Math.atan2(a.y - minimumY, a.x) - Math.atan2(b.y - minimumY, b.x));
}

function finishMaterial(scene, variant, color) {
  const B = BABYLON, name = `interbellumAirframeTrim_${variant}`;
  const existing = scene.getMaterialByName(name);
  if (existing) return existing;
  const mat = new B.PBRMaterial(name, scene);
  mat.albedoColor = B.Color3.FromHexString(color).toLinearSpace();
  mat.metallic = .33;
  mat.roughness = .49;
  return mat;
}

function slimFighter(meshes) {
  const airframe = meshes.find(mesh => mesh.name === 'airframe');
  if (!airframe) return;
  const positions = airframe.getVerticesData('position');
  const uv = airframe.getVerticesData('uv');
  const indices = airframe.getIndices();
  if (!positions || !uv || !indices) return;
  // Remove the original external pods. Recessed weapons remain represented by the
  // original wing fixtures, and the simulation still owns their behaviour.
  const isPod = index => {
    const x = Math.abs(positions[index * 3]);
    const y = positions[index * 3 + 1];
    const z = positions[index * 3 + 2];
    return x > 2.28 && x < 3.02 && y < 1.44 && z > -2.07 && z < -0.53 &&
      uv[index * 2 + 1] >= .5;
  };
  const retained = [];
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i], b = indices[i + 1], c = indices[i + 2];
    if (!(isPod(a) && isPod(b) && isPod(c))) retained.push(a, b, c);
  }
  airframe.setIndices(retained);

  // Narrow the heavy landing wheels while preserving the minimum Y and the
  // original animated gear pivots, including the stance on the deck.
  for (const gear of meshes.filter(mesh => /^gear_[LR]$/.test(mesh.name))) {
    const p = gear.getVerticesData('position', true, true);
    if (!p) continue;
    const pivotX = gear.name === 'gear_L' ? .14 : -.14;
    const normals = gear.getVerticesData('normal', true, true);
    for (let i = 0; i < p.length; i += 3) {
      const y = p[i + 1];
      const blend = Math.max(0, Math.min(1, (y - .42) / .55));
      const scale = .70 + .30 * blend * blend * (3 - 2 * blend);
      p[i] = pivotX + (p[i] - pivotX) * scale;
      p[i + 2] *= scale;
      if (normals) {
        const nx = normals[i] / scale, ny = normals[i + 1], nz = normals[i + 2] / scale;
        const length = Math.hypot(nx, ny, nz) || 1;
        normals[i] = nx / length;
        normals[i + 1] = ny / length;
        normals[i + 2] = nz / length;
      }
    }
    gear.setVerticesData('position', p);
    if (normals) gear.setVerticesData('normal', normals);
    gear.refreshBoundingInfo();
  }
}

// Staggered upper wing of the two-seat attack biplane, in airframe coordinates.
function fitUpperWing(frame, scene, material) {
  const B = BABYLON;
  const positions = [], indices = [], normals = [], parts = [];
  const sections = [-5.75,-5.62,-5.25,-4.3,-3.2,-2.1,-1,0,1,2.1,3.2,4.3,5.25,5.62,5.75];
  const samples = 24;
  const linenIndices=[], fabricUvs=[];
  for (const [row,x] of sections.entries()) {
    const span = Math.abs(x) / 5.75;
    const chord = 2.04 * Math.sqrt(Math.max(.012,1 - span ** 6));
    for (let j=0;j<samples;j++) {
      const angle = 2*Math.PI*j/samples;
      const u = (1-Math.cos(angle))*.5;
      const z = -2.72 + .64*span*span + (u-.28)*chord;
      const y = 3.63 + .11*span + chord*(.034*Math.sin(Math.PI*u) + .075*Math.sin(angle)*(1-.55*u));
      positions.push(x,y,z);
      // The replacement fabric spans one full rib bay and wraps both wing surfaces.
      fabricUvs.push(.035+.42*Math.max(0,Math.min(1,(x+5.25)/.95)),.038+.42*u);
      if (row) {
        const a=(row-1)*samples+j, b=(row-1)*samples+(j+1)%samples;
        const surface = row===3 ? linenIndices : indices;
        surface.push(a,b,a+samples,b,b+samples,a+samples);
      }
    }
  }
  for (let j=1;j<samples-1;j++) {
    const end=(sections.length-1)*samples;
    indices.push(0,j+1,j,end,end+j,end+j+1);
  }
  B.VertexData.ComputeNormals(positions,[...indices,...linenIndices],normals);
  // Babylon's winding convention depends on the ordering of the foil perimeter.
  if (normals[samples*7*3+6*3+1]<0) {
    for(let i=0;i<indices.length;i+=3) [indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
    for(let i=0;i<linenIndices.length;i+=3) [linenIndices[i+1],linenIndices[i+2]]=[linenIndices[i+2],linenIndices[i+1]];
    B.VertexData.ComputeNormals(positions,[...indices,...linenIndices],normals);
  }
  const linen=new B.Mesh('attackWingLinenBay',scene);
  Object.assign(new B.VertexData(),{positions,indices:linenIndices,normals,uvs:fabricUvs}).applyToMesh(linen);
  let canvas=scene.getMaterialByName('attackReplacementLinen');
  if(!canvas) {
    canvas=new B.PBRMaterial('attackReplacementLinen',scene);
    canvas.albedoTexture=fieldRepairTexture(scene);
    canvas.transparencyMode=B.PBRMaterial.PBRMATERIAL_OPAQUE;
    canvas.metallic=0;canvas.roughness=.96;
  }
  linen.parent=frame;linen.material=canvas;linen.isPickable=false;linen.receiveShadows=true;
  const wing = new B.Mesh('attackUpperWing',scene);
  Object.assign(new B.VertexData(),{positions,indices,normals,uvs:new Array(positions.length/3*2).fill(0)}).applyToMesh(wing);
  parts.push(wing);
  for(const side of [-1,1]) {
    for(const [x,y,z,upperX,upperZ] of [
      [3.68,1.65,-1.49,4.10,-2.84],[3.68,1.65,-1.49,4.10,-1.43],
      [.56,2.53,-1.86,1.12,-2.93],[.56,2.50,-1.04,1.12,-1.60],
    ]) {
      parts.push(B.MeshBuilder.CreateTube('wingStrut',{
        path:[new B.Vector3(side*x,y,z),new B.Vector3(side*upperX,3.68,upperZ)],
        radius:.048,tessellation:8,
      },scene));
    }
  }
  const assembly=B.Mesh.MergeMeshes(parts,true,true);
  assembly.name='attackUpperWingAssembly'; assembly.parent=frame;
  assembly.material=material; assembly.receiveShadows=true;
}

export function fitInterbellumAircraft(meshes, scene, variant, shadowGenerator = null) {
  const B = BABYLON, profile = PROFILES[variant] || PROFILES.cargo;
  const mat = finishMaterial(scene, variant, profile.color);
  if (variant === 'fighter') slimFighter(meshes);
  const frameMesh = meshes.find(m => m.name === 'airframe');
  if (variant === 'attacker' && frameMesh) fitUpperWing(frameMesh, scene, mat);
  for (const propeller of meshes.filter(m => /^propeller_/.test(m.name))) {
    // Revolved metal spinner follows the original animated shaft and blade pivots.
    const shape = [[0,.14], ...profile.spinner, [0,profile.spinner.at(-1)[1]]]
      .reverse().map(([radius, z]) => new B.Vector3(radius, z, 0));
    const spinner = B.MeshBuilder.CreateLathe('aviationSpinner', {shape, tessellation:28}, scene);
    spinner.rotation.x = Math.PI / 2;
    spinner.parent = propeller;
    spinner.material = mat;
    spinner.isPickable = false;
    spinner.receiveShadows = true;
    shadowGenerator?.addShadowCaster(spinner, false);
  }

  const glass = meshes.find(m => m.name === 'cockpit_glass' && m.getTotalVertices() > 0);
  if (!glass) return;
  const { minimum, maximum } = glass.getBoundingInfo().boundingBox;
  const fraction = variant === 'fighter' ? [.32,.73] : [.20,.43,.65,.84];
  const bows = fraction.flatMap(f => {
    const z = minimum.z + f * (maximum.z - minimum.z);
    const path = canopyBow(glass, z, minimum.y + (maximum.y - minimum.y) * .1);
    return path.length > 2 ? [B.MeshBuilder.CreateTube('aviationCanopyBow', {
      path, radius:variant === 'fighter' ? .024 : .031, tessellation:6,
    }, scene)] : [];
  });
  if (!bows.length) return;
  const frame = B.Mesh.MergeMeshes(bows);
  frame.name = 'aviationCanopyFrames';
  frame.parent = glass;
  frame.material = mat;
  frame.isPickable = false;
  frame.receiveShadows = true;
}
