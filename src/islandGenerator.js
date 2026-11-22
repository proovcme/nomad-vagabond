import { fbm3 } from './planet.js?v=mission1';

const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
function seedNumber(value) {
  let n = 2166136261;
  for (const c of String(value ?? 108)) n = Math.imul(n ^ c.charCodeAt(0), 16777619);
  return n >>> 0;
}
function normals(positions, indices) {
  const out = new Array(positions.length).fill(0);
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3, b = indices[i + 1] * 3, c = indices[i + 2] * 3;
    const ux = positions[b] - positions[a], uy = positions[b + 1] - positions[a + 1], uz = positions[b + 2] - positions[a + 2];
    const vx = positions[c] - positions[a], vy = positions[c + 1] - positions[a + 1], vz = positions[c + 2] - positions[a + 2];
    const n = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx];
    for (const at of [a, b, c]) for (let k = 0; k < 3; k++) out[at + k] += n[k];
  }
  for (let i = 0; i < out.length; i += 3) {
    const length = Math.hypot(out[i], out[i + 1], out[i + 2]) || 1;
    for (let k = 0; k < 3; k++) out[i + k] /= length;
  }
  return out;
}

/** Pure seeded geometry, deliberately separate from Babylon and texture loading. */
export function generateIslandGeometry(options = {}) {
  const seed = seedNumber(options.seed);
  const forest = options.style !== 'industrial';
  const rx = Math.max(15, options.radiusX ?? (forest ? 68 : 54));
  const rz = Math.max(15, options.radiusZ ?? (forest ? 57 : 43));
  const topY = options.topY ?? (forest ? 2.6 : 2.35);
  // Deep craggy inverted-mountain keel rather than a shallow pancake bowl.
  const depth = Math.max(16, Math.min(options.depth ?? (forest ? 64 : 56), Math.min(rx, rz) * 1.45));
  const phase = (seed % 10000) / 10000 * TAU;
  const outline = angle => {
    const shear = 0.13 * Math.cos(angle * 2 + phase) - 0.10 * Math.sin(angle * 3 - phase * 0.6);
    const crag = 0.07 * Math.cos(angle * 5 + phase * 1.4) + 0.045 * Math.sin(angle * 7 - phase * 0.8);
    const cleft = -0.07 * Math.pow(Math.max(0, Math.sin(angle * 2 - phase * 1.1)), 3);
    const teeth = 0.016 * Math.cos(angle * 9 + phase * 1.7);
    return Math.max(0.72, 1 + shear + crag + cleft + teeth);
  };
  const radial = (x, z) => {
    const angle = Math.atan2(z / rz, x / rx);
    return Math.hypot(x / rx, z / rz) / outline(angle);
  };
  const noise = (x, z, offset = 0) => fbm3(x, 0.35, z, seed + offset, 3) / 0.875;
  const getHeight = (x, z) => {
    const r = radial(x, z);
    const hills = (noise(x * 0.027 + 7.1, z * 0.027 - 2.6) - 0.5);
    let h;
    if (forest) {
      const ridge = Math.exp(-Math.pow((z + 0.34 * x + 21) / 16, 2)) * smooth(0.0, 0.65, r);
      const tectonicTilt = Math.max(0, (-z - 0.28 * x - 6) / 48) * smooth(0.15, 0.82, r) * 8.5;
      h = topY + hills * 11 + ridge * 5.5 + tectonicTilt + (noise(x * 0.095, z * 0.095, 337) - 0.5) * 1.3;
      const clearing = 1 - smooth(10, 20, Math.hypot(x + 22, z - 16));
      h = h * (1 - clearing) + (topY - 0.5) * clearing;
      const lake = 1 - smooth(6, 19, Math.hypot(x - 10, z + 4));
      h -= lake * 5.5;
      if (z > -4 && z < 53) {
        const riverX = 10 + (z + 4) / 56 * 8 + Math.sin(z * 0.14) * 3.5;
        h -= (1 - smooth(1.8, 6.5, Math.abs(x - riverX))) * 2.7;
      }
    } else {
      const apron = 1 - smooth(0.45, 0.82, r);
      const terrace = Math.round(hills * 3) * 1.4;
      const quarryScarp = Math.max(0, (-x - 0.6 * z - 8) / 36) * smooth(0.42, 0.88, r) * 6.8;
      h = topY + (terrace + quarryScarp) * (1 - apron) + hills * 0.6;
      // Flat building apron and a lower outer loading shelf.
      h = h * (1 - apron) + topY * apron;
    }
    // Crisp cliff rim edge without a saucer lip or rounded dome
    h -= smooth(0.96, 1.025, r) * 0.45;
    return r <= 1.025 ? h : topY - depth;
  };
  const contains = (x, z, margin = 0) => radial(x, z) <= 1 - margin;
  const segments = 112, rings = 30;
  const top = { positions: [0, getHeight(0, 0), 0], indices: [], uvs: [0.5, 0.5], colors: [] };
  for (let ring = 1; ring <= rings; ring++) {
    const fraction = ring / rings;
    for (let i = 0; i < segments; i++) {
      // Smoothly stagger interior rings so triangulation does not draw long radial spokes.
      const angle = i / segments * TAU + Math.sin(ring * 1.7) * (TAU / segments) * 0.28 * (1 - fraction);
      const shape = outline(angle);
      const x = Math.cos(angle) * rx * shape * fraction;
      const z = Math.sin(angle) * rz * shape * fraction;
      top.positions.push(x, getHeight(x, z), z);
      top.uvs.push(x / (rx * 2.4) + 0.5, z / (rz * 2.4) + 0.5);
      const id = 1 + (ring - 1) * segments + i;
      const next = 1 + (ring - 1) * segments + (i + 1) % segments;
      if (ring === 1) top.indices.push(0, next, id);
      else {
        const inner = id - segments, innerNext = next - segments;
        top.indices.push(inner, next, id, inner, innerNext, next);
      }
    }
  }
  top.normals = normals(top.positions, top.indices);
  for (let i = 0; i < top.positions.length; i += 3) {
    const slope = 1 - top.normals[i + 1];
    const edge = smooth(0.72, 1, radial(top.positions[i], top.positions[i + 2]));
    const blend = Math.max(edge, smooth(0.10, 0.40, slope));
    const green = forest ? [0.97, 1.0, 0.90] : [1.0, 0.96, 0.85];
    const stone = [1.0, 0.96, 0.87];
    top.colors.push(...green.map((v, k) => v * (1 - blend) + stone[k] * blend), 1);
  }
  const rock = {positions: [], indices: [], uvs: [], colors: []};
  // Tall sheer upper cliff wall (t=0..0.44) with stepped lower strata and multi-lobed roots
  const profile = forest
    ? [[0,1],[.05,.99],[.17,.97],[.23,.88],[.30,.90],[.47,.85],[.52,.71],[.64,.65],[.79,.42],[.9,.22],[.97,.07],[1,.015]]
    : [[0,1],[.09,.99],[.15,.88],[.22,.89],[.35,.84],[.39,.70],[.52,.72],[.58,.59],[.73,.47],[.85,.28],[.95,.10],[1,.015]];
  for (let layer = 0; layer < profile.length; layer++) {
    const [t, width] = profile[layer];
    for (let i = 0; i < segments; i++) {
      const edgeAt = (1 + (rings - 1) * segments + i) * 3;
      const ex = top.positions[edgeAt], ey = top.positions[edgeAt + 1], ez = top.positions[edgeAt + 2];
      const a = i / segments * TAU;
      const fault3 = Math.cos(a * 3 - phase * 0.8);
      const rib5 = Math.sin(a * 5 + phase);
      const rib8 = Math.cos(a * 8 - phase * 1.3);
      const rib13 = Math.sin(a * 13 + phase * 0.7);
      const cragNoise = fbm3(Math.cos(a) * 2.4 + t * 2.0, t * 2.6, Math.sin(a) * 2.4 - t * 1.6, seed + 91, 3) - 0.5;
      const bedStep = Math.floor((t + fault3 * .045 + rib8 * .018) * 8.0) / 8.0;
      const shelf = Math.sin(bedStep * Math.PI * (forest ? 3.0 : 5.0)) * (forest ? .075 : .11);
      const fractures = Math.pow(Math.max(0, rib13), 3) * .082;
      const stepShelf = (shelf - fractures) * (1 - t);
      const angularCrag = fault3 * 0.15 + rib5 * 0.15 + rib8 * 0.09 + rib13 * 0.04 + cragNoise * 0.22 + stepShelf;
      const cleft = Math.pow(Math.max(0, Math.cos(a * 6 + phase + t * 1.4)), 5);
      const buttress = Math.max(0.38, 1 + (angularCrag - cleft * .31) * Math.sin(Math.pow(t, 0.65) * Math.PI));
      const x = ex * width * buttress - rx * 0.14 * t;
      const z = ez * width * buttress + rz * 0.09 * t;
      const rootLobe = (Math.pow(Math.max(0, fault3), 2) * 0.22 + Math.pow(Math.max(0, rib5), 2) * 0.16) * depth;
      const toothWave = (rib5 * 2.4 + rib8 * 1.8 + cragNoise * 3.8 - rootLobe * Math.pow(t, 0.75)) * Math.sin(t * Math.PI);
      let y = layer === 0 ? ey : topY - depth * Math.pow(t, 0.88) + (ey - topY) * (1 - t) + toothWave;
      if (layer > 0) {
        const prevY = rock.positions[((layer - 1) * segments + i) * 3 + 1];
        y = layer === profile.length - 1 ? topY - depth - 1.2 : Math.min(y, prevY - 0.55);
      }
      rock.positions.push(x, y, z);
      rock.uvs.push(i / segments * 9, t * depth / 9);
      const band = 0.93 + Math.sin(t * 22 + Math.sin(a * 3) * 0.6) * 0.055;
      rock.colors.push(0.96 * band, 0.94 * band, 0.90 * band, 1);
      if (layer) {
        const a0 = (layer - 1) * segments + i, b = layer * segments + i;
        const c = layer * segments + (i + 1) % segments, d = (layer - 1) * segments + (i + 1) % segments;
        rock.indices.push(a0, b, c, a0, c, d);
      }
    }
  }
  const cap = rock.positions.length / 3;
  const finalRing = (profile.length - 1) * segments;
  let minFinalY = topY - depth - 1.2;
  for (let i = 0; i < segments; i++) {
    const prevY = rock.positions[((profile.length - 2) * segments + i) * 3 + 1];
    minFinalY = Math.min(minFinalY, prevY - 0.6);
  }
  for (let i = 0; i < segments; i++) rock.positions[(finalRing + i) * 3 + 1] = minFinalY;
  rock.positions.push(-rx * 0.15, minFinalY - 0.35, rz * 0.10);
  rock.uvs.push(4.5, depth / 9); rock.colors.push(0.84, 0.88, 0.92, 1);
  for (let i = 0; i < segments; i++) rock.indices.push(finalRing + i, cap, finalRing + (i + 1) % segments);
  // Outward winding for a right-handed scene (top uses +Y, cliff faces away).
  for (let i = 0; i < rock.indices.length; i += 3) [rock.indices[i + 1], rock.indices[i + 2]] = [rock.indices[i + 2], rock.indices[i + 1]];
  rock.normals = normals(rock.positions, rock.indices);
  // Keep a crisp geological cliff rim while slightly coupling normals across the seam.
  for (let i = 0; i < segments; i++) {
    const ti = (1 + (rings - 1) * segments + i) * 3, ri = i * 3;
    const shared = [0, 1, 2].map(k => top.normals[ti+k] * .55 + rock.normals[ri+k] * .45);
    const length = Math.hypot(...shared) || 1;
    for (let k = 0; k < 3; k++) top.normals[ti+k] = rock.normals[ri+k] = shared[k] / length;
  }
  // Split only the cylindrical UV seam; its geometric positions/normals stay welded.
  const seamCopies = new Map();
  for (let i = 0; i < rock.indices.length; i += 3) {
    const ids = rock.indices.slice(i, i + 3);
    const us = ids.map(id => rock.uvs[id * 2]);
    if (Math.max(...us) - Math.min(...us) < 4.5) continue;
    ids.forEach((id, k) => {
      if (rock.uvs[id * 2] >= 4.5) return;
      if (!seamCopies.has(id)) {
        const copy = rock.positions.length / 3;
        rock.positions.push(...rock.positions.slice(id * 3, id * 3 + 3));
        rock.normals.push(...rock.normals.slice(id * 3, id * 3 + 3));
        rock.colors.push(...rock.colors.slice(id * 4, id * 4 + 4));
        rock.uvs.push(rock.uvs[id * 2] + 9, rock.uvs[id * 2 + 1]);
        seamCopies.set(id, copy);
      }
      rock.indices[i + k] = seamCopies.get(id);
    });
  }
  // Babylon procedural meshes retain clockwise front faces even in an RH scene.
  // Keep outward physical normals; reverse the mathematical CCW construction once.
  for (const data of [top,rock]) for(let i=0;i<data.indices.length;i+=3)
    [data.indices[i+1],data.indices[i+2]]=[data.indices[i+2],data.indices[i+1]];
  return { top, rock, getHeight, contains, radial, seed, radiusX: rx, radiusZ: rz, topY, depth, style: forest ? 'forest' : 'industrial', segments, rings,
    bounds: {min: [-rx * 1.2, topY - depth, -rz * 1.2], max: [rx * 1.2, topY + 12, rz * 1.2]} };
}

function createMaterial(scene, name, tint) {
  const material = new BABYLON.PBRMaterial(name, scene);
  material.albedoColor = BABYLON.Color3.FromHexString(tint);
  material.metallic = 0;
  material.roughness = 0.95;
  material.backFaceCulling = true;
  return material;
}

async function bakeTerrainTexture(scene, geometry, material) {
  if (typeof document === 'undefined' || scene.getEngine().constructor.name === 'NullEngine') return;
  const paths = [
    './assets/benchmark/textures/aerial_grass_rock/Diffuse.jpg',
    './assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg',
    './assets/benchmark/textures/coast_sand_01/Diffuse.jpg',
  ];
  const images = await Promise.all(paths.map(path => new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image); image.onerror = reject;
    image.src = path;
  })));
  if (scene.isDisposed) return;
  const samples = images.map(image => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d', {willReadFrequently: true}); ctx.drawImage(image, 0, 0, 256, 256);
    return ctx.getImageData(0, 0, 256, 256).data;
  });
  const size = 1024;
  const texture = new BABYLON.DynamicTexture(`generatedTerrainBlend_${geometry.seed}`, {width:size,height:size}, scene, true);
  const ctx = texture.getContext(), pixels = ctx.createImageData(size, size);
  // Broad painted ground patches, with photographed microdetail deliberately excluded.
  const field = new Float32Array(128 * 128 * 2);
  for (let z = 0; z < 128; z++) for (let x = 0; x < 128; x++) {
    const wx = (x / 127 - 0.5) * geometry.radiusX * 2.4, wz = (z / 127 - 0.5) * geometry.radiusZ * 2.4;
    const h = geometry.getHeight(wx, wz);
    const slope = Math.hypot(geometry.getHeight(wx + 0.5, wz) - geometry.getHeight(wx - 0.5, wz), geometry.getHeight(wx, wz + 0.5) - geometry.getHeight(wx, wz - 0.5));
    const at = (z * 128 + x) * 2;
    field[at] = Math.max(smooth(0.48, 1.55, slope), smooth(0.72, 1.01, geometry.radial(wx,wz) + .09 * Math.sin(wx*.18 + Math.sin(wz*.22)) + .04 * Math.sin(wz*.34)));
    field[at + 1] = geometry.style === 'forest' ? (1 - smooth(-1, 3.4, h - geometry.topY)) * 0.6 : 0.7;
  }
  for (let z = 0; z < size; z++) for (let x = 0; x < size; x++) {
    const at = (z * size + x) * 4;
    const fx = x / (size - 1) * 127, fz = z / (size - 1) * 127;
    const ix = Math.floor(fx), iz = Math.floor(fz), nx = Math.min(ix + 1, 127), nz = Math.min(iz + 1, 127);
    const tx = fx - ix, tz = fz - iz;
    const sampleField = channel => {
      const a = field[(iz * 128 + ix) * 2 + channel] * (1 - tx) + field[(iz * 128 + nx) * 2 + channel] * tx;
      const b = field[(nz * 128 + ix) * 2 + channel] * (1 - tx) + field[(nz * 128 + nx) * 2 + channel] * tx;
      return a * (1 - tz) + b * tz;
    };
    const stone = sampleField(0), soil = sampleField(1);
    const wx = (x / (size - 1) - .5) * geometry.radiusX * 2.4;
    const wz = (z / (size - 1) - .5) * geometry.radiusZ * 2.4;
    const clearing = geometry.style === 'forest' ? 1 - smooth(9, 18, Math.hypot(wx + 22, wz - 16)) : 0;
    // Smooth domain-warped organic zones (eliminates repeating grid & polka-dot quilt!)
    const warpX = Math.sin(wx * 0.023 + wz * 0.017) * 18.0 + Math.cos(wz * 0.041 - wx * 0.019) * 8.0;
    const warpZ = Math.cos(wx * 0.019 - wz * 0.029) * 18.0 + Math.sin(wx * 0.037 + wz * 0.013) * 8.0;
    const broadZone = 0.5 + 0.5 * Math.sin((wx + warpX) * 0.026 + (wz + warpZ) * 0.018);
    // Dual irrational rotated texture lookup breaks up ALL visible tiling!
    const u1 = (((Math.floor(x * 1.15 + warpX * 1.4)) % 256) + 256) % 256;
    const v1 = (((Math.floor(z * 1.15 + warpZ * 1.4)) % 256) + 256) % 256;
    const rx2 = x * 0.798 - z * 0.602, rz2 = x * 0.602 + z * 0.798;
    const u2 = (((Math.floor(rx2 * 2.37 + 91)) % 256) + 256) % 256;
    const v2 = (((Math.floor(rz2 * 2.37 + 47)) % 256) + 256) % 256;
    const s1 = (v1 * 256 + u1) * 4;
    const s2 = (v2 * 256 + u2) * 4;
    const luma1 = (samples[0][s1] * 0.299 + samples[0][s1 + 1] * 0.587 + samples[0][s1 + 2] * 0.114) / 255;
    const luma2 = (samples[0][s2] * 0.299 + samples[0][s2 + 1] * 0.587 + samples[0][s2 + 2] * 0.114) / 255;
    const texLuma = luma1 * 0.58 + luma2 * 0.42;
    const cliffLuma = ((samples[1][s1] * 0.299 + samples[1][s1 + 1] * 0.587 + samples[1][s1 + 2] * 0.114) / 255) * 0.6
                    + ((samples[1][s2] * 0.299 + samples[1][s2 + 1] * 0.587 + samples[1][s2 + 2] * 0.114) / 255) * 0.4;
    const isInd = geometry.style === 'industrial';
    // Distinct, high-contrast regional palettes: deep Adriatic olive + warm terracotta/chalk vs dark iron-slate + copper rust
    const grassDeep = isInd ? [48, 52, 58] : [46, 72, 42];
    const grassSun = isInd ? [92, 96, 102] : [121, 139, 65];
    const warmAccent = isInd ? [142, 84, 52] : [178, 134, 72];
    const sandstoneRim = isInd ? [101, 88, 79] : [166, 125, 86];
    const tGrass = Math.min(1, Math.max(0, (texLuma - 0.18) * 1.45));
    const warmMix = Math.min(1, Math.max(0, soil * 0.42 + broadZone * 0.32));
    for (let c = 0; c < 3; c++) {
      let veg = grassDeep[c] * (1 - tGrass) + grassSun[c] * tGrass;
      veg = veg * (1 - warmMix * 0.55) + warmAccent[c] * (warmMix * 0.55);
      const rimCol = sandstoneRim[c] * (0.73 + cliffLuma * 0.52);
      const scree = smooth(0.12, 0.76, stone + (cliffLuma - 0.43) * .34) * .79;
      const ground = veg * (1 - scree) + rimCol * scree;
      const pathTone = (isInd ? [116, 114, 110] : [206, 176, 134])[c];
      pixels.data[at + c] = Math.min(255, Math.max(0, ground * (1 - clearing * 0.52) + pathTone * clearing * 0.52));
    }
    pixels.data[at + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0); texture.update(false);
  texture.wrapU = texture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
  texture.anisotropicFilteringLevel = 8;
  material.albedoTexture = texture;
  const bumpPath = geometry.style === 'industrial'
    ? './assets/benchmark/textures/anti_slip_concrete/nor_gl.jpg'
    : './assets/benchmark/textures/aerial_grass_rock/nor_gl.jpg';
  const bump = new BABYLON.Texture(bumpPath, scene, false, true, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
  bump.uScale = 14; bump.vScale = 14;
  bump.wrapU = bump.wrapV = BABYLON.Texture.WRAP_ADDRESSMODE;
  bump.gammaSpace = false;
  bump.level = 0.36;
  material.bumpTexture = bump;
}

/** Two watertight joined surfaces, painted autumn meadow + ochre cliff. */
export function buildGeneratedIsland(scene, options = {}) {
  const geometry = generateIslandGeometry(options);
  const prefix = `generatedIsland_${geometry.style}_${geometry.seed}`;
  const topMat = createMaterial(scene, `${prefix}_terrainMat`, '#ffffff');
  topMat.albedoColor.set(1, 1, 1);
  const rockMat = createMaterial(scene, `${prefix}_rockMat`, '#f5efe6');
  if (scene.getEngine().constructor.name !== 'NullEngine') {
    const texture = new BABYLON.Texture('./assets/benchmark/textures/aerial_rocks_02/Diffuse.jpg', scene);
    texture.anisotropicFilteringLevel = 8;
    rockMat.albedoTexture = texture;
  }
  const meshes = [geometry.top, geometry.rock].map((data, index) => {
    const mesh = new BABYLON.Mesh(`${prefix}_${index ? 'rock' : 'terrain'}`, scene);
    const vd = new BABYLON.VertexData();
    Object.assign(vd, data); vd.applyToMesh(mesh);
    mesh.parent = options.parent || null;
    mesh.material = index ? rockMat : topMat;
    mesh.receiveShadows = true;
    mesh.isPickable = true;
    options.shadowGenerator?.addShadowCaster(mesh, false);
    return mesh;
  });
  meshes[1].metadata = { ...meshes[1].metadata, turfEdge: { material: topMat, width: geometry.radiusX * 2.4, depth: geometry.radiusZ * 2.4 } };
  const readyPromise = bakeTerrainTexture(scene, geometry, topMat).catch(error => console.warn('Terrain texture bake unavailable; keeping vertex-painted PBR terrain.', error));
  return {terrain:meshes[0], rock:meshes[1], getHeight:geometry.getHeight, contains:geometry.contains, bounds:geometry.bounds,
    readyPromise, seed:geometry.seed, geometry,
    diagnostics:{meshes:2, triangles:(geometry.top.indices.length+geometry.rock.indices.length)/3, vertices:(geometry.top.positions.length+geometry.rock.positions.length)/3, textureSources:3},
    dispose(){ meshes.forEach(mesh=>mesh.dispose()); topMat.dispose(false,true); rockMat.dispose(false,true); },
  };
}
