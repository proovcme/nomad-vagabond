import { BakedLighting } from './bakedLighting.js?v=mission1';
import { HangarFleet } from './hangarFleet.js?v=mission1';
import { AircraftJobs } from './aircraftJobs.js?v=mission1';
import { ExplosionEffects } from './explosionEffects.js?v=mission1';
import { IndustrialCranes } from './industrialCranes.js?v=mission1';
import { WorldMotion } from './worldMotion.js?v=mission1';
import { PerformanceProbe } from './performanceProbe.js?v=mission1';
import { generateRandomSeed } from './rng.js?v=mission1';
import { SoundEngine } from './audio.js?v=mission1';
import { SolarWorld } from './world.js?v=mission1';
import { AsteroidBase } from './asteroidBase.js?v=mission1';
import { MaterialKit } from './materialKit.js?v=mission1';
import { PracticalLights } from './practicalLights.js?v=mission1';
import { leadPoint, bombImpactPoint } from './combatAim.js?v=mission1';
import { SmokeTrail } from './smoke.js?v=mission1';
import { CollisionWorld } from './collisions.js?v=mission1';
import { IslandConstruction } from './islandConstruction.js?v=mission1';
import { Prologue, PROLOGUE_DURATION } from './prologue.js?v=mission1';
import { ExplorerAircraft, aircraftHeading, configureImportedAircraftMaterial } from './explorerAircraft.js?v=mission1';
import { NavigatorPlayer } from './player.js?v=mission1';
import { GameUI } from './ui.js?v=mission1';
import { BenchmarkCoast } from './benchmarkCoast.js?v=mission1';
import { SkyArchipelagoWorld } from './skyArchipelago.js?v=mission1';

const urlParams = new URLSearchParams(window.location.search);
const shotMode = urlParams.get('shot');
let selectedQuality=urlParams.get('quality')||'medium';
const LEGACY_SPACE_SHOTS = new Set([
  'space', 'orbit', 'shore', 'before_forest', 'water', 'closeup',
  'base', 'base_night', 'map', 'pause', 'pad', 'street', 'complex',
  'aircraft', 'takeoff', 'atmo',
]);
const isBenchShot = Boolean(shotMode && (shotMode.startsWith('bench_') || shotMode.startsWith('stage')));
const worldMode = (urlParams.get('mode') === 'space' || LEGACY_SPACE_SHOTS.has(shotMode || '') || isBenchShot)
  ? 'space'
  : 'sky';

const canvas = document.getElementById('game-canvas');
const engine = new BABYLON.Engine(canvas, false, { preserveDrawingBuffer: urlParams.get('metrics')==='1', stencil: true }, true);
engine.setHardwareScalingLevel(1 / Math.min(window.devicePixelRatio || 1, 2));

const audio = new SoundEngine();
const ui = new GameUI();

let scene = null;
let camera = null;
let world = null;
let asteroidBase = null;
let ship = null;
let benchmarkCoast = null;
let player = null;

let gameState = 'menu'; // 'menu' | 'playing' | 'paused' | 'map' | 'defeat' | 'victory'
let controlMode = 'foot'; // 'foot' | 'aircraft' | 'drive' | 'water' | 'asteroid'
let keysAttuned = 0;
let runTime = 0;
let currentSeed = 'AETHER-742';
let nearestAction = null;
let questTakenOff = false;
let questLanded = false;
let questRefueled = false;
let demoState = null;
let explosionEffects=null;
let prologue = null;
let construction = null;
let smoke = null;
let islandOrigin = null;
let safeZone = null;
let metricsFrames = 0;
let introSkipRequested = false;
let runGeneration = 0;

function spawnDemoExplosion(pos,scale=1){
  explosionEffects?.spawn(pos,scale);
}

function spawnEnemySquadron(centerPos, escort = false) {
  if (!demoState) return;
  const defs = escort ? [
    {variant:'fighter', file:'scrapyard_fighter.glb', hp:185, speed:32, off:[150,62,-45], scale:1.2},
    {variant:'fighter', file:'scrapyard_fighter.glb', hp:185, speed:32, off:[175,75,45], scale:1.2},
  ] : [{variant:'bomber', file:'scrapyard_bomber.glb', hp:260, speed:20, off:[155,45,0], scale:1.35}];
  defs.forEach((d, idx) => {
    const root = new BABYLON.TransformNode(`demoEnemy_${idx}`, scene);
    root.position.copyFrom(centerPos).addInPlace(new BABYLON.Vector3(...d.off));
    root.scaling.setAll(d.scale);

    // Beacon marker sphere so targets are easy to spot in the sunset sky
    const marker = BABYLON.MeshBuilder.CreateSphere(`demoEnemyMarker_${idx}`, { diameter: 2.2, segments: 8 }, scene);
    marker.parent = root;
    marker.position.y = 4.2;
    const mMat = new BABYLON.StandardMaterial(`demoEnemyMat_${idx}`, scene);
    mMat.emissiveColor = BABYLON.Color3.FromHexString('#ff3b30');
    mMat.disableLighting = true;
    marker.material = mMat;

    const enemy = {
      root,
      marker,
      hp: d.hp,
      maxHp: d.hp,
      speed: d.speed,
      variant: d.variant,
      phase: idx * 1.25,
      fireCd: 1.5 + idx * 0.5,
      burstLeft: 0,
      burstTimer: 0,
      missileCd: 5.0 + idx * 2.5,
      flareCd: 0,
      aiState: 'pursue',
      evadeTimer: 0,
      evadeSide: idx % 2 === 0 ? 1 : -1,
      flankOffset: idx % 2 === 0 ? -24 : 24,
      heading: new BABYLON.Vector3(0, 0, 1),
      velocity: new BABYLON.Vector3(0, 0, d.speed),
      damageTrail: null,
      alive: true,
    };
    demoState.enemies.push(enemy);

    if (typeof BABYLON.SceneLoader !== 'undefined') {
      BABYLON.SceneLoader.ImportMeshAsync('', './assets/aircraft/', d.file, scene).then((res) => {
        if (!enemy.alive) {
          res.meshes.forEach((m) => m.dispose());
          return;
        }
        for (const m of res.meshes) {
          if (m.name === '__root__') m.parent = root;
          configureImportedAircraftMaterial(m.material,scene.getEngine(),d.variant);
          m.alwaysSelectAsActiveMesh = true;
        }
      }).catch(() => {});
    }
  });
}
let speedDust = [];

const menuOverlay = document.getElementById('menu-overlay');
const mapModal = document.getElementById('map-modal');
const pauseModal = document.getElementById('pause-modal');
const defeatModal = document.getElementById('defeat-modal');
const victoryModal = document.getElementById('victory-modal');
const seedInput = document.getElementById('seed-input');

function initWorld(seedStr) {
  if (scene) {
    scene.dispose();
  }
  prologue?.hide();
  document.getElementById('combat-lead').hidden = true;
  construction?.close();
  document.body.classList.remove('in-prologue');
  ui.hideRadio();
  clearTimeout(ui.toastTimeout);
  ui.toastEl.classList.remove('visible');
  explosionEffects=null;
  introSkipRequested = false;
  currentSeed = (seedStr || generateRandomSeed()).trim().toUpperCase();
  seedInput.value = currentSeed;

  scene = new BABYLON.Scene(engine);
  scene.useRightHandedSystem = true;
  explosionEffects=new ExplosionEffects(scene);
  if (worldMode === 'sky') scene.collisionWorld = new CollisionWorld(scene);
  scene.clearColor = new BABYLON.Color4(0.01, 0.02, 0.045, 1.0);

  camera = new BABYLON.FreeCamera('mainCam', new BABYLON.Vector3(0, 60, 160), scene);
  camera.minZ = 0.2;
  camera.maxZ = worldMode === 'sky' ? 8500 : 3600;
  camera.fov = 1.05;
  scene.activeCamera = camera;

  if (worldMode === 'sky') {
    world = new SkyArchipelagoWorld(scene, currentSeed);
    asteroidBase = new AsteroidBase(scene, 742);
    world.registerVagabondBase(asteroidBase);
    construction = new IslandConstruction(scene, asteroidBase, world.shadowGenerator);
    islandOrigin = asteroidBase.group.position.clone();
    safeZone = islandOrigin.add(new BABYLON.Vector3(0, 0, 180));
  } else {
    world = new SolarWorld(scene, currentSeed);
    const tp = world.terrainPlanet || world.planets[0];
    asteroidBase = new AsteroidBase(scene, tp ? tp.seedNum : 742);
    if (tp) {
      asteroidBase.setTargetPlanet(tp);
      asteroidBase.group.position.copyFrom(tp.group.position).addInPlace(
        new BABYLON.Vector3(Math.cos(asteroidBase.orbitAngle) * asteroidBase.orbitDistance, 12.0, Math.sin(asteroidBase.orbitAngle) * asteroidBase.orbitDistance)
      );
    }
  }

  ship = new ExplorerAircraft(scene, camera, audio);
  smoke = new SmokeTrail(scene, ship);
  ship.dockOnAsteroid(asteroidBase);

  player = new NavigatorPlayer(scene, camera, audio);
  player.placeOnAsteroid(asteroidBase);
  if (worldMode==='sky') {
    world.islandConstruction=construction;
    world.practicalLights=new PracticalLights(scene,world,asteroidBase,ship);
    world.industrialCranes=new IndustrialCranes(scene,world.industrialIsland.group,world.shadowGenerator);
    world.materialKit=new MaterialKit(scene);
    world.bakedLighting=new BakedLighting(scene);
    world.fleet=new HangarFleet(scene,asteroidBase,world.shadowGenerator);
    world.jobs=new AircraftJobs(scene,world,asteroidBase,{onReward:amount=>construction.addSalvage(amount),onToast:msg=>ui.showToast(msg,4500),onExplosion:(pos,scale)=>spawnDemoExplosion(pos,scale)});
    ship.onProjectileImpact=event=>{const targetHit=world.jobs?.onProjectileImpact(event);if(!targetHit&&event.position&&['bomb','rocket'].includes(event.kind))spawnDemoExplosion(event.position,event.kind==='bomb'?1.5:.7);};
  }

  if (world.shadowGenerator) {
    for (const m of asteroidBase.group.getChildMeshes()) {
      m.receiveShadows = true;
      world.shadowGenerator.addShadowCaster(m, false);
    }
    for (const m of ship.group.getChildMeshes()) {
      m.receiveShadows = true;
      world.shadowGenerator.addShadowCaster(m, false);
    }
    if (world.terrainPlanet) {
      for (const m of world.terrainPlanet.group.getChildMeshes()) {
        if (m.name && (m.name.includes('Trunk') || m.name.includes('Crown') || m.name.includes('tShrub') || m.name.includes('tRock') || m.name.includes('ruin'))) {
          world.shadowGenerator.addShadowCaster(m, false);
        }
      }
    }
  }
  keysAttuned = 0;
  runTime = 0;
  questTakenOff = false;
  questLanded = false;
  questRefueled = false;
  controlMode = 'foot';
  ui.setMode('foot');
  demoState = null;

  // Setup 4-Act Sky Archipelago Demo (Approach damaged cargo -> Land on Vagabond -> Pull Lever -> Fighter Dogfight)
  if (worldMode === 'sky' && asteroidBase) {
    const leverNode = new BABYLON.TransformNode('vagPowerLever', scene);
    leverNode.parent = asteroidBase.group;
    leverNode.position.set(2.0, 3.38, -7.2);
    const lBox = BABYLON.MeshBuilder.CreateBox('vagLeverBox', { width: 1.1, height: 1.5, depth: 0.9 }, scene);
    lBox.parent = leverNode;
    lBox.position.y = 0.75;
    const lMat = new BABYLON.PBRMaterial('vagLeverMat', scene);
    lMat.albedoColor = BABYLON.Color3.FromHexString('#626870');
    lMat.metallic = 0.65;
    lMat.roughness = 0.48;
    lBox.material = lMat;

    const lBeacon = BABYLON.MeshBuilder.CreateSphere('vagLeverBeacon', { diameter: 0.65, segments: 8 }, scene);
    lBeacon.parent = leverNode;
    lBeacon.position.y = 1.9;
    const lbMat = new BABYLON.StandardMaterial('vagLeverBeaconMat', scene);
    lbMat.emissiveColor = BABYLON.Color3.FromHexString('#ff3b30');
    lBeacon.material = lbMat;

    // 5 glowing sky-beacon rings guiding the player through the archipelago (~1250m scenic route)
    const ringPositions = [
      new BABYLON.Vector3(720, 82, -270),
      new BABYLON.Vector3(480, 74, -210),
      new BABYLON.Vector3(260, 56, -110),
      new BABYLON.Vector3(145, 52, -18),
    ];
    const rings = ringPositions.map(position => ({mesh:{position, isVisible:false}, passed:false}));


    demoState = {
      stage: 'intro_cutscene',
      cutsceneTimer: PROLOGUE_DURATION,
      tutorialTimer: 0,
      tutorialMoved: false,
      flightLessons: {thrust: false, turn: false, altitude: false},
      firingLesson: false,
      islandDistance: 0,
      combatWave: 0,
      collisionCd: 0,
      onRunwayRollout: false,
      rings,
      powerOn: false,
      leverNode,
      leverBeaconMat: lbMat,
      enemies: [],
      enemyShots: [],
      enemyMissiles: [],
      enemyFlares: [],
      rwrWarnCd: 0,
      rwrToastCd: 0,
      enemyFlareToastCd: 0,
      kills: 0,
      totalEnemies: 3,
      smokeTimer: 0,
    };

    if (!shotMode) {
      asteroidBase.enginePower = 0.15;
      player.boardShip();
      ship.undockFromAsteroid();
      ship.hull = 42;
      ship.fuel = 80;
      ship.throttle = 0.62;
      const vPos = asteroidBase.group.position;
      const startPos = vPos.add(new BABYLON.Vector3(1200, 95, -360));
      const firstGate = ringPositions[0];
      ship.group.position.copyFrom(startPos);
      const fwd = firstGate.subtract(startPos).normalize();
      ship.group.rotationQuaternion = aircraftHeading(fwd);
      ship.velocity.copyFrom(fwd.scale(30));
      controlMode = 'aircraft';
      ui.setMode('aircraft');
      prologue = new Prologue(camera, ship, asteroidBase);
    }
  }

  if(world.graphics && selectedQuality!==world.graphics.quality)world.graphics.applyQuality(selectedQuality,world.shadowGenerator);
  document.querySelectorAll('#quality-seg .seg-btn').forEach(b=>b.classList.toggle('active',b.dataset.val===selectedQuality));

  if(worldMode==='sky')world.motion=new WorldMotion(scene,demoState?.leverNode);

  // Local space dust particles around camera (space mode only)
  speedDust = [];
  if (worldMode === 'space') {
    const dustMat = new BABYLON.StandardMaterial('speedDustMat', scene);
    dustMat.emissiveColor = BABYLON.Color3.FromHexString('#bce8ff');
    dustMat.disableLighting = true;
    dustMat.alpha = 0.55;
    for (let i = 0; i < 90; i++) {
      const p = BABYLON.MeshBuilder.CreateBox(`dust_${i}`, { width: 0.08, height: 0.08, depth: 0.45 }, scene);
      p.material = dustMat;
      p.position.set((Math.random() - 0.5) * 48, (Math.random() - 0.5) * 32, (Math.random() - 0.5) * 48);
      speedDust.push(p);
    }
  }
}

let modalReturnState = 'playing';
initWorld(seedInput.value);

// Optional screenshot / inspection presets (?shot=arch_panorama|arch_vagabond|arch_forest|arch_industrial|arch_vista|arch_flight|...)
if (urlParams.get('bloom') === '0' && world?.graphics?.pipeline) {
  world.graphics.pipeline.bloomEnabled = false;
  world.graphics.pipeline.chromaticAberrationEnabled = false;
  world.graphics.pipeline.grainEnabled = false;
}
let freezeCameraForShot = false;
if (shotMode && worldMode === 'sky') {
  menuOverlay.style.display = 'none';
  ui.showHUD(true);
  gameState = 'playing';
  freezeCameraForShot = true;
  world.update(0.016, null, camera.position);

  const fPos = world.forestIsland.group.position;
  const iPos = world.industrialIsland.group.position;
  const vPos = asteroidBase.group.position;

  if (shotMode === 'arch_hero') {
    player.placeOnAsteroid(asteroidBase,new BABYLON.Vector3(-12,21.73,1));controlMode='foot';ui.setMode('foot');
    camera.position.copyFrom(vPos).addInPlace(new BABYLON.Vector3(-12,23.0,-2.4));camera.setTarget(vPos.add(new BABYLON.Vector3(-12,22.7,1)));camera.fov=.7;
  } else if (shotMode === 'arch_sky') {
    player.boardShip();controlMode='aircraft';ui.setMode('aircraft');
    camera.position.set(1000,120,-300);camera.setTarget(camera.position.add(new BABYLON.Vector3(-900,280,-180)));camera.fov=.95;
  } else if (['arch_turret','arch_radar','arch_fleet','arch_crane','arch_runway'].includes(shotMode)) {
    player.boardShip();controlMode='aircraft';ui.setMode('aircraft');
    const poses={arch_runway:{at:[22,3.4,0],from:[43,17,21]},arch_turret:{at:[16,17,25],from:[30,22,40]},arch_radar:{at:[14,20,-26],from:[31,25,-44]},arch_fleet:{at:[-23,8,11],from:[7,11,6]},arch_crane:{at:[16,18,-10],from:[60,32,40]}};
    const p=poses[shotMode],origin=shotMode==='arch_crane'?iPos:vPos;camera.position.copyFrom(origin.add(new BABYLON.Vector3(...p.from)));camera.setTarget(origin.add(new BABYLON.Vector3(...p.at)));camera.fov=shotMode==='arch_fleet'?1.1:.85;
    if(shotMode==='arch_fleet'){world.fleet?.setActiveVariant(null);ship.group.setEnabled(false);}
    if(shotMode==='arch_radar')demoState.powerOn=true;
  } else if (shotMode === 'arch_hangar') {
    player.boardShip();controlMode='aircraft';ui.setMode('aircraft');
    camera.position.copyFrom(vPos).addInPlace(new BABYLON.Vector3(17,8,6));camera.setTarget(vPos.add(new BABYLON.Vector3(-12,8,-1)));camera.fov=.95;
  } else if (shotMode === 'arch_shipyard') {
    player.boardShip();controlMode='aircraft';ui.setMode('aircraft');
    const point=world.landmarks.root.position;camera.position.copyFrom(point).addInPlace(new BABYLON.Vector3(92,57,112));camera.setTarget(point.add(new BABYLON.Vector3(-6,8,0)));camera.fov=.8;
  } else if (shotMode === 'arch_panorama') {
    player.boardShip();
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    camera.position.set(15, 195, 360);
    camera.upVector.set(0, 1, 0);
    camera.setTarget(new BABYLON.Vector3(20, 28, -210));
    camera.fov = 1.04;
  } else if (shotMode === 'arch_vagabond') {
    player.boardShip();
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    camera.position.copyFrom(vPos).addInPlace(new BABYLON.Vector3(88, 34, 72));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(vPos.add(new BABYLON.Vector3(6, 5, 0)));
    camera.fov = 0.88;
  } else if (shotMode === 'arch_forest') {
    player.boardShip();
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    camera.position.copyFrom(fPos).addInPlace(new BABYLON.Vector3(95, 48, 135));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(fPos.add(new BABYLON.Vector3(0, -6, 0)));
    camera.fov = 0.94;
  } else if (shotMode === 'arch_industrial') {
    player.boardShip();
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    camera.position.copyFrom(iPos).addInPlace(new BABYLON.Vector3(82, 24, 108));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(iPos.add(new BABYLON.Vector3(0, -4, 0)));
    camera.fov = 0.92;
  } else if (shotMode === 'arch_vista') {
    controlMode = 'foot';
    ui.setMode('foot');
    const lookPoint = fPos.add(new BABYLON.Vector3(-22, world.forestIsland.getTopHeightLocal(-22, 16) + 1.1, 16));
    player.dockedBody = null;
    player.group.setEnabled(true);
    player.group.position.copyFrom(lookPoint);
    player.group.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(2.35, 0, 0);
    camera.position.copyFrom(lookPoint).addInPlace(new BABYLON.Vector3(18, 10.5, 16));
    camera.upVector.set(0, 1, 0);
    // Frame both Vagabond (0,35,0) and Industrial (-290,-10,-340) on the horizon from Forest Island
    camera.setTarget(new BABYLON.Vector3(-115, 22, -135));
    camera.fov = 1.08;
  } else if (shotMode === 'arch_flight') {
    player.boardShip();
    ship.undockFromAsteroid();
    ship.group.position.set(145, 58, -110);
    ship.group.lookAt(fPos.add(new BABYLON.Vector3(-20, 12, 10)));
    ship.throttle = 0.85;
    for (const f of ship.rocketFlames) f.scaling.y = 1.1;
    for (const s of ship.gearStruts) s.scaling.set(0.01, 0.01, 0.01);
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    const fwd = fPos.subtract(ship.group.position).normalize();
    const right = BABYLON.Vector3.Cross(new BABYLON.Vector3(0, 1, 0), fwd).normalize();
    camera.position.copyFrom(ship.group.position).subtractInPlace(fwd.scale(10.5)).addInPlace(right.scale(5.2)).addInPlace(new BABYLON.Vector3(0, 3.2, 0));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(ship.group.position.add(fwd.scale(14)));
    camera.fov = 0.95;
  }
} else if (shotMode && world.terrainPlanet) {
  menuOverlay.style.display = 'none';
  ui.showHUD(true);
  gameState = 'playing';
  const tp = world.terrainPlanet;
  // Aim planet's forest/ruin hemisphere toward the star for sunlit inspection
  const ruinAngle = Math.atan2(tp.ruinPosLocal.z, tp.ruinPosLocal.x);
  tp.orbitAngle = ruinAngle + Math.PI;
  world.update(0.016, null, camera.position);
  world.update(0.016, null, camera.position);

  const sunDir = tp.group.position.scale(-1).normalize();
  if (shotMode === 'space') {
    const dir = sunDir.add(new BABYLON.Vector3(0.45, 0.22, 0.25)).normalize();
    const tangent = BABYLON.Vector3.Cross(dir, new BABYLON.Vector3(0, 1, 0)).normalize();
    ship.group.position.copyFrom(tp.group.position).addInPlace(dir.scale(tp.radius + 54)).addInPlace(tangent.scale(-16));
    ship.group.lookAt(tp.group.position.add(tangent.scale(10)));
    ship.velocity.copyFrom(tp.velocity);
    controlMode = 'ship';
    ui.setMode('ship');
    camera.position.copyFrom(ship.group.position).addInPlace(dir.scale(14)).addInPlace(new BABYLON.Vector3(0, 5, 0));
    for (let i = 0; i < 40; i++) ship.update(0.016, world, 'ship', () => {});
  } else if (shotMode === 'orbit') {
    freezeCameraForShot = true;
    const dir = sunDir.add(new BABYLON.Vector3(0.22, 0.52, -0.32)).normalize();
    ship.group.position.copyFrom(tp.group.position).addInPlace(dir.scale(tp.radius + 115));
    ship.group.lookAt(tp.group.position);
    ship.velocity.copyFrom(tp.velocity);
    controlMode = 'ship';
    ui.setMode('ship');
    camera.position.copyFrom(tp.group.position).addInPlace(dir.scale(tp.radius + 76));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(tp.group.position);
    camera.fov = 0.92;
  } else if (shotMode === 'closeup') {
    freezeCameraForShot = true;
    const dir = sunDir.add(new BABYLON.Vector3(0.4, 0.2, 0.2)).normalize();
    ship.group.position.copyFrom(tp.group.position).addInPlace(dir.scale(tp.radius + 45));
    ship.group.lookAt(tp.group.position.add(new BABYLON.Vector3(0, 5, 20)));
    ship.velocity.copyFrom(tp.velocity);
    ship.sailOpen = 1.0;
    controlMode = 'ship';
    ui.setMode('ship');
    for (let i = 0; i < 10; i++) ship.update(0.016, world, 'ship', () => {});
    const fwd = new BABYLON.Vector3(0, 0, -1);
    const q = ship.group.rotationQuaternion || BABYLON.Quaternion.Identity();
    const worldFwd = BABYLON.Vector3.TransformNormal(fwd, BABYLON.Matrix.FromQuaternionToRef(q, new BABYLON.Matrix())).normalize();
    const worldRight = BABYLON.Vector3.Cross(new BABYLON.Vector3(0, 1, 0), worldFwd).normalize();
    camera.position.copyFrom(ship.group.position).addInPlace(worldFwd.scale(-7.5)).addInPlace(worldRight.scale(7.8)).addInPlace(new BABYLON.Vector3(0, 4.2, 0));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(ship.group.position.add(new BABYLON.Vector3(0, 2.2, 0)));
    camera.fov = 0.85;
  } else if (shotMode === 'water') {
    let bayDir = tp.shipAnchorLocal.clone().normalize();
    for (let a = 0; a < 40; a++) {
      const testDir = sunDir.add(new BABYLON.Vector3(Math.cos(a) * 0.45, Math.sin(a * 0.7) * 0.25, Math.sin(a) * 0.45)).normalize();
      if (tp.getSurfaceHeight(testDir) < tp.seaLevel - 1.4) {
        bayDir = testDir;
        break;
      }
    }
    ship.group.position.copyFrom(tp.group.position).addInPlace(bayDir.scale(tp.seaLevel + 0.3));
    ship.velocity.copyFrom(tp.velocity);
    ship.enterWater(tp);
    controlMode = 'water';
    ui.setMode('water');
    camera.position.copyFrom(ship.group.position).addInPlace(bayDir.scale(6));
    for (let i = 0; i < 60; i++) ship.update(0.016, world, 'water', () => {});
  } else if (shotMode === 'shore') {
    freezeCameraForShot = true;
    const ruinDir = tp.ruinPosLocal.clone().normalize();
    let shoreDir = ruinDir.clone();
    for (let a = 0; a < 40; a++) {
      const testDir = ruinDir.add(new BABYLON.Vector3(Math.cos(a) * 0.35, 0, Math.sin(a) * 0.35)).normalize();
      const h = tp.getSurfaceHeight(testDir);
      if (h > tp.seaLevel + 0.8 && h < tp.seaLevel + 1.8 && (!tp.isClearOfTrees || tp.isClearOfTrees(testDir, 0.11))) {
        shoreDir = testDir;
        break;
      }
    }
    ship.group.position.copyFrom(tp.group.position).addInPlace(shoreDir.scale(tp.getSurfaceHeight(shoreDir) + 0.72));
    ship.dockOnPlanet(tp);
    controlMode = 'drive';
    ui.setMode('drive');
    const worldUp = ship.group.position.subtract(tp.group.position).normalize();
    const coastTan = BABYLON.Vector3.Cross(worldUp, new BABYLON.Vector3(0, 1, 0)).normalize();
    camera.position.copyFrom(ship.group.position).addInPlace(coastTan.scale(-10.5)).addInPlace(worldUp.scale(5.2));
    camera.upVector.copyFrom(worldUp);
    camera.setTarget(ship.group.position.add(worldUp.scale(1.4)).add(coastTan.scale(2.0)));
    camera.fov = 0.96;
  } else if (shotMode === 'base' || shotMode === 'base_night') {
    freezeCameraForShot = true;
    player.boardShip();
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    if (shotMode === 'base_night') {
      // Position camera & rotate sun direction to night side of asteroid so local lamps glow
      world.sunDirLight.intensity = 0.35;
      world.hemiLight.intensity = 0.24;
      world.sunPointLight.intensity = 0.5;
    }
    const camOff = shotMode === 'base_night' ? new BABYLON.Vector3(-28, 18, -28) : new BABYLON.Vector3(-34, 22, 34);
    camera.position.copyFrom(asteroidBase.group.position).addInPlace(camOff);
    camera.upVector.set(0, 1, 0);
    camera.setTarget(asteroidBase.group.position.add(new BABYLON.Vector3(0, 0.5, 0)));
    camera.fov = 0.94;
  } else if (shotMode === 'map') {
    freezeCameraForShot = true;
    openDeviceModal('map', 'playing');
  } else if (shotMode === 'pause') {
    freezeCameraForShot = true;
    togglePause();
  } else if (shotMode === 'pad') {
    freezeCameraForShot = true;
    player.placeOnAsteroid(asteroidBase, new BABYLON.Vector3(-1.2, 3.4, 2.2));
    player.yaw = -1.2;
    camera.position.copyFrom(asteroidBase.group.position).addInPlace(new BABYLON.Vector3(-4.5, 7.6, 7.5));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(asteroidBase.group.position.add(new BABYLON.Vector3(5.2, 4.2, 0)));
    camera.fov = 0.94;
  } else if (shotMode === 'street') {
    freezeCameraForShot = true;
    player.placeOnAsteroid(asteroidBase, new BABYLON.Vector3(-4.2, 3.4, 0.2));
    player.yaw = -1.55;
    camera.position.copyFrom(asteroidBase.group.position).addInPlace(new BABYLON.Vector3(-9.5, 6.2, 2.8));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(asteroidBase.group.position.add(new BABYLON.Vector3(2.5, 4.4, -2.0)));
    camera.fov = 0.92;
  } else if (shotMode === 'complex') {
    freezeCameraForShot = true;
    player.boardShip();
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    camera.position.copyFrom(asteroidBase.group.position).addInPlace(new BABYLON.Vector3(-14, 18.5, 16));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(asteroidBase.group.position.add(new BABYLON.Vector3(1.0, 3.5, -1.5)));
    camera.fov = 0.92;
  } else if (shotMode === 'aircraft') {
    freezeCameraForShot = true;
    player.boardShip();
    ship.undockFromAsteroid();
    const dir = sunDir.add(new BABYLON.Vector3(0.45, 0.25, 0.25)).normalize();
    ship.group.position.copyFrom(tp.group.position).addInPlace(dir.scale(tp.radius + 36));
    ship.group.lookAt(tp.group.position.add(new BABYLON.Vector3(0, 12, 24)));
    ship.velocity.copyFrom(tp.velocity);
    ship.throttle = 0.85;
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    ship.keys = { KeyW: true };
    for (let i = 0; i < 18; i++) ship.update(0.04, world, 'aircraft', () => {});
    ship.keys = {};
    for (const f of ship.rocketFlames) f.scaling.y = 1.1;
    const fwd = new BABYLON.Vector3(0, 0, -1);
    const q = ship.group.rotationQuaternion || BABYLON.Quaternion.Identity();
    const worldFwd = BABYLON.Vector3.TransformNormal(fwd, BABYLON.Matrix.FromQuaternionToRef(q, new BABYLON.Matrix())).normalize();
    const worldRight = BABYLON.Vector3.Cross(new BABYLON.Vector3(0, 1, 0), worldFwd).normalize();
    camera.position.copyFrom(ship.group.position).addInPlace(worldFwd.scale(-3.8)).addInPlace(worldRight.scale(3.6)).addInPlace(new BABYLON.Vector3(0, 1.6, 0));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(ship.group.position.add(new BABYLON.Vector3(0, 0.15, 0)));
    camera.fov = 0.85;
  } else if (shotMode === 'takeoff') {
    freezeCameraForShot = true;
    player.boardShip();
    ship.undockFromAsteroid();
    ship.group.position.copyFrom(asteroidBase.group.position).addInPlace(new BABYLON.Vector3(15.5, 9.5, 2.5));
    ship.group.lookAt(asteroidBase.group.position.add(new BABYLON.Vector3(38, 16, 6)));
    ship.throttle = 0.85;
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    camera.position.copyFrom(ship.group.position).addInPlace(new BABYLON.Vector3(-8.5, 3.8, 7.5));
    camera.upVector.set(0, 1, 0);
    camera.setTarget(asteroidBase.group.position.add(new BABYLON.Vector3(8.0, 5.5, 0)));
    camera.fov = 0.96;
  } else if (shotMode === 'atmo') {
    freezeCameraForShot = true;
    player.boardShip();
    ship.undockFromAsteroid();
    const dir = sunDir.add(new BABYLON.Vector3(0.18, 0.28, 0.15)).normalize();
    const tangent = BABYLON.Vector3.Cross(dir, new BABYLON.Vector3(0, 1, 0)).normalize();
    const acRight = BABYLON.Vector3.Cross(tangent, dir).normalize();
    ship.group.position.copyFrom(tp.group.position).addInPlace(dir.scale(tp.radius + 9.5));
    const atmoRot = new BABYLON.Matrix();
    BABYLON.Matrix.FromXYZAxesToRef(acRight, dir, tangent.scale(-1), atmoRot);
    BABYLON.Quaternion.FromRotationMatrixToRef(atmoRot, ship.group.rotationQuaternion);
    ship.throttle = 0.8;
    ship.atmoDensity = 0.72;
    for (const f of ship.rocketFlames) f.scaling.y = 0.08;
    controlMode = 'aircraft';
    ui.setMode('aircraft');
    camera.position.copyFrom(ship.group.position).subtractInPlace(tangent.scale(6.8)).addInPlace(acRight.scale(2.4)).addInPlace(dir.scale(2.4));
    camera.upVector.copyFrom(dir);
    camera.setTarget(ship.group.position.add(tangent.scale(5.5)));
    camera.fov = 0.96;
  } else if (shotMode === 'surface') {
    freezeCameraForShot = true;
    const ruinDir = tp.ruinPosLocal.clone().normalize();
    let landDir = ruinDir.add(new BABYLON.Vector3(0.06, 0, 0.05)).normalize();
    for (let a = 0; a < 48; a++) {
      const r = 0.08 + (a % 6) * 0.04;
      const testD = ruinDir.add(new BABYLON.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)).normalize();
      const h = tp.getSurfaceHeight(testD);
      if (h > tp.seaLevel + 1.4 && h < tp.seaLevel + 3.4 && (!tp.isClearOfTrees || tp.isClearOfTrees(testD, 0.10))) {
        landDir = testD;
        break;
      }
    }
    const lh = tp.getSurfaceHeight(landDir);
    ship.group.position.copyFrom(tp.group.position).addInPlace(landDir.scale(lh + 0.72));
    ship.dockOnPlanet(tp);
    const tangent = BABYLON.Vector3.Cross(landDir, new BABYLON.Vector3(0, 1, 0)).normalize();
    const side = BABYLON.Vector3.Cross(landDir, tangent).normalize();
    const rotM = new BABYLON.Matrix();
    BABYLON.Matrix.FromXYZAxesToRef(side, landDir, tangent, rotM);
    BABYLON.Quaternion.FromRotationMatrixToRef(rotM, ship.group.rotationQuaternion);
    player.disembarkFromShip(ship);
    controlMode = 'foot';
    ui.setMode('foot');
    camera.position.copyFrom(ship.group.position).addInPlace(tangent.scale(-5.5)).addInPlace(side.scale(5.2)).addInPlace(landDir.scale(2.6));
    camera.upVector.copyFrom(landDir);
    camera.setTarget(ship.group.position.add(landDir.scale(0.8)).add(side.scale(0.6)));
    camera.fov = 0.94;
  } else if (shotMode === 'before_forest') {
    freezeCameraForShot = true;
    const ruinDir = tp.ruinPosLocal.clone().normalize();
    let forestDir = ruinDir.clone();
    for (let a = 0; a < 48; a++) {
      const r = 0.14 + (a % 5) * 0.05;
      const testD = ruinDir.add(new BABYLON.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)).normalize();
      const h = tp.getSurfaceHeight(testD);
      if (h > tp.seaLevel + 2.4 && h < tp.seaLevel + 6.0) {
        forestDir = testD;
        break;
      }
    }
    const fh = tp.getSurfaceHeight(forestDir);
    ship.group.position.copyFrom(tp.group.position).addInPlace(forestDir.scale(fh + 0.72));
    ship.dockOnPlanet(tp);
    player.disembarkFromShip(ship);
    controlMode = 'foot';
    ui.setMode('foot');
    const tangent = BABYLON.Vector3.Cross(forestDir, new BABYLON.Vector3(0, 1, 0)).normalize();
    const side = BABYLON.Vector3.Cross(forestDir, tangent).normalize();
    camera.position.copyFrom(player.group.position).addInPlace(tangent.scale(-4.8)).addInPlace(side.scale(3.6)).addInPlace(forestDir.scale(2.1));
    camera.upVector.copyFrom(forestDir);
    camera.setTarget(player.group.position.add(forestDir.scale(1.1)).add(tangent.scale(1.8)));
    camera.fov = 0.94;
  } else if (shotMode === 'bench_shore' || shotMode === 'bench_forest' || shotMode === 'bench_forest_back' || shotMode === 'bench_forest_top' || shotMode === 'bench_forest_closeup' || shotMode === 'bench_coast_ground' || shotMode === 'bench_ocean_low' || shotMode === 'bench_shore_closeup') {
    freezeCameraForShot = true;
    benchmarkCoast = new BenchmarkCoast(scene, world.shadowGenerator);
    const bc = benchmarkCoast;
    const isTwilight = urlParams.get('time') === 'twilight';
    bc.setTwilight(isTwilight);
    // Tune lighting & atmospheric fog specifically for the coastal diorama
    if (world.sunDirLight) {
      world.sunDirLight.direction = bc.sunDir.scale(-1);
      world.sunDirLight.position = bc.origin.add(bc.sunDir.scale(90));
      world.sunDirLight.intensity = isTwilight ? 1.15 : 2.35;
      world.sunDirLight.diffuse = BABYLON.Color3.FromHexString(isTwilight ? '#e89058' : '#ffdfb8');
      world.sunDirLight.shadowMinZ = 10;
      world.sunDirLight.shadowMaxZ = 220;
      world.sunDirLight.orthoLeft = -65;
      world.sunDirLight.orthoRight = 65;
      world.sunDirLight.orthoTop = 65;
      world.sunDirLight.orthoBottom = -65;
    }
    if (world.sunPointLight) world.sunPointLight.intensity = 0.0;
    if (world.hemiLight) {
      world.hemiLight.intensity = isTwilight ? 0.36 : 0.65;
      world.hemiLight.diffuse = BABYLON.Color3.FromHexString(isTwilight ? '#4c6d8e' : '#7ea6c8');
      world.hemiLight.groundColor = BABYLON.Color3.FromHexString(isTwilight ? '#182022' : '#263226');
    }
    scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
    scene.fogColor = BABYLON.Color3.FromHexString(isTwilight ? '#3a4a58' : '#6f848a');
    scene.fogDensity = isTwilight ? 0.0052 : 0.0040;
    camera.maxZ = 1200;

    // Hide space dust, space skybox, and orbital planets in coastal diorama
    for (const d of speedDust) d.setEnabled(false);
    if (world.skybox) world.skybox.setEnabled(false);
    if (world.starfield) world.starfield.setEnabled(false);
    if (world.planets) for (const p of world.planets) p.group?.setEnabled(false);
    if (asteroidBase?.group) asteroidBase.group.setEnabled(false);

    const padWorld = bc.origin.add(bc.padLocalPos);
    ship.undockFromAsteroid();
    ship.group.position.copyFrom(padWorld).addInPlace(new BABYLON.Vector3(0, 0.72, 0));
    ship.group.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(-Math.PI * 0.58, 0, 0);
    for (const m of ship.group.getChildMeshes()) {
      m.receiveShadows = true;
      if (world.shadowGenerator) world.shadowGenerator.addShadowCaster(m, false);
    }

    if (shotMode === 'bench_shore') {
      player.boardShip();
      controlMode = 'drive';
      ui.setMode('drive');
      camera.position.copyFrom(padWorld).addInPlace(new BABYLON.Vector3(10.5, 4.8, 10.5));
      camera.upVector.set(0, 1, 0);
      camera.setTarget(padWorld.add(new BABYLON.Vector3(-3.5, 1.4, -1.5)));
      camera.fov = 0.88;
    } else if (shotMode === 'bench_forest') {
      const fpWorld = bc.origin.add(bc.forestPlayerLocalPos);
      player.dockedBody = null;
      player.group.setEnabled(true);
      player.group.position.copyFrom(fpWorld);
      player.group.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(Math.PI * 0.25, 0, 0);
      controlMode = 'foot';
      ui.setMode('foot');
      // Full-body front-three-quarter view in forest
      camera.position.copyFrom(fpWorld).addInPlace(new BABYLON.Vector3(-2.6, 1.35, -2.5));
      camera.upVector.set(0, 1, 0);
      camera.setTarget(fpWorld.add(new BABYLON.Vector3(0.0, 0.95, 0.0)));
      camera.fov = 0.78;
    } else if (shotMode === 'bench_forest_top') {
      const fpWorld = bc.origin.add(bc.forestPlayerLocalPos);
      controlMode = 'foot';
      ui.setMode('foot');
      camera.position.copyFrom(fpWorld).addInPlace(new BABYLON.Vector3(-14, 34, 18));
      camera.upVector.set(0, 1, 0);
      camera.setTarget(fpWorld.add(new BABYLON.Vector3(6, 0, -2)));
      camera.fov = 0.90;
    } else if (shotMode === 'bench_forest_closeup') {
      const fpWorld = bc.origin.add(bc.forestPlayerLocalPos);
      controlMode = 'foot';
      ui.setMode('foot');
      // Close-up of tree trunk roots, mossy ground, ferns & grass tufts
      const targetPt = bc.origin.add(new BABYLON.Vector3(21, bc.getHeight(21, 14), 14));
      camera.position.copyFrom(targetPt).addInPlace(new BABYLON.Vector3(-3.8, 1.35, -3.5));
      camera.upVector.set(0, 1, 0);
      camera.setTarget(targetPt.add(new BABYLON.Vector3(0.5, 0.9, 0.5)));
      camera.fov = 0.78;
    } else if (shotMode === 'bench_coast_ground') {
      controlMode = 'foot';
      ui.setMode('foot');
      const gPt = bc.origin.add(new BABYLON.Vector3(-4.0, bc.getHeight(-4.0, 14.0), 14.0));
      camera.position.copyFrom(gPt).addInPlace(new BABYLON.Vector3(0.0, 2.0, 0.0));
      camera.upVector.set(0, 1, 0);
      camera.setTarget(bc.origin.add(new BABYLON.Vector3(-22.0, 1.2, -10.0)));
      camera.fov = 0.88;
    } else if (shotMode === 'bench_ocean_low') {
      controlMode = 'aircraft';
      ui.setMode('aircraft');
      camera.position.copyFrom(bc.origin).addInPlace(new BABYLON.Vector3(-42, 18, 28));
      camera.upVector.set(0, 1, 0);
      camera.setTarget(bc.origin.add(new BABYLON.Vector3(4, 2, -6)));
      camera.fov = 0.88;
    } else if (shotMode === 'bench_shore_closeup') {
      controlMode = 'foot';
      ui.setMode('foot');
      const sPt = bc.origin.add(new BABYLON.Vector3(-5.0, 1.8, -14.0));
      camera.position.copyFrom(sPt);
      camera.upVector.set(0, 1, 0);
      camera.setTarget(bc.origin.add(new BABYLON.Vector3(-12.0, 0.1, -6.0)));
      camera.fov = 0.82;
    } else {
      // bench_forest_back: back view while walking
      const fpWorld = bc.origin.add(bc.forestPlayerLocalPos);
      player.dockedBody = null;
      player.group.setEnabled(true);
      player.group.position.copyFrom(fpWorld);
      player.group.rotationQuaternion = BABYLON.Quaternion.RotationYawPitchRoll(-Math.PI * 0.42, 0, 0);
      controlMode = 'foot';
      ui.setMode('foot');
      camera.position.copyFrom(fpWorld).addInPlace(new BABYLON.Vector3(3.2, 1.85, 2.2));
      camera.upVector.set(0, 1, 0);
      camera.setTarget(fpWorld.add(new BABYLON.Vector3(-4.0, 1.1, -1.4)));
      camera.fov = 0.85;
    }

    window.__benchReady = false;
    Promise.all([bc.loadAssets(), player.readyPromise || Promise.resolve()]).then(() => {
      if (player.skeletalRoot) {
        for (const m of player.skeletalRoot.getChildMeshes()) {
          m.receiveShadows = true;
          if (world.shadowGenerator) world.shadowGenerator.addShadowCaster(m, false);
        }
        if (shotMode === 'bench_forest_back') {
          player.setAnimState('Walk');
          player.animGroups.Walk?.goToFrame(12);
        }
      }
      window.__benchReady = true;
      document.body.setAttribute('data-bench-ready', '1');
    });
  }
}

if (shotMode && worldMode === 'sky') {
  const aspect=engine.getAspectRatio(camera);
  if(aspect<1.25){camera.fovMode=BABYLON.Camera.FOVMODE_HORIZONTAL_FIXED;camera.fov=Math.min(1.35,camera.fov*1.25);}
}
if (shotMode && urlParams.get('hud') === '0') ui.showHUD(false);

async function startRun(seedStr) {
  const generation = ++runGeneration;
  audio.init();
  initWorld(seedStr);
  menuOverlay.style.display = 'none';
  defeatModal.style.display = 'none';
  victoryModal.style.display = 'none';
  mapModal.style.display = 'none';
  pauseModal.style.display = 'none';
  ui.showHUD(false);
  gameState = 'loading';
  if (prologue) {
    document.body.classList.add('in-prologue');
    prologue.showLoading();
  }
  await Promise.allSettled([ship.readyPromise, player.readyPromise, world.landmarks?.readyPromise, world.fleet?.readyPromise, world.bakedLighting?.readyPromise, ...world.islands?.map(i=>i.readyPromise) || []]);
  if (generation !== runGeneration) return;
  // Texture upload/shader compilation completes before the opening's clock starts.
  await scene.whenReadyAsync();
  if (generation !== runGeneration) return;
  // The menu's Enter/Space must never skip the opening or fire on handoff.
  ship.keys = {};
  gameState = 'playing';
  ui.showHUD(!prologue);
  if (prologue) prologue.frame(0);
}

function finishPrologue() {
  if (!demoState || demoState.stage !== 'intro_cutscene') return;
  demoState.stage = 'tutorial_flight';
  demoState.tutorialTimer = 0;
  introSkipRequested = false;
  ship.keys = {};
  ship.camInited = false;
  prologue?.hide();
  document.body.classList.remove('in-prologue');
  ui.showHUD(true);
  ui.showToast('W/S — тяга · A/D — поворот · ↑/↓ — высота · Shift — форсаж', 6500);
}

document.getElementById('prologue-skip').addEventListener('click', () => { introSkipRequested = true; });
window.addEventListener('keydown', (e) => {
  if (gameState === 'playing' && demoState?.stage === 'intro_cutscene' && (e.code === 'Space' || e.code === 'Enter') && !e.repeat) {
    e.preventDefault();
    introSkipRequested = true;
  }
});

function switchDeviceTab(tabName) {
  const panes = { map: 'pane-map', settings: 'pane-settings', controls: 'pane-controls' };
  const tabs = { map: 'tab-map-btn', settings: 'tab-settings-btn', controls: 'tab-controls-btn' };
  const titles = {
    map: 'ШТУРМАНСКИЙ ПЛАНШЕТ',
    settings: 'РАДИО И ПРИБОРЫ',
    controls: 'ЛЁТНАЯ ПАМЯТКА',
  };
  for (const k of Object.keys(panes)) {
    const pEl = document.getElementById(panes[k]);
    const tEl = document.getElementById(tabs[k]);
    if (pEl) pEl.style.display = k === tabName ? (k === 'map' ? 'flex' : 'flex') : 'none';
    if (pEl && k !== 'map') pEl.classList.toggle('active', k === tabName);
    if (tEl) tEl.classList.toggle('active', k === tabName);
  }
  const titleEl = document.getElementById('device-title');
  if (titleEl) titleEl.textContent = titles[tabName] || titles.map;
}

function openDeviceModal(tabName = 'map', returnState = 'playing') {
  modalReturnState = returnState;
  gameState = 'map';
  ui.showHUD(false);
  if (world && ship) ui.renderChart(world, ship, asteroidBase);
  switchDeviceTab(tabName);
  mapModal.style.display = 'flex';
}

function closeDeviceModal() {
  mapModal.style.display = 'none';
  gameState = modalReturnState;
  ui.showHUD(gameState === 'playing');
}

document.getElementById('tab-map-btn').addEventListener('click', () => switchDeviceTab('map'));
document.getElementById('tab-settings-btn').addEventListener('click', () => switchDeviceTab('settings'));
document.getElementById('tab-controls-btn').addEventListener('click', () => switchDeviceTab('controls'));

document.getElementById('start-btn').addEventListener('click', () => startRun(seedInput.value));
document.getElementById('hangar-start-btn').addEventListener('click',async()=>{
  const generation=runGeneration+1;await startRun(seedInput.value);if(generation!==runGeneration)return;
  demoState.freeFlight=true;demoState.powerOn=true;demoState.stage='free_flight';prologue?.hide();document.body.classList.remove('in-prologue');
  construction.stage=null;construction.addSalvage(40);for(const [i,type]of ['generator','turret','radar'].entries())construction.build(type,i);
  world.fleet.parkActive(ship);player.placeOnAsteroid(asteroidBase,new BABYLON.Vector3(-18,3.38,10));controlMode='foot';ui.setMode('foot');ui.showHUD(true);
  ui.showRadio('dispatcher','Эскадрилья готова: грузовой, истребитель, штурмовик и бомбардировщик. Подойди к машине и нажми E. Для каждого борта — своё задание.',7500);
});
document.getElementById('menu-settings-btn').addEventListener('click', () => openDeviceModal('settings', 'menu'));
document.getElementById('menu-controls-btn').addEventListener('click', () => openDeviceModal('controls', 'menu'));

document.getElementById('close-map-btn').addEventListener('click', closeDeviceModal);
document.getElementById('chart-canvas').addEventListener('click', (e) => {
  if (gameState !== 'map' || !world || !asteroidBase) return;
  const c = e.currentTarget;
  const rect = c.getBoundingClientRect();
  const mx = ((e.clientX - rect.left) / rect.width) * c.width;
  const my = ((e.clientY - rect.top) / rect.height) * c.height;
  const cx = c.width / 2;
  const cy = c.height / 2;
  const scale = 0.72;
  let bestP = null;
  let bestD = 26;
  for (const p of world.planets) {
    const px = cx + p.group.position.x * scale;
    const py = cy + p.group.position.z * scale;
    const d = Math.hypot(mx - px, my - py);
    if (d < bestD) {
      bestD = d;
      bestP = p;
    }
  }
  if (bestP) {
    asteroidBase.setTargetPlanet(bestP);
    ui.showToast(`Курс базы «Бродяга»: ${bestP.name}`, 3200);
    mapModal.style.display = 'none';
    gameState = modalReturnState;
  }
});

// Settings controls
document.querySelectorAll('#quality-seg .seg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#quality-seg .seg-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    selectedQuality=btn.dataset.val;
    if (world && world.graphics) world.graphics.applyQuality(selectedQuality, world.shadowGenerator);
  });
});
document.querySelectorAll('#hud-scale-seg .seg-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('#hud-scale-seg .seg-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    ui.setHudScale(parseFloat(btn.dataset.val) || 1);
  });
});
const invertPitchBtn = document.getElementById('invert-pitch-btn');
let invertPitch = false;
invertPitchBtn.addEventListener('click', () => {
  invertPitch = !invertPitch;
  invertPitchBtn.textContent = invertPitch ? 'Вкл' : 'Выкл';
  invertPitchBtn.classList.toggle('active', invertPitch);
  window.__invertPitch = invertPitch;
});
const soundToggleBtn = document.getElementById('sound-toggle-btn');
let soundOn = true;
soundToggleBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  soundToggleBtn.textContent = soundOn ? 'Вкл' : 'Выкл';
  soundToggleBtn.classList.toggle('active', soundOn);
  audio?.setMuted?.(!soundOn);
});

document.getElementById('map-hud-btn').addEventListener('click', () => openDeviceModal('map', 'playing'));
document.getElementById('help-hud-btn').addEventListener('click', () => openDeviceModal('controls', 'playing'));

document.getElementById('retry-same-seed-btn').addEventListener('click', () => startRun(currentSeed));
document.getElementById('new-seed-defeat-btn').addEventListener('click', () => startRun(generateRandomSeed()));
document.getElementById('new-seed-victory-btn').addEventListener('click', () => startRun(generateRandomSeed()));
document.getElementById('menu-victory-btn').addEventListener('click', () => {
  victoryModal.style.display = 'none';
  ui.showHUD(false);
  menuOverlay.style.display = 'flex';
  gameState = 'menu';
});

function togglePause() {
  if (gameState === 'playing') {
    gameState = 'paused';
    ui.showHUD(false);
    pauseModal.style.display = 'flex';
  } else if (gameState === 'paused') {
    pauseModal.style.display = 'none';
    gameState = 'playing';
    ui.showHUD(true);
  }
}
document.getElementById('pause-hud-btn').addEventListener('click', togglePause);
document.getElementById('resume-btn').addEventListener('click', togglePause);
document.getElementById('pause-map-btn').addEventListener('click', () => {
  pauseModal.style.display = 'none';
  openDeviceModal('map', 'playing');
});
document.getElementById('pause-settings-btn').addEventListener('click', () => {
  pauseModal.style.display = 'none';
  openDeviceModal('settings', 'paused');
});
document.getElementById('pause-restart-btn').addEventListener('click', () => {
  pauseModal.style.display = 'none';
  startRun(currentSeed);
});
document.getElementById('pause-menu-btn').addEventListener('click', () => {
  pauseModal.style.display = 'none';
  ui.showHUD(false);
  menuOverlay.style.display = 'flex';
  gameState = 'menu';
});

// Keyboard navigation for Main Menu
let menuFocusIdx = 0;
const menuBtns = Array.from(document.querySelectorAll('#menu-nav .menu-item'));
function setMenuFocus(idx) {
  menuFocusIdx = (idx + menuBtns.length) % menuBtns.length;
  menuBtns.forEach((b, i) => b.classList.toggle('selected', i === menuFocusIdx));
}
window.addEventListener('keydown', (e) => {
  if (gameState === 'menu' && document.activeElement !== seedInput) {
    if (e.code === 'ArrowDown' || e.code === 'KeyS') {
      e.preventDefault();
      setMenuFocus(menuFocusIdx + 1);
    } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
      e.preventDefault();
      setMenuFocus(menuFocusIdx - 1);
    } else if (e.code === 'Enter' || e.code === 'Space') {
      e.preventDefault();
      menuBtns[menuFocusIdx]?.click();
    }
    return;
  }
  if (e.code === 'F1') {
    e.preventDefault();
    if (gameState === 'playing') openDeviceModal('controls', 'playing');
    else if (gameState === 'map') closeDeviceModal();
  }
});

window.addEventListener('resize', () => engine.resize());

canvas.addEventListener('mousedown', () => {
  if (gameState === 'playing') audio.init();
});

window.addEventListener('keydown', (e) => {
  if (gameState === 'menu' || gameState === 'defeat' || gameState === 'victory') return;

  if (e.code === 'Escape') {
    e.preventDefault();
    if (gameState === 'map') {
      closeDeviceModal();
    } else {
      togglePause();
    }
    return;
  }

  if (e.code === 'KeyM' || e.code === 'Tab') {
    e.preventDefault();
    if (gameState === 'playing') {
      openDeviceModal('map', 'playing');
    } else if (gameState === 'map') {
      closeDeviceModal();
    }
  }

  if (gameState !== 'playing' || demoState?.stage === 'intro_cutscene' || construction?.isOpen) return;
  if (e.code === 'KeyB' && controlMode === 'foot' && demoState?.powerOn) {
    openConstruction();
    return;
  }

  if (!demoState && e.code === 'KeyV' && ship && typeof ship.setVariant === 'function') {
    const variants = ['cargo', 'fighter', 'bomber', 'attacker'];
    const labels = { cargo: 'Грузовой', fighter: 'Истребитель', bomber: 'Бомбардировщик', attacker: 'Штурмовик' };
    const next = variants[(variants.indexOf(ship.variant) + 1) % variants.length];
    ship.setVariant(next);
    ui.showToast(`✈️ Самолёт из ангара: ${labels[next]}`, 2000);
  }

  if (e.code === 'KeyG' && (!demoState || !['find_lever', 'build_generator', 'build_defense', 'board_fighter'].includes(demoState.stage))) {
    if (controlMode === 'asteroid') {
      player.placeOnAsteroid(asteroidBase, asteroidBase.helmLocalPos.add(new BABYLON.Vector3(0, 0, 1.5)));
      controlMode = 'foot';
      ui.setMode('foot');
      ui.showToast('🧭 Вы отошли от штурвала астероида «Бродяга»', 2200);
    } else if (controlMode === 'drive' || controlMode === 'water' || (controlMode === 'aircraft' && ship.dockedAsteroid)) {
      player.disembarkFromShip(ship);
      controlMode = 'foot';
      ui.setMode('foot');
      const placeName = ship.dockedAsteroid ? asteroidBase.name : (ship.dockedPlanet || ship.waterPlanet).name;
      ui.showToast(`🧭 Выход: ${placeName}`, 2200);
    } else if (controlMode === 'foot' && BABYLON.Vector3.Distance(player.group.position, ship.group.position) < 9.0) {
      player.boardShip();
      if (ship.dockedAsteroid) {
        controlMode = 'aircraft';
        ui.setMode('aircraft');
        ui.showToast('✈️ В кабине самолёта! [Space] или [E] — взлёт с астероида', 2200);
      } else {
        controlMode = ship.waterPlanet ? 'water' : 'drive';
        ui.setMode(controlMode);
        ui.showToast('🛞 В кабине самолёта! [Space] — взлёт', 2200);
      }
    }
  }

  if (e.code === 'KeyQ' && controlMode === 'foot') {
    player.scannerActive = !player.scannerActive;
  }

  if (e.code === 'KeyE' && nearestAction && !e.repeat) {
    nearestAction.execute();
  }
});

function updateInteractions() {
  nearestAction = null;

  if (demoState && missionInteraction()) return;
  if (controlMode === 'asteroid') {ui.setPrompt('[G] Вернуться в ангар'); return;}

  if (controlMode === 'aircraft') {
    if (ship.dockedAsteroid) {
      nearestAction = {
        label: 'W — разбег · ↑ / Space — отрыв · S — торможение',
        execute: () => {
          if(ship.undockFromAsteroid()!==false)ui.showToast('Отрыв от полосы',1800);
        },
      };
      return;
    }

    // Check docking back onto AsteroidBase landing pad / Vagabond runway (transformed into Vagabond's world matrix!)
    if (asteroidBase) {
      asteroidBase.group.computeWorldMatrix(true);
      const localPadPoint = demoState
        ? new BABYLON.Vector3(24, 4.2, 0)
        : asteroidBase.padLocalPos.clone();
      const runwayCenter = BABYLON.Vector3.TransformCoordinates(localPadPoint, asteroidBase.group.getWorldMatrix());
      const distPad = BABYLON.Vector3.Distance(ship.group.position, runwayCenter);
      const relPadSpeed = ship.velocity.subtract(asteroidBase.velocity).length();
      const isLandingPhase = Boolean(demoState && worldMode === 'sky' && !ship._runwayState);
      const dockRadius = isLandingPhase ? 100.0 : 11.0;
      const maxDockSpd = isLandingPhase ? 38.0 : 18.0;
      if (distPad < dockRadius && relPadSpeed < maxDockSpd) {
        const doLand = () => {
          ship.dockOnAsteroid(asteroidBase);
          audio?.playDock?.();
          world.fleet?.parkActive(ship);
          if (isLandingPhase) {
            player.placeOnAsteroid(asteroidBase);
            controlMode = 'foot';
            ui.setMode('foot');
            demoState.stage = demoState.freeFlight ? 'free_flight' : !demoState.powerOn ? 'find_lever' : demoState.kills >= demoState.totalEnemies ? 'take_helm' : 'board_fighter';
            const landingMsg = (demoState.freeFlight || demoState.stage === 'mission_complete')
              ? 'Посадка выполнена. Самолёт на стоянке в ангаре — можно сменить машину, починиться или выйти на палубу.'
              : demoState.kills >= demoState.totalEnemies
                ? 'С возвращением. Поднимайся на палубу: радар покажет безопасный сектор.'
                : !demoState.powerOn
                  ? 'Ты на месте! Остров обесточен. Включи аварийный рубильник у входа в ангар.'
                  : 'Отличная посадка! В ангаре доступны другие машины и верстак.';
            ui.showRadio('dispatcher', landingMsg, 5600);
          } else {
            ui.showToast('🪨 Стыковка с базой «Бродяга»! [G] — выйти на палубу.', 3200);
          }
        };
        if (isLandingPhase && distPad < 16.0 && relPadSpeed < 16) {
          doLand();
          return;
        }
        nearestAction = {
          label: isLandingPhase
            ? '[E] Сесть на ВПП острова «Бродяга»'
            : '[E] Стыковаться с посадочной площадкой базы',
          execute: doLand,
        };
        return;
      }
    }

    // Check landing zones on ForestIsland ("Изумрудный Утёс") & IndustrialIsland ("Ржавый Док")
    if (worldMode === 'sky' && world.islands) {
      for (const isl of world.islands) {
        if (!isl.landingZone || isl === asteroidBase || !isl.group) continue;
        isl.group.computeWorldMatrix(true);
        const lzWorld = BABYLON.Vector3.TransformCoordinates(isl.landingZone.localPos, isl.group.getWorldMatrix());
        const distLZ = BABYLON.Vector3.Distance(ship.group.position, lzWorld);
        const spdLZ = ship.velocity.length();
        if (distLZ < isl.landingZone.radius + 36) {
          if (spdLZ < 34) {
            nearestAction = {
              label: `[E] Сесть на «${isl.name}» (дозаправка и ремонт)`,
              execute: () => {
                ship.group.position.copyFrom(lzWorld).addInPlace(new BABYLON.Vector3(0, (ship.getGroundClearance?.() || 0.75) + 0.6, 0));
                ship.velocity.set(0, 0, 0);
                ship.throttle = 0;
                ship.fuel = ship.maxFuel;
                ship.hull = Math.min(ship.maxHull, ship.hull + 40);
                ship.recoilShake = Math.max(ship.recoilShake || 0, 0.22);
                audio?.playDock?.();
                ui.showToast(`🛬 Посадка на «${isl.name}» · топливо 100%, корпус +40! [W]/[Space] — взлёт`, 3600);
              },
            };
            return;
          } else {
            ui.setPrompt(`Снизьте скорость для посадки на «${isl.name}» (${Math.round(spdLZ)} / 34 у.е.)`);
            return;
          }
        }
      }
    }

    if (ship.nearPlanet) {
      ship.nearPlanet.discovered = true;
      const dist = BABYLON.Vector3.Distance(ship.group.position, ship.nearPlanet.group.position);
      const outDir = ship.group.position.subtract(ship.nearPlanet.group.position).normalize();
      const surfR = ship.nearPlanet.getSurfaceHeight ? ship.nearPlanet.getSurfaceHeight(outDir) : ship.nearPlanet.radius;
      const relSpeed = ship.velocity.subtract(ship.nearPlanet.velocity).length();
      if (dist < Math.max(ship.nearPlanet.radius, surfR) + 14) {
        if (relSpeed < 26) {
          nearestAction = {
            label: `[E] Выпустить шасси и сесть на «${ship.nearPlanet.name}»`,
            execute: () => {
              ship.dockOnPlanet(ship.nearPlanet);
              controlMode = 'drive';
              ui.setMode('drive');
              ui.showToast('🛞 Посадка! [WASD] — руление, [G] — выйти пешком, [Space] — взлёт', 3600);
            },
          };
        } else {
          ui.setPrompt(`Снизьте скорость для посадки (${Math.round(relSpeed)} / 26 у.е.)`);
          return;
        }
      }
    }
  } else if (controlMode === 'foot' && player.currentAsteroid) {
    const helmWorld = asteroidBase.group.position.add(asteroidBase.helmLocalPos);
    if (BABYLON.Vector3.Distance(player.group.position, ship.group.position) < 5.5) {
      nearestAction = {
        label: '[E] Сесть в самолёт «Бродяга»',
        execute: () => {
          player.boardShip();
          controlMode = 'aircraft';
          ui.setMode('aircraft');
          ui.showToast('✈️ За штурвалом! [Space] или [W] (разбег) — взлёт с астероида', 2800);
        },
      };
    } else if ((!demoState || ['take_helm', 'move_island', 'mission_complete'].includes(demoState.stage)) && BABYLON.Vector3.Distance(player.group.position, helmWorld) < 3.6) {
      nearestAction = {
        label: '[E] Встать за штурвал астероида-базы',
        execute: () => {
          player.boardShip();
          controlMode = 'asteroid';
          ui.setMode('asteroid');
          ui.showToast('🪨 Управление астероидом! [WASD] + [Space/C] — полёт, [G] — отойти', 3000);
        },
      };
    } else {
      const shopWorld = asteroidBase.group.position.add(asteroidBase.workshopLocalPos);
      if (BABYLON.Vector3.Distance(player.group.position, shopWorld) < 4.5 && (ship.fuel < 99 || ship.hull < 99)) {
        nearestAction = {
          label: '[E] Заправить самолёт и починить корпус в мастерской',
          execute: () => {
            ship.fuel = ship.maxFuel;
            ship.hull = ship.maxHull;
            audio.playUpgrade();
            ui.showToast('🔧 Самолёт полностью заправлен и отремонтирован!', 2600);
          },
        };
      }
    }
  } else if (controlMode === 'ship') {
    if (ship.nearPlanet) {
      ship.nearPlanet.discovered = true;
      const dist = BABYLON.Vector3.Distance(ship.group.position, ship.nearPlanet.group.position);
      const outDir = ship.group.position.subtract(ship.nearPlanet.group.position).normalize();
      const surfR = ship.nearPlanet.getSurfaceHeight ? ship.nearPlanet.getSurfaceHeight(outDir) : ship.nearPlanet.radius;
      const relSpeed = ship.velocity.subtract(ship.nearPlanet.velocity).length();
      if (dist < Math.max(ship.nearPlanet.radius, surfR) + 14) {
        if (relSpeed < 26) {
          const isWater = ship.nearPlanet.getSurfaceHeight && surfR < ship.nearPlanet.seaLevel - 0.35;
          nearestAction = {
            label: isWater
              ? `[E] Приводниться на океан «${ship.nearPlanet.name}»`
              : `[E] Выпустить шасси и сесть на «${ship.nearPlanet.name}»`,
            execute: () => {
              if (isWater) {
                ship.enterWater(ship.nearPlanet);
                controlMode = 'water';
                ui.setMode('water');
                ui.showToast('🌊 Приводнение! Идите под парусом к берегу или нажмите [G], чтобы плыть.', 3600);
              } else {
                ship.dockOn(ship.nearPlanet);
                controlMode = 'drive';
                ui.setMode('drive');
                ui.showToast('🛞 Посадка на колёса! [WASD] — езда, [G] — выйти пешком, [Space] — взлёт', 3600);
              }
            },
          };
        } else {
          ui.setPrompt(`Снизьте скорость для посадки (${Math.round(relSpeed)} / 26 у.е.)`);
          return;
        }
      }
    }
  } else if (controlMode === 'water') {
    const p = ship.waterPlanet;
    if (p && p.getSurfaceHeight) {
      const outDir = ship.group.position.subtract(p.group.position).normalize();
      const groundR = p.getSurfaceHeight(outDir);
      if (groundR > p.seaLevel - 0.5) {
        nearestAction = {
          label: '[E] Выпустить колёса и выехать на берег',
          execute: () => {
            ship.dockOn(p);
            controlMode = 'drive';
            ui.setMode('drive');
            ui.showToast('🛞 Выезд на берег! [G] — выйти в лес пешком.', 3000);
          },
        };
      }
    }
  } else {
    const actorPos = controlMode === 'drive' ? ship.group.position : player.group.position;
    const rangeBonus = controlMode === 'drive' ? 2.5 : 0;

    // TerrainPlanet Ancient Ruin interaction
    const tp = world.terrainPlanet;
    if (tp && !tp.ruinActivated && tp.ruinCrystal) {
      if (BABYLON.Vector3.Distance(actorPos, tp.ruinCrystal.getAbsolutePosition()) < 6.0 + rangeBonus) {
        nearestAction = {
          label: '[E] Исследовать Древний Резонатор в лесу',
          execute: () => {
            tp.ruinActivated = true;
            tp.ruinCrystalMat.diffuseColor = BABYLON.Color3.FromHexString('#f5c451');
            tp.ruinCrystalMat.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
            tp.mysteryNote = 'ОТКРЫТИЕ: Древний Резонатор настроен! Его импульс гармонизирует с океанскими волнами.';
            keysAttuned++;
            audio.playResonance();
            ui.showToast('📜 Запись в бортовой журнал: Древний Резонатор Предтеч изучен!', 4500);
          },
        };
      }
    }

    for (const rf of world.refuelNodes) {
      if (BABYLON.Vector3.Distance(actorPos, rf.group.getAbsolutePosition()) < 6.5 + rangeBonus && ship.fuel < 99.5) {
        nearestAction = {
          label: '[E] Пополнить топливо самолёта (+100%)',
          execute: () => {
            ship.refuel(100);
            questRefueled = true;
            audio.playUpgrade();
            ui.showToast('⛽ Топливные баки самолёта полностью заправлены!', 2600);
          },
        };
        break;
      }
    }

    for (const ob of world.obelisks) {
      if (ob.activated) continue;
      if (BABYLON.Vector3.Distance(actorPos, ob.group.getAbsolutePosition()) < 5.8 + rangeBonus) {
        nearestAction = {
          label: `[E] Настроить ${ob.label}`,
          execute: () => {
            ob.activated = true;
            ob.crystalMat.diffuseColor = BABYLON.Color3.FromHexString('#f5c451');
            ob.crystalMat.emissiveColor = BABYLON.Color3.FromHexString('#ff9900');
            keysAttuned++;
            audio.playResonance();
            if (keysAttuned >= 3) {
              world.unlockGate();
              ui.showToast('✨ ВСЕ 3 КЛЮЧА НАСТРОЕНЫ! Врата Перехода открыты!', 4500);
            } else {
              ui.showToast(`🔑 Резонансный Ключ получен (${keysAttuned}/3)!`, 3200);
            }
          },
        };
        break;
      }
    }

    if (!nearestAction) {
      for (const u of world.upgrades) {
        if (u.collected) continue;
        if (BABYLON.Vector3.Distance(actorPos, u.mesh.getAbsolutePosition()) < 4.8 + rangeBonus) {
          nearestAction = {
            label: `[E] Установить модуль: ${u.data.icon} ${u.data.name}`,
            execute: () => {
              u.collected = true;
              u.mesh.setEnabled(false);
              ship.upgrades.add(u.data.id);
              audio.playUpgrade();
              ui.showToast(`${u.data.icon} ${u.data.name}: ${u.data.desc}`, 4200);
            },
          };
          break;
        }
      }
    }

    if (!nearestAction) {
      for (const g of world.geysers || []) {
        if (g.cooldown > 0) continue;
        if (BABYLON.Vector3.Distance(actorPos, g.group.getAbsolutePosition()) < 4.8 + rangeBonus) {
          nearestAction = {
            label: '[E] Зарядить Эфир и починить корпус у гейзера',
            execute: () => {
              g.cooldown = 25;
              ship.fuel = ship.maxFuel;
              ship.hull = Math.min(ship.maxHull, ship.hull + 35);
              audio.playUpgrade();
              ui.showToast('🔋 Эфир 100% и корпус отремонтирован (+35%)!', 2800);
            },
          };
          break;
        }
      }
    }

    if (!nearestAction && controlMode === 'foot' && BABYLON.Vector3.Distance(actorPos, ship.group.position) < 7.5) {
      nearestAction = {
        label: '[E] Сесть в самолёт «Бродяга»',
        execute: () => {
          player.boardShip();
          controlMode = ship.waterPlanet ? 'water' : 'drive';
          ui.setMode(controlMode);
        },
      };
    }
  }

  ui.setPrompt(nearestAction ? nearestAction.label : null);
}

function openConstruction() {
  if (!construction || controlMode !== 'foot' || !demoState?.powerOn) return;
  ship.keys = {};
  player.keys = {};
  ui.setPrompt(null);
  construction.open();
}

async function boardFleetAircraft(aircraft){
  if(demoState.boardingFighter)return;
  const generation=runGeneration;demoState.boardingFighter=true;ship.keys={};player.keys={};
  ui.showToast(`Готовим ${aircraft.name} к вылету…`,2000);
  const curtain=document.createElement('div');curtain.setAttribute('role','status');curtain.style.cssText='position:fixed;inset:0;z-index:150;display:grid;place-content:center;background:#111812;color:#eedbab;font:600 18px monospace;letter-spacing:.12em;text-align:center;opacity:0;transition:opacity .18s;pointer-events:none';curtain.textContent=`ПРЕДПОЛЁТНАЯ ПОДГОТОВКА · ${aircraft.name.toUpperCase()}`;document.body.append(curtain);requestAnimationFrame(()=>curtain.style.opacity='1');
  try {
    const transitionReady=new Promise(resolve=>setTimeout(resolve,300));
    ship.setVariant(aircraft.variant);await Promise.all([ship.readyPromise,transitionReady]);
    if(generation!==runGeneration||scene.isDisposed)return;
    world.fleet.setActiveVariant(aircraft.variant);ship.hull=ship.maxHull;ship.fuel=ship.maxFuel;
    ship.positionForTakeoff(asteroidBase,{x:8,y:3.38,z:0});ship.camInited=false;
    player.boardShip();controlMode='aircraft';ui.setMode('aircraft');
    if(aircraft.variant==='fighter'&&!demoState.freeFlight&&demoState.kills<demoState.totalEnemies){
      world.jobs.cancel();demoState.stage='combat';if(!demoState.combatStarted){spawnEnemySquadron(asteroidBase.group.position);demoState.combatStarted=true;}
      ui.showRadio('dispatcher','«Оса» на полосе. W — разбег, ↑ — плавный отрыв. Перехвати разведчика: Space — пушки, F — ракета.',6500);
    }else{world.jobs.start(aircraft.variant);ui.showRadio('dispatcher',`${aircraft.name}. W — разбег, ↑ — отрыв. Задание и цель — на приборах.`,6000);}
    ship.keys={};
  } finally {
    if (demoState) demoState.boardingFighter = false;
    curtain.style.opacity='0';setTimeout(()=>curtain.remove(),220);
  }
}

function deckPoint(x, y, z) {
  asteroidBase.group.computeWorldMatrix(true);
  return BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(x, y, z), asteroidBase.group.getWorldMatrix());
}

function missionInteraction() {
  if (controlMode !== 'foot' || !player.currentAsteroid) return false;
  const near = (p, r = 4.5) => BABYLON.Vector3.Distance(player.group.position, p) < r;
  const action = (label, execute) => {
    nearestAction = {label, execute}; ui.setPrompt(label); return true;
  };
  const stage = demoState.stage;
  if (stage === 'find_lever' && near(demoState.leverNode.getAbsolutePosition())) {
    return action('[E] Включить аварийное питание', () => {
      demoState.powerOn = true;
      demoState.stage = 'build_generator';
      demoState.leverBeaconMat.emissiveColor = BABYLON.Color3.FromHexString('#45df9a');
      audio.playUpgrade();
      ui.showRadio('dispatcher', 'Аварийное питание есть. Основной генератор потерян. Поднимайся грузовым лифтом и поставь новый: в запасе 80 единиц лома.', 6500);
    });
  }
  const onUpper = player.localPos.y > 14;
  const liftPoint = onUpper ? deckPoint(-8, 21.73, 6.5) : deckPoint(-8, 3.38, 6.5);
  if (near(liftPoint, 5)) {
    return action(onUpper ? '[E] Спуститься в ангар' : '[E] Подняться на строительную палубу', () => {
      player.placeOnAsteroid(asteroidBase, new BABYLON.Vector3(-8, onUpper ? 3.38 : 21.73, 6.5));
      player.camInited = false;
    });
  }
  if (['build_generator', 'build_defense', 'build_radar'].includes(stage) && onUpper) {
    return action('[E] / [B] Строительство: выбрать площадку и подтвердить', openConstruction);
  }
  if(demoState.powerOn && construction.snapshot.generators>0 && construction.snapshot.turrets>0 && player.localPos.y<14 && !demoState.boardingFighter){
    const aircraft=world.fleet?.nearest(player.group.position);
    if(aircraft)return action(`[E] ${aircraft.name} · ${aircraft.role}`,()=>boardFleetAircraft(aircraft));
  }
  // Hangar Rear Workbench: Spend salvage to upgrade fleet armor, engines & cannons!
  if (player.localPos.y < 14 && near(deckPoint(-35.5, 3.38, 10.0), 6.2)) {
    demoState.upgrades ||= { armor: 0, engine: 0, guns: 0 };
    const u = demoState.upgrades;
    const nextUpg = u.armor < 2
      ? { key: 'armor', name: 'Усиленная броня (+25%)', cost: 30 }
      : u.engine < 2
        ? { key: 'engine', name: 'Форсаж двигателей (+14%)', cost: 35 }
        : u.guns < 2
          ? { key: 'guns', name: 'Скорострельные пушки (+20%)', cost: 40 }
          : null;
    if (nextUpg) {
      return action(`[E] Верстак: ${nextUpg.name} (${nextUpg.cost} лома)`, () => {
        if ((construction?.salvage || 0) < nextUpg.cost) {
          ui.showToast(`Недостаточно лома (нужно ${nextUpg.cost}, есть ${construction?.salvage || 0})`, 2200);
          return;
        }
        construction.salvage -= nextUpg.cost;
        u[nextUpg.key]++;
        if (nextUpg.key === 'armor') {
          ship.maxHull = Math.round((ship.maxHull || ship.spec?.maxHull || 100) * 1.25);
          ship.hull = ship.maxHull;
        } else if (nextUpg.key === 'engine' && ship.spec) {
          ship.spec = { ...ship.spec, maxSpeed: ship.spec.maxSpeed * 1.14, boostSpeed: ship.spec.boostSpeed * 1.14, accel: ship.spec.accel * 1.15 };
        } else if (nextUpg.key === 'guns' && ship.spec) {
          ship.spec = { ...ship.spec, gunCd: Math.max(0.06, ship.spec.gunCd * 0.82), gunSpeed: ship.spec.gunSpeed * 1.12 };
        }
        audio?.playUpgrade?.();
        ship.applyVisualUpgrades?.(u);
        ui.showToast(`🔧 Установлено: ${nextUpg.name}!`, 2800);
      });
    } else {
      return action('[E] Верстак: полный ремонт и заправка', () => {
        ship.hull = ship.maxHull || ship.spec?.maxHull || 100;
        ship.fuel = 100;
        audio?.playUpgrade?.();
        ui.showToast('🔧 Борт полностью отремонтирован и заправлен!', 2400);
      });
    }
  }
  if (stage === 'take_helm' && near(deckPoint(-2.6, 3.38, -2.4), 5)) {
    return action('[E] Встать за штурвал острова', () => {
      player.boardShip(); controlMode = 'asteroid'; ui.setMode('asteroid');
      demoState.stage = 'move_island';
      ui.showRadio('dispatcher', 'Теперь остров твой. W — ход, A/D — курс, S — торможение. Доведи «Бродягу» в безопасный сектор по компасу и останови.', 7000);
    });
  }
  // Keep lesson actions ahead of generic boarding and service prompts.
  if (['find_lever', 'build_generator', 'build_defense', 'board_fighter', 'build_radar'].includes(stage)) {
    ui.setPrompt(null); return true;
  }
  return false;
}

function distanceToSegment(point, a, b) {
  if (!a) return BABYLON.Vector3.Distance(point,b);
  const segment=b.subtract(a), length=segment.lengthSquared();
  const t=length>0 ? Math.max(0,Math.min(1,BABYLON.Vector3.Dot(point.subtract(a),segment)/length)) : 0;
  return BABYLON.Vector3.Distance(point,a.add(segment.scale(t)));
}

function missionEnemyDown(enemy) {
  if (!enemy.alive) return;
  enemy.alive = false;
  spawnDemoExplosion(enemy.root.position, enemy.variant === 'bomber' ? 2.1 : 1.5);
  enemy.marker?.dispose?.();
  enemy.damageTrail?.dispose?.();
  enemy.damageTrail = null;

  // Turn downed aircraft into a burning, spinning wreck + break-apart flaming debris instead of vanishing!
  demoState.fallingWrecks ||= [];
  demoState.fallingDebris ||= [];
  if (!demoState._wreckFireMat || demoState._wreckFireMat.isDisposed) {
    demoState._wreckFireMat = new BABYLON.StandardMaterial('wreckFireSharedMat', scene);
    demoState._wreckFireMat.emissiveColor = BABYLON.Color3.FromHexString('#ff6e1a');
    demoState._wreckFireMat.disableLighting = true;
  }
  if (!demoState._wreckSmokeMat || demoState._wreckSmokeMat.isDisposed) {
    demoState._wreckSmokeMat = new BABYLON.StandardMaterial('wreckSmokeSharedMat', scene);
    demoState._wreckSmokeMat.emissiveColor = BABYLON.Color3.FromHexString('#3b2c22');
    demoState._wreckSmokeMat.disableLighting = true;
    demoState._wreckSmokeMat.backFaceCulling = false;
    demoState._wreckSmokeMat.alpha = 0.72;
  }
  if (!demoState._debrisMat || demoState._debrisMat.isDisposed) {
    demoState._debrisMat = new BABYLON.StandardMaterial('wreckDebrisSharedMat', scene);
    demoState._debrisMat.diffuseColor = BABYLON.Color3.FromHexString('#38312b');
    demoState._debrisMat.emissiveColor = BABYLON.Color3.FromHexString('#7a2c0c');
  }

  // Spawn 6 spinning structural debris chunks (wing panels, tail pieces, cowling)
  const chunkCount = enemy.variant === 'bomber' ? 8 : 6;
  for (let ci = 0; ci < chunkCount; ci++) {
    const chunk = BABYLON.MeshBuilder.CreateBox(`wreckDebris_${Date.now()}_${ci}`, {
      width: 0.7 + Math.random() * 1.4,
      height: 0.18 + Math.random() * 0.35,
      depth: 0.9 + Math.random() * 1.8,
    }, scene);
    chunk.position.copyFrom(enemy.root.position).addInPlace(new BABYLON.Vector3(
      (Math.random() - 0.5) * 4.5,
      (Math.random() - 0.5) * 2.5,
      (Math.random() - 0.5) * 4.5
    ));
    chunk.material = demoState._debrisMat;
    chunk.isPickable = false;
    let dTrail = null;
    if (ci < 3 && typeof BABYLON.TrailMesh === 'function') {
      dTrail = new BABYLON.TrailMesh(`debrisTrail_${Date.now()}_${ci}`, chunk, scene, 0.35, 18, true);
      dTrail.material = demoState._wreckSmokeMat;
      dTrail.isPickable = false;
    }
    const burst = new BABYLON.Vector3((Math.random() - 0.5) * 34, 4 + Math.random() * 14, (Math.random() - 0.5) * 34);
    demoState.fallingDebris.push({
      mesh: chunk,
      trail: dTrail,
      vel: (enemy.velocity ? enemy.velocity.scale(0.65) : BABYLON.Vector3.Zero()).add(burst),
      rotVel: new BABYLON.Vector3((Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 9),
      life: 2.8 + Math.random() * 1.6,
    });
  }

  // Attach engine fire core + thick smoke trail to the main airframe for a dramatic death spiral
  const fireCore = BABYLON.MeshBuilder.CreateSphere('wreckFireCore', { diameter: enemy.variant === 'bomber' ? 2.4 : 1.7, segments: 8 }, scene);
  fireCore.parent = enemy.root;
  fireCore.position.set(0, 0.3, 0);
  fireCore.material = demoState._wreckFireMat;
  fireCore.isPickable = false;
  let wreckTrail = null;
  if (typeof BABYLON.TrailMesh === 'function') {
    wreckTrail = new BABYLON.TrailMesh(`wreckTrail_${Date.now()}`, fireCore, scene, enemy.variant === 'bomber' ? 1.35 : 0.95, 42, true);
    wreckTrail.material = demoState._wreckSmokeMat;
    wreckTrail.isPickable = false;
  }
  demoState.fallingWrecks.push({
    root: enemy.root,
    fireCore,
    trail: wreckTrail,
    vel: (enemy.velocity ? enemy.velocity.scale(0.85) : new BABYLON.Vector3(0, 0, 12)).add(new BABYLON.Vector3(0, -4, 0)),
    spin: new BABYLON.Vector3(-1.35 - Math.random() * 0.7, (Math.random() - 0.5) * 1.4, (Math.random() < 0.5 ? -1 : 1) * (3.6 + Math.random() * 2.2)),
    life: 3.8 + Math.random() * 1.1,
    blastCd: 0.45,
    isBomber: enemy.variant === 'bomber',
  });

  demoState.kills++;
  construction.addSalvage(20);
  audio.playExplosion(enemy.variant === 'bomber' ? 1.0 : 0.8);
  if (demoState.kills === 1 && demoState.combatWave === 0) {
    demoState.combatWave = 1;
    spawnEnemySquadron(asteroidBase.group.position, true);
    ui.showRadio('dispatcher', 'Попадание! Теперь пара сопровождения. Следи за трассерами, меняй высоту и заходи им в хвост.', 5800);
  }
  if (demoState.kills >= demoState.totalEnemies) {
    demoState.stage = 'return_to_base';
    ui.showToast('Небо чистое · 3/3 · +20 лома', 4500);
    ui.showRadio('dispatcher', 'Небо чистое. Лом с обломков доставлен на остров. Возвращайся: установим радар и уведём базу из опасного сектора.', 6800);
  } else ui.showToast(`Цель сбита · ${demoState.kills}/${demoState.totalEnemies} · +20 лома`, 2800);
}

function updateMission(dt) {
  if (!demoState || freezeCameraForShot) return;
  const state = construction.snapshot;
  if (!demoState.seenShipyard && world.landmarks && ['tutorial_flight','archipelago_flyby'].includes(demoState.stage) && BABYLON.Vector3.Distance(ship.group.position,world.landmarks.root.position)<230) {
    demoState.seenShipyard=true;
    ui.showRadio('dispatcher','Старая верфь по левому борту. После раскола там никто не садится. Держи курс на наш ангар — полоса уже близко.',6500);
  }
  if (demoState.stage !== 'mission_complete') ship.fuel = Math.max(25, ship.fuel);
  if (demoState.stage === 'build_generator' && state.generators > 0) {
    demoState.stage = 'build_defense';
    ui.showRadio('dispatcher', 'Генератор запущен: четыре единицы энергии. Поставь зенитку на соседней площадке — она займёт две. Затем спускайся в ангар.', 6500);
  }
  if (demoState.stage === 'build_defense' && state.turrets > 0) {
    demoState.stage = 'board_fighter'; construction.close();
    ui.showRadio('dispatcher', 'Защита работает. Радар заметил разведчика. Спускайся лифтом, забирай «Осу» и поднимайся на перехват.', 6500);
  }
  if (demoState.stage === 'build_radar' && state.radars > 0) {
    demoState.stage = 'take_helm'; construction.close();
    ui.showRadio('dispatcher', 'Радар проложил безопасный путь. Спускайся к штурвалу в ангаре: пора двигать сам остров.', 6500);
  }
  if (demoState.stage === 'take_helm' && !state.radars) demoState.stage = 'build_radar';
  // Active Island Air Defense: Flak Turrets (golden bursts + airbursts) & Quad-Tube SAM Launchers (homing surface-to-air missiles!)
  if (ship.keys.Space || ship.keys.MouseLeft) demoState.firingLesson = true;
  const hostilePool = [
    ...(demoState.enemies || []).filter(e => e.alive),
    ...((world.jobs?.entities || []).filter(e => e.alive && e.kind === 'scout')),
  ];
  const basePos = asteroidBase?.group?.position || BABYLON.Vector3.Zero();

  // 1. Authentic WWII Flak 88 Turrets (yaw/pitch tracking + barrel recoil + muzzle fire; softens story enemies without stealing player kills)
  demoState.turretTimer = (demoState.turretTimer || 0) - dt;
  const flakRigs = [
    ...(asteroidBase?.flakTurrets || []),
    ...(construction?.buildings || []).filter(b => b.type === 'turret').map(b => b.flakRig || b.node),
  ];
  const flakTarget = demoState.powerOn ? hostilePool.find(e => BABYLON.Vector3.Distance(e.root.position, basePos) < 280) : null;
  for (const rig of flakRigs) {
    if (!rig) continue;
    const baseNode = rig.root || rig;
    if (!baseNode || baseNode.isDisposed?.()) continue;
    if (rig.recoil > 0 && rig.recoilNode) {
      rig.recoil = Math.max(0, rig.recoil - dt * 2.2);
      rig.recoilNode.position.z = rig.recoil * 0.68;
    }
    if (flakTarget && rig.yawNode && rig.pitchNode) {
      const gunWorld = baseNode.getAbsolutePosition();
      const delta = flakTarget.root.position.subtract(gunWorld);
      const targetYaw = Math.atan2(-delta.x, -delta.z) - (asteroidBase.group.rotation.y || 0) - (baseNode.rotation.y || 0);
      rig.yawNode.rotation.y += (targetYaw - rig.yawNode.rotation.y) * (1 - Math.exp(-4.5 * dt));
      const horiz = Math.max(1, Math.hypot(delta.x, delta.z));
      const targetPitch = Math.max(0.08, Math.min(1.32, Math.atan2(delta.y, horiz)));
      rig.pitchNode.rotation.x += (targetPitch - rig.pitchNode.rotation.x) * (1 - Math.exp(-4.5 * dt));
    }
  }
  if (flakTarget && flakRigs.length && demoState.turretTimer <= 0) {
    demoState.turretTimer = 1.45;
    demoState.tracers ||= [];
    for (const rig of flakRigs) {
      const baseNode = rig?.root || rig;
      if (!baseNode || baseNode.isDisposed?.()) continue;
      let from;
      if (rig.muzzleNode) {
        rig.muzzleNode.computeWorldMatrix(true);
        from = rig.muzzleNode.getAbsolutePosition().clone();
        rig.recoil = 1.0;
      } else {
        from = baseNode.getAbsolutePosition().add(new BABYLON.Vector3(0, 3.2, 0));
      }
      const to = flakTarget.root.position.add(new BABYLON.Vector3((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 6));
      const line = BABYLON.MeshBuilder.CreateLines('defenseFlakTracer', { points: [from, to] }, scene);
      line.color = BABYLON.Color3.FromHexString('#ffda74');
      line.isPickable = false;
      demoState.tracers.push({ mesh: line, life: 0.22 });
      spawnDemoExplosion(to, 0.55);
    }
    audio?.playGunshot?.('attacker');
    const isStoryEnemy = demoState.enemies.includes(flakTarget);
    const minFloor = isStoryEnemy ? Math.ceil((flakTarget.maxHp || 70) * 0.30) : 0;
    flakTarget.hp = Math.max(minFloor, flakTarget.hp - 3 * flakRigs.length);
    if (flakTarget.hp <= 0 && !isStoryEnemy) {
      world.jobs?._destroy?.(flakTarget);
    }
  }

  // 2. Quad-Tube SAM (Surface-to-Air Missile) Launcher Battery with Homing Missiles & Smoke Ribbons
  demoState.samMissiles ||= [];
  for (const sam of asteroidBase?.samLaunchers || []) {
    if (!sam.base || sam.base.isDisposed?.()) continue;
    sam.cd = Math.max(0, (sam.cd || 0) - dt);
    const enemy = demoState.powerOn ? hostilePool.find(e => BABYLON.Vector3.Distance(e.root.position, basePos) < 320) : null;
    if (enemy) {
      const samWorld = sam.base.getAbsolutePosition();
      const delta = enemy.root.position.subtract(samWorld);
      const targetYaw = Math.atan2(-delta.x, -delta.z) - (asteroidBase.group.rotation.y || 0);
      sam.yawNode.rotation.y += (targetYaw - sam.yawNode.rotation.y) * (1 - Math.exp(-5 * dt));
      const horiz = Math.max(1, Math.hypot(delta.x, delta.z));
      const targetPitch = -Math.max(0.25, Math.min(1.05, Math.atan2(delta.y, horiz)));
      sam.rackNode.rotation.x += (targetPitch - sam.rackNode.rotation.x) * (1 - Math.exp(-5 * dt));

      if (sam.cd <= 0 && demoState.samMissiles.length < 2) {
        sam.cd = 7.5;
        const mNode = sam.muzzles[sam.tubeIdx % sam.muzzles.length];
        sam.tubeIdx = (sam.tubeIdx + 1) % sam.muzzles.length;
        mNode.computeWorldMatrix(true);
        const startPos = mNode.getAbsolutePosition().clone();
        const initDir = delta.normalize().add(new BABYLON.Vector3(0, 0.35, 0)).normalize();

        if (!demoState._samMat || demoState._samMat.isDisposed) {
          demoState._samMat = new BABYLON.StandardMaterial('samMissileSharedMat', scene);
          demoState._samMat.emissiveColor = BABYLON.Color3.FromHexString('#ffaa38');
          demoState._samMat.disableLighting = true;
        }
        if (!demoState._samTrailMat || demoState._samTrailMat.isDisposed) {
          demoState._samTrailMat = new BABYLON.StandardMaterial('samTrailSharedMat', scene);
          demoState._samTrailMat.emissiveColor = BABYLON.Color3.FromHexString('#f5ede0');
          demoState._samTrailMat.disableLighting = true;
          demoState._samTrailMat.backFaceCulling = false;
          demoState._samTrailMat.depthWrite = false;
          demoState._samTrailMat.alpha = 0.62;
          if (ship?.trailMat?.opacityTexture) demoState._samTrailMat.opacityTexture = ship.trailMat.opacityTexture;
        }
        const mMesh = BABYLON.MeshBuilder.CreateCylinder('samMissile', { diameterTop: 0.16, diameterBottom: 0.30, height: 2.2, tessellation: 8 }, scene);
        mMesh.position.copyFrom(startPos);
        mMesh.lookAt(startPos.add(initDir));
        mMesh.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
        mMesh.material = demoState._samMat;
        mMesh.isPickable = false;
        const samPlume = BABYLON.MeshBuilder.CreateCylinder('samPlume', { diameterTop: 0.34, diameterBottom: 0.02, height: 1.6, tessellation: 6 }, scene);
        samPlume.parent = mMesh; samPlume.position.set(0, -1.7, 0); samPlume.material = demoState._samMat; samPlume.isPickable = false;
        let trail = null;
        if (typeof BABYLON.TrailMesh === 'function') {
          trail = new BABYLON.TrailMesh(`samTrail_${Date.now()}`, mMesh, scene, 0.42, 38, true);
          trail.material = demoState._samTrailMat;
          trail.isPickable = false;
        }
        audio?.playSpecialWeapon?.('rocket');
        demoState.samMissiles.push({ mesh: mMesh, trail, vel: initDir.scale(85), target: enemy, life: 5.0 });
      }
    }
  }
  for (let i = demoState.samMissiles.length - 1; i >= 0; i--) {
    const m = demoState.samMissiles[i];
    m.life -= dt;
    let hit = false;
    if (m.target?.alive && m.target.root && !m.target.root.isDisposed?.()) {
      const toTgt = m.target.root.position.subtract(m.mesh.position);
      const dist = toTgt.length();
      if (dist < 7.5) {
        hit = true;
        const isStoryEnemy = demoState.enemies.includes(m.target);
        const minFloor = isStoryEnemy ? Math.ceil((m.target.maxHp || 70) * 0.30) : 0;
        m.target.hp = Math.max(minFloor, m.target.hp - 18);
        spawnDemoExplosion(m.mesh.position.clone(), 1.35);
        audio?.playExplosion?.(0.7);
        if (m.target.hp <= 0 && !isStoryEnemy) {
          world.jobs?._destroy?.(m.target);
        }
      } else {
        const curSpd = Math.min(175, m.vel.length() + 90 * dt);
        const curDir = m.vel.clone().normalize();
        const desDir = toTgt.scale(1 / dist);
        BABYLON.Vector3.LerpToRef(curDir, desDir, 1 - Math.exp(-5.2 * dt), curDir);
        curDir.normalize();
        m.vel.copyFrom(curDir.scale(curSpd));
        m.mesh.lookAt(m.mesh.position.add(curDir));
        m.mesh.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
      }
    }
    m.mesh.position.addInPlace(m.vel.scale(dt));
    if (hit || m.life <= 0) {
      m.trail?.dispose();
      m.mesh.dispose(false, false);
      demoState.samMissiles.splice(i, 1);
    }
  }

  for (const tracer of demoState.tracers || []) tracer.life -= dt;
  demoState.tracers = (demoState.tracers || []).filter(t => {if(t.life > 0) return true; t.mesh.dispose(); return false;});
  if (demoState.stage === 'move_island') {
    demoState.islandDistance = BABYLON.Vector3.Distance(islandOrigin, asteroidBase.group.position);
    const distance = BABYLON.Vector3.Distance(safeZone, asteroidBase.group.position);
    if (distance < 28 && asteroidBase.velocity.length() < 4 && demoState.islandDistance > 100) {
      demoState.stage = 'mission_complete';
      asteroidBase.velocity.setAll(0);
      audio.playVictory();
      ui.showRadio('dispatcher', '«Бродяга» в безопасном секторе. Ангар цел, защита на месте, остров слушается руля. Добро пожаловать домой, капитан.', 8500);
    }
  }
  const stage = demoState.stage;
  const contractAim=world.jobs?.snapshot.active&&ship.variant==='fighter'?world.jobs.target:null;
  const enemy = stage === 'combat' ? demoState.enemies.find(e=>e.alive) : contractAim?.velocity?{root:{position:contractAim.position},velocity:contractAim.velocity}:null;
  ship.aimAssistTarget = enemy ? {position:enemy.root.position, velocity:enemy.velocity} : null;
  const leadMarker = document.getElementById('combat-lead');
  if (leadMarker) {
    leadMarker.hidden = !enemy || controlMode !== 'aircraft';
    if (enemy && controlMode === 'aircraft') {
      const point = leadPoint(ship.group.position, ship.velocity, enemy.root.position, enemy.velocity, ship.spec.gunSpeed);
      const viewport = camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight());
      const projected = BABYLON.Vector3.Project(point,BABYLON.Matrix.Identity(),scene.getTransformMatrix(),viewport);
      const facing = BABYLON.Vector3.Dot(point.subtract(camera.position),camera.getForwardRay().direction)>0;
      leadMarker.hidden = !facing || projected.z<0 || projected.z>1;
      leadMarker.style.left = `${Math.max(5,Math.min(95,projected.x/engine.getRenderWidth()*100))}%`;
      leadMarker.style.top = `${Math.max(14,Math.min(84,projected.y/engine.getRenderHeight()*100))}%`;
      const lockP = ship.lockProgress || 0;
      const distM = Math.round(BABYLON.Vector3.Distance(ship.group.position, enemy.root.position));
      if (lockP >= 0.95) {
        leadMarker.textContent = `◈ ЗАХВАТ [F] · ${distM} м`;
        leadMarker.style.color = '#ff5a36';
      } else if (lockP > 0.12) {
        leadMarker.textContent = `◎ ЗАХВАТ ${Math.round(lockP * 100)}% · ${distM} м`;
        leadMarker.style.color = '#ffd152';
      } else {
        leadMarker.textContent = `+  ${distM} м`;
        leadMarker.style.color = '';
      }
    } else if(controlMode==='aircraft'&&ship.variant==='bomber'&&world.jobs?.snapshot.active&&world.jobs.target){
      const point=bombImpactPoint(ship.group.position,ship.velocity.add(new BABYLON.Vector3(0,-4.5,0)),world.jobs.target.position.y);
      if(point){const viewport=camera.viewport.toGlobal(engine.getRenderWidth(),engine.getRenderHeight()),p=BABYLON.Vector3.Project(point,BABYLON.Matrix.Identity(),scene.getTransformMatrix(),viewport);
        leadMarker.hidden=p.z<0||p.z>1;leadMarker.style.left=`${Math.max(5,Math.min(95,p.x/engine.getRenderWidth()*100))}%`;leadMarker.style.top=`${Math.max(14,Math.min(82,p.y/engine.getRenderHeight()*100))}%`;leadMarker.textContent='⊕ СБРОС · F';}
    }
  }
  let target = null, name = '';
  if (['tutorial_flight', 'archipelago_flyby'].includes(stage)) {
    target = deckPoint(36,7,0); name = 'Остров «Бродяга» · посадочная полоса';
  } else if (['approach', 'return_to_base'].includes(stage)) { target = deckPoint(36, 7, 0); name = 'ВПП · S снизить скорость · E посадка';
  } else if (stage === 'find_lever') { target = demoState.leverNode.getAbsolutePosition(); name = 'Аварийный рубильник';
  } else if (['build_generator','build_defense','build_radar'].includes(stage)) { target = player.localPos.y > 14 ? deckPoint(-13,23,0) : deckPoint(-8,4,6.5); name = player.localPos.y > 14 ? 'Строительная палуба · B' : 'Грузовой подъёмник · E';
  } else if (stage === 'board_fighter') {target = player.localPos.y > 14 ? deckPoint(-8,22,6.5) : world.fleet?.point(world.fleet.records.find(r=>r.variant==='fighter'))||ship.group.position; name = player.localPos.y > 14 ? 'Подъёмник в ангар' : 'Эскадрилья · выбор самолёта';
  } else if (stage === 'combat') {target = demoState.enemies.find(e=>e.alive)?.root.position; name = 'Воздушная цель';
  } else if (stage === 'take_helm') {target = player.localPos.y > 14 ? deckPoint(-8,22,6.5) : deckPoint(-2.6,4,-2.4); name = 'Штурвал острова';
  } else if (stage === 'move_island') {target = safeZone; name = 'Безопасный сектор · остановитесь у маяка';}
  const contractTarget=controlMode==='aircraft'&&(world.jobs?.snapshot.active||world.jobs?.snapshot.stage==='complete')&&world.jobs.snapshot.variant===ship.variant?world.jobs.target:null;
  if(contractTarget){target=contractTarget.position;name=contractTarget.name;}
  world.missionTarget = target ? {position:target, name} : null;
  if (demoState.marker) {
    demoState.marker.isVisible = Boolean(target) && stage !== 'intro_cutscene' && !construction.isOpen;
    if (target) {demoState.marker.position.copyFrom(target); demoState.marker.rotation.y += dt * 0.4;}
    demoState.marker.scaling.setAll(controlMode === 'foot' ? 0.24 : (stage === 'move_island' ? 3 : 1));
  }
}

function getQuestState() {
  if (worldMode === 'sky' && demoState) {
    const state = construction?.snapshot;
    const lessons = demoState.flightLessons;
    const stages = {
      free_flight: ['Ангар эскадрильи', 'E у самолёта — выбрать борт и задание. После вылета вернитесь и попробуйте другую машину.'],
      intro_cutscene: ['Пролог · Аварийный курс', 'Space — пропустить'],
      tutorial_flight: ['1 · Почувствовать самолёт', `${lessons.thrust ? '✓' : '○'} W/S тяга · ${lessons.turn ? '✓' : '○'} A/D курс · ${lessons.altitude ? '✓' : '○'} ↑/↓ высота. Держите курс на базу.`],
      archipelago_flyby: ['2 · К острову «Бродяга»', 'Держите курс на остров. У полосы удерживайте S, затем E для посадки.'],
      approach: ['3 · Посадка', 'Снижайтесь к ВПП. S — сбросить тягу и скорость; E — посадочная помощь.'],
      find_lever: ['4 · Оживить ангар', 'WASD — шаг, мышь с ЛКМ — обзор. Найдите рубильник и нажмите E.'],
      build_generator: ['5 · Сердце острова', 'Лифт в ангаре → E. Наверху B: генератор за 30 лома даёт 4 энергии.'],
      build_defense: ['6 · Прикрыть остров', 'B: постройте зенитку за 35 лома. Она потребляет 2 энергии и стреляет по врагам.'],
      board_fighter: ['7 · Эскадрилья острова', 'В ангаре четыре самолёта. E у машины — выбрать роль. «Оса» продолжит перехват; остальные получат свои задания.'],
      combat: [`8 · Воздушный бой · ${demoState.kills}/${demoState.totalEnemies}`, 'Space/ЛКМ — пушки · F/ПКМ — ракеты. Сначала разведчик, затем пара сопровождения.'],
      return_to_base: ['9 · Вернуться домой', 'Сядьте на ВПП: S — торможение, E — посадочная помощь.'],
      build_radar: ['10 · Найти безопасный путь', 'Лом с обломков получен. Лифт → B: радар за 25 лома, расход 1 энергии.'],
      take_helm: ['11 · Свой остров', 'Спуститесь в ангар. E у штурвала — принять управление островом.'],
      move_island: ['12 · Вывести «Бродягу»', 'W — ход · A/D — курс · S — тормоз · Space/C — высота. Остановитесь в безопасном секторе по компасу.'],
      mission_complete: ['Миссия пройдена · Свой дом в небе', 'Полёт, посадка, стройка, бой и управление островом освоены. G — вернуться на палубу.'],
    };
    const contract=world.jobs?.snapshot;
    if(controlMode==='aircraft'&&(contract?.active||contract?.stage==='complete')&&contract.variant===ship.variant)return {title:contract.title,desc:contract.detail+(contract.winchProgress>0?` Подъём: ${contract.winchProgress}%.`:''),resources:`Лом ${state.salvage} · Энергия ${state.powerUsed}/${state.powerProduced}`};
    const q = stages[demoState.stage] || stages.tutorial_flight;
    return {title:q[0], desc:q[1], resources: state ? `Лом ${state.salvage} · Энергия ${state.powerUsed}/${state.powerProduced}` : ''};
  }

  if (!questTakenOff) {
    return { title: '1. Первый вылет', desc: 'Сядьте в самолёт или к штурвалу базы [E]' };
  }
  if (!questLanded) {
    return { title: '2. Живые миры', desc: 'Приземлитесь на любую планету системы' };
  }
  const megaVisited = world && world.megastructures && world.megastructures.some((m) => m.visited);
  if (!megaVisited) {
    return { title: '3. Следы Предтеч', desc: 'Подлетите к космической мегаструктуре' };
  }
  if (keysAttuned < 3) {
    return { title: `4. Древний резонанс (${keysAttuned}/3)`, desc: 'Настройте 3 Резонансных Обелиска на планетах' };
  }
  return { title: '5. Врата Перехода', desc: 'Пролетите сквозь открытые Врата на границе системы' };
}

function checkWinLose() {
  if (ship.hull <= 0 || (asteroidBase && asteroidBase.integrity <= 0)) {
    audio.playDefeat();
    audio.setAircraftEngine?.(0, 0, false, true);
    audio.setThrust(false);
    audio.setSailWind(0, true);
    gameState = 'defeat';
    const isSky = worldMode === 'sky';
    const reason = asteroidBase && asteroidBase.integrity <= 0
      ? (isSky ? 'Остров «Бродяга» получил критические повреждения!' : 'Астероид «Бродяга» сгорел в атмосфере планеты!')
      : 'Самолёт получил критические повреждения.';
    document.getElementById('defeat-stats').textContent = isSky
      ? `${reason} Сбито: ${demoState?.kills || 0} • Лом: ${construction?.snapshot?.salvage || 0} • Время: ${Math.round(runTime)}с`
      : `${reason} Seed: ${currentSeed} • Ключей: ${keysAttuned}/3 • Время: ${Math.round(runTime)}с`;
    defeatModal.style.display = 'flex';
    return;
  }

  if (world.gateUnlocked && world.gate && (controlMode === 'ship' || controlMode === 'aircraft' || controlMode === 'asteroid')) {
    const pos = controlMode === 'asteroid' ? asteroidBase.group.position : ship.group.position;
    const distToGate = BABYLON.Vector3.Distance(pos, world.gate.group.position);
    if (distToGate < 14.0) {
      audio.playVictory();
      audio.setThrust(false);
      audio.setSailWind(0, true);
      gameState = 'victory';
      document.getElementById('victory-stats').textContent =
        `Вы пересекли Врата Перехода! Seed: ${currentSeed} • Собрано модулей: ${ship.upgrades.size} • Время экспедиции: ${Math.round(runTime)}с`;
      victoryModal.style.display = 'flex';
    }
  }
}

engine.runRenderLoop(() => {
  if (!scene) return;
  const dt = Math.max(0, Math.min(engine.getDeltaTime() / 1000, 0.05));

  if (gameState === 'playing') {
    world.motion?.update(dt,Boolean(demoState?.powerOn));
    world.industrialCranes?.update(dt);
    runTime += dt;
    world.update(
      dt,
      () => {
        audio.playStormWarning();
        ui.showToast('⚠️ Звёздный шторм зарождается!', 3200);
      },
      camera.position,
      ship.group.position,
      false
    );

    if (benchmarkCoast) benchmarkCoast.update(dt);
    const shipCollKey = `${controlMode}:${ship.variant}:${Boolean(ship.glbRoot)}`;
    if (ship._lastCollKey !== shipCollKey) {
      ship._lastCollKey = shipCollKey;
      for (const mesh of ship.group.getChildMeshes()) mesh.checkCollisions = controlMode === 'foot' && mesh.isVisible && !/Flame|Trail|Nozzle|Shadow|LightBulb/i.test(mesh.name);
    }
    construction?.update(dt, {controlMode, stage: demoState?.stage});
    updateMission(dt);

    if (asteroidBase && !freezeCameraForShot) {
      if (controlMode === 'asteroid') {
        if (ship.keys.KeyS) asteroidBase.velocity.scaleInPlace(Math.exp(-dt * 2));
        else asteroidBase.applyPilotInput(ship.keys, dt);
        questTakenOff = true;
      }
      asteroidBase.update(dt, ship.keys, world);
    } else if (asteroidBase) {
      asteroidBase.prevPos.copyFrom(asteroidBase.group.position);
    }

    if (!freezeCameraForShot && !construction?.isOpen) {
      ship.nearAsteroid = asteroidBase;
      const inIntroCutscene = demoState && demoState.stage === 'intro_cutscene';
      const flightStart = ship.group.position.clone();
      const startCollisionOffset=ship.getCollisionCenterOffsetWorld?.()||BABYLON.Vector3.Zero();
      ship.specialInputEnabled=!(world.jobs?.snapshot.active&&world.jobs.snapshot.variant==='cargo');
      ship.update(dt, world, inIntroCutscene ? 'cutscene' : controlMode, (msg, dur) => ui.showToast(msg, dur));
      if (worldMode === 'sky' && controlMode === 'aircraft' && !ship.dockedAsteroid && !inIntroCutscene) {
        const desired = ship.group.position.clone();
        const collisionOffset=ship.getCollisionCenterOffsetWorld?.()||BABYLON.Vector3.Zero();
        const safe = scene.collisionWorld.move(flightStart.add(startCollisionOffset), desired.add(collisionOffset), 'aircraft').subtract(collisionOffset);
        if (BABYLON.Vector3.DistanceSquared(safe, desired) > 0.01) {
          const stepDist = Math.max(0.05, BABYLON.Vector3.Distance(flightStart, desired));
          const blockedRatio = Math.min(1, BABYLON.Vector3.Distance(safe, desired) / stepDist);
          const impactSpeed = ship.velocity.length();
          const hitMeshName = scene.collisionWorld.lastHit || '';
          let inIslandLandingZone = false;
          if (world.islands) {
            for (const isl of world.islands) {
              if (!isl.landingZone || isl === asteroidBase || !isl.group) continue;
              const lzWorld = BABYLON.Vector3.TransformCoordinates(isl.landingZone.localPos, isl.group.getWorldMatrix());
              if (BABYLON.Vector3.Distance(safe, lzWorld) < isl.landingZone.radius + 8 && Math.abs(ship.velocity.y) < 11.5) {
                inIslandLandingZone = true;
                break;
              }
            }
          }
          const isRunwayDeck = (inIslandLandingZone || /Runway|InnerFloor|Apron|DockPlatform/i.test(hitMeshName)) && Math.abs(ship.velocity.y) < 11.5;
          ship.group.position.copyFrom(safe);
          ship.velocity.scaleInPlace(isRunwayDeck ? 0.82 : 0.35);
          if (!isRunwayDeck && (demoState.collisionCd || 0) <= 0) {
            const isFatalHeadOn = impactSpeed >= 32 && blockedRatio >= 0.45;
            const crashDmg = isFatalHeadOn
              ? ship.hull
              : Math.max(12, Math.round((10 + impactSpeed * 1.25) * (0.35 + 0.65 * blockedRatio)));
            ship.hull = Math.max(0, ship.hull - crashDmg);
            ship.recoilShake = Math.max(ship.recoilShake || 0, isFatalHeadOn ? 0.75 : 0.38);
            demoState.collisionCd = 0.45;
            audio?.playExplosion?.(isFatalHeadOn ? 1.0 : 0.55);
            spawnDemoExplosion(safe.clone(), isFatalHeadOn ? 2.4 : 1.15);
            if (ship.hull <= 0) {
              ui.showToast('💥 Столкновение со скалой! Самолёт разрушен', 3400);
              checkWinLose();
            } else {
              ui.showToast(`💥 Удар о скалу (-${crashDmg} корпуса) · отверните от препятствия!`, 2400);
            }
          }
        }
      }
      if (!ship.dockedAsteroid) questTakenOff = true;
      if (ship.dockedPlanet) questLanded = true;

      if (inIntroCutscene) {
        const rm = BABYLON.Matrix.FromQuaternionToRef(ship.group.rotationQuaternion, new BABYLON.Matrix());
        const fwd = BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0, 0, -1), rm).normalize();
        ship.velocity.copyFrom(fwd.scale(30));
        demoState.cutsceneTimer -= dt;
        prologue?.frame(PROLOGUE_DURATION - demoState.cutsceneTimer);

        if (demoState.cutsceneTimer <= 0 || introSkipRequested) {

          finishPrologue();
        }
      } else if (demoState && demoState.stage === 'tutorial_flight') {
        demoState.tutorialTimer += dt;
        const learned = demoState.flightLessons;
        if (ship.keys.KeyW || ship.keys.KeyS) learned.thrust = true;
        if (ship.keys.KeyA || ship.keys.KeyD) learned.turn = true;
        if (ship.keys.ArrowUp || ship.keys.ArrowDown) learned.altitude = true;
        if (Object.values(learned).every(Boolean) && BABYLON.Vector3.Distance(ship.group.position, new BABYLON.Vector3(1200, 130, -360)) > 430) {
          demoState.stage = 'archipelago_flyby';
          ui.showRadio('dispatcher', 'Управление в порядке. Держи курс по компасу: сначала высота, затем скорость. Для посадки сбрось тягу клавишей S.', 6500);
        }
      } else if (demoState && demoState.stage === 'archipelago_flyby') {
        if (asteroidBase && BABYLON.Vector3.Distance(ship.group.position, asteroidBase.group.position) < 420) {
          demoState.stage = 'approach';
          ui.showRadio('pilot', '«Вот и “Бродяга”! Вижу полосу впереди — снижаюсь и торможу [S] на посадку!»', 5500);
          ui.showToast('🎯 Новая цель: Сядьте на ВПП «Бродяги» — касание полосы и тормоз [S] (или [E])', 4500);
        }
      }

      // Real Runway Touchdown & Rollout Braking on Vagabond's 56m Runway (in Vagabond local space, including free_flight!)
      if (worldMode === 'sky' && controlMode === 'aircraft' && !ship.dockedAsteroid && !ship._runwayState && asteroidBase && demoState && ['tutorial_flight', 'archipelago_flyby', 'approach', 'return_to_base', 'free_flight', 'mission_complete', 'combat'].includes(demoState.stage)) {
        asteroidBase.group.computeWorldMatrix(true);
        const invAst = asteroidBase.group.getWorldMatrix().clone().invert();
        const local = BABYLON.Vector3.TransformCoordinates(ship.group.position, invAst);
        const onRunwayXZ = local.x >= -6.0 && local.x <= 57.5 && Math.abs(local.z) <= 10.5;
        if (onRunwayXZ && local.y <= 5.35 && local.y >= 2.2) {
          // Touchdown! Keep wheels on deck (y = 3.38 + clearance) and roll along the runway
          const deckY = asteroidBase.group.position.y + 3.38 + (ship.getGroundClearance?.() || 0.72);
          ship.group.position.y = deckY;
          if (ship.velocity.y < 0) ship.velocity.y = 0;
          const brake = ship.keys['KeyS'] ? 22.0 : 9.5;
          const spd = ship.velocity.length();
          if (spd > 0.5) {
            const newSpd = Math.max(0, spd - brake * dt);
            ship.velocity.scaleInPlace(newSpd / spd);
          }
          if (!demoState.onRunwayRollout) {
            demoState.onRunwayRollout = true;
            ship.recoilShake = Math.max(ship.recoilShake || 0, 0.35);
            audio?.playDock?.();
            ui.showToast('🛬 Касание полосы! Удерживайте [S] до остановки (или [E])', 3000);
          }
          if (ship.velocity.length() < 13.5) {
            ship.dockOnAsteroid(asteroidBase);
            audio?.playDock?.();
            world.fleet?.parkActive(ship);
            player.placeOnAsteroid(asteroidBase);
            controlMode = 'foot';
            ui.setMode('foot');
            demoState.stage = demoState.freeFlight ? 'free_flight' : !demoState.powerOn ? 'find_lever' : demoState.kills >= demoState.totalEnemies ? 'take_helm' : 'board_fighter';
            demoState.onRunwayRollout = false;
            const landingMsg = (demoState.freeFlight || demoState.stage === 'mission_complete')
              ? 'Посадка выполнена. Самолёт на стоянке в ангаре — можно сменить машину или выйти на палубу.'
              : demoState.kills >= demoState.totalEnemies
                ? 'С возвращением. Поднимайся на палубу: радар покажет безопасный сектор.'
                : !demoState.powerOn
                  ? 'Ты на месте! Остров обесточен. Включи аварийный рубильник у входа в ангар.'
                  : 'Отличная посадка! В ангаре доступны другие машины и верстак.';
            ui.showRadio('dispatcher', landingMsg, 5600);
          }
        }
      }

      // The swept ellipsoid solver owns solid contact; no coarse radius pushes
      // may override the real cave openings or generated island silhouettes.
      if (demoState && demoState.collisionCd > 0) demoState.collisionCd -= dt;

      if (controlMode === 'aircraft' && ship.dockedAsteroid && ship.keys['Space']) {
        if(ship.undockFromAsteroid()!==false)ui.showToast('Отрыв от полосы',1800);
      }
      if (controlMode === 'asteroid') {
        const fwdA = new BABYLON.Vector3(Math.sin(asteroidBase.group.rotation.y), 0, Math.cos(asteroidBase.group.rotation.y));
        const desiredCam = asteroidBase.group.position.subtract(fwdA.scale(95)).add(new BABYLON.Vector3(0, 52, 0));
        BABYLON.Vector3.LerpToRef(camera.position, desiredCam, Math.min(1, dt * 4.5), camera.position);
        camera.upVector.set(0, 1, 0);
        camera.setTarget(asteroidBase.group.position.add(fwdA.scale(8)).add(new BABYLON.Vector3(0, 10, 0)));
      }
    }

    // Silence aircraft engine when on foot, docked, or in asteroid helm mode
    if (controlMode !== 'aircraft' || ship?.dockedAsteroid) {
      audio?.setAircraftEngine?.(0, 0, false, true);
    }

    // Update Demo Combat, Smoke Damage, Projectiles Hits & Explosions
    if (demoState && !freezeCameraForShot) {
      smoke?.update(dt);

      const vCenter = asteroidBase ? asteroidBase.group.position : new BABYLON.Vector3(0, 35, 0);
      demoState.enemyMissiles ||= [];
      demoState.enemyFlares ||= [];
      demoState.rwrWarnCd = Math.max(0, (demoState.rwrWarnCd || 0) - dt);
      demoState.rwrToastCd = Math.max(0, (demoState.rwrToastCd || 0) - dt);
      demoState.enemyFlareToastCd = Math.max(0, (demoState.enemyFlareToastCd || 0) - dt);

      const spawnEnemyFlares = (en) => {
        if (!demoState._enemyFlareMat || demoState._enemyFlareMat.isDisposed) {
          demoState._enemyFlareMat = new BABYLON.StandardMaterial('enemyFlareMat', scene);
          demoState._enemyFlareMat.emissiveColor = BABYLON.Color3.FromHexString('#ffd166');
          demoState._enemyFlareMat.disableLighting = true;
        }
        if (!demoState._enemyFlareTrailMat || demoState._enemyFlareTrailMat.isDisposed) {
          demoState._enemyFlareTrailMat = new BABYLON.StandardMaterial('enemyFlareTrailMat', scene);
          demoState._enemyFlareTrailMat.emissiveColor = BABYLON.Color3.FromHexString('#ffe8a3');
          demoState._enemyFlareTrailMat.disableLighting = true;
          demoState._enemyFlareTrailMat.alpha = 0.6;
        }
        const fwd = (en.heading && en.heading.lengthSquared() > 0.01) ? en.heading.clone().normalize() : new BABYLON.Vector3(0, 0, 1);
        const right = BABYLON.Vector3.Cross(BABYLON.Vector3.Up(), fwd);
        if (right.lengthSquared() < 0.01) right.set(1, 0, 0);
        else right.normalize();
        let firstFlare = null;
        for (let fi = 0; fi < 3; fi++) {
          const side = fi === 0 ? -1 : fi === 1 ? 1 : 0;
          const fm = BABYLON.MeshBuilder.CreateSphere('enemyDecoyFlare', { diameter: 0.72, segments: 6 }, scene);
          fm.position.copyFrom(en.root.position)
            .subtractInPlace(fwd.scale(2.5 + fi * 0.5))
            .addInPlace(right.scale(side * 1.4));
          fm.material = demoState._enemyFlareMat;
          fm.isPickable = false;
          let trail = null;
          if (typeof BABYLON.TrailMesh === 'function') {
            trail = new BABYLON.TrailMesh(`enemyFlareTrail_${Date.now()}_${fi}`, fm, scene, 0.22, 16, true);
            trail.material = demoState._enemyFlareTrailMat;
            trail.isPickable = false;
          }
          const fVel = (en.velocity ? en.velocity.scale(0.5) : BABYLON.Vector3.Zero())
            .add(right.scale(side * 13))
            .add(new BABYLON.Vector3(0, -8 - fi * 2.5, 0))
            .subtract(fwd.scale(9));
          const flareObj = { mesh: fm, trail, vel: fVel, life: 2.6 };
          demoState.enemyFlares.push(flareObj);
          if (!firstFlare) firstFlare = flareObj;
        }
        return firstFlare;
      };

      const launchEnemyMissile = (en, launchDir) => {
        if (!demoState._enemyMissileMat || demoState._enemyMissileMat.isDisposed) {
          demoState._enemyMissileMat = new BABYLON.StandardMaterial('enemyMissileMat', scene);
          demoState._enemyMissileMat.emissiveColor = BABYLON.Color3.FromHexString('#ff5a2a');
          demoState._enemyMissileMat.disableLighting = true;
        }
        if (!demoState._enemyMissileTrailMat || demoState._enemyMissileTrailMat.isDisposed) {
          demoState._enemyMissileTrailMat = new BABYLON.StandardMaterial('enemyMissileTrailMat', scene);
          demoState._enemyMissileTrailMat.emissiveColor = BABYLON.Color3.FromHexString('#ffe0b8');
          demoState._enemyMissileTrailMat.disableLighting = true;
          demoState._enemyMissileTrailMat.backFaceCulling = false;
          demoState._enemyMissileTrailMat.depthWrite = false;
          demoState._enemyMissileTrailMat.alpha = 0.62;
          if (ship?.trailMat?.opacityTexture) demoState._enemyMissileTrailMat.opacityTexture = ship.trailMat.opacityTexture;
        }
        const mm = BABYLON.MeshBuilder.CreateCylinder('enemyHomingMissile', { diameterTop: 0.14, diameterBottom: 0.36, height: 2.4, tessellation: 6 }, scene);
        mm.position.copyFrom(en.root.position).addInPlace(launchDir.scale(4.5));
        mm.lookAt(mm.position.add(launchDir));
        mm.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
        mm.material = demoState._enemyMissileMat;
        mm.isPickable = false;
        const emPlume = BABYLON.MeshBuilder.CreateCylinder('enemyMissilePlume', { diameterTop: 0.36, diameterBottom: 0.02, height: 1.65, tessellation: 6 }, scene);
        emPlume.parent = mm; emPlume.position.set(0, -1.8, 0); emPlume.material = demoState._enemyMissileMat; emPlume.isPickable = false;
        let trail = null;
        if (typeof BABYLON.TrailMesh === 'function') {
          trail = new BABYLON.TrailMesh(`enemyMissileTrail_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, mm, scene, 0.48, 38, true);
          trail.material = demoState._enemyMissileTrailMat;
          trail.isPickable = false;
        }
        demoState.enemyMissiles.push({
          mesh: mm,
          trail,
          vel: launchDir.scale(116),
          life: 6.8,
          spoofedTarget: null,
        });
      };

      const playerInAirCombat = demoState.stage === 'combat' && controlMode === 'aircraft' && !ship.dockedAsteroid;

      for (const en of demoState.enemies) {
        if (!en.alive) continue;
        en.flareCd = Math.max(0, (en.flareCd || 0) - dt);
        en.missileCd = Math.max(0, (en.missileCd || 0) - dt);
        en.evadeTimer = Math.max(0, (en.evadeTimer || 0) - dt);
        en.heading ||= new BABYLON.Vector3(0, 0, 1);

        const toPlayer = ship.group.position.subtract(en.root.position);
        const dPl = toPlayer.length();

        if (en.variant === 'fighter' && playerInAirCombat) {
          // Tactical 3-state Dogfight AI: pursue / evade / break
          const toVag = en.root.position.subtract(vCenter);
          const dVag = toVag.length();
          const playerDir = dPl > 0.5 ? toPlayer.scale(1 / dPl) : new BABYLON.Vector3(0, 0, 1);

          if (dVag < 54 || en.root.position.y < vCenter.y + 18) {
            en.aiState = 'break';
          } else if (en.evadeTimer > 0) {
            en.aiState = 'evade';
          } else if (dPl < 56) {
            en.aiState = 'break';
            en.evadeTimer = 1.6;
            en.evadeSide = -en.evadeSide;
          } else {
            en.aiState = 'pursue';
          }

          let desDir;
          if (en.aiState === 'evade') {
            const sideVec = BABYLON.Vector3.Cross(BABYLON.Vector3.Up(), playerDir);
            if (sideVec.lengthSquared() < 0.01) sideVec.set(1, 0, 0);
            else sideVec.normalize();
            const jink = Math.sin(performance.now() * 0.006 + en.phase) * 0.35;
            desDir = sideVec.scale(en.evadeSide * 0.85)
              .add(new BABYLON.Vector3(0, 0.42 + jink, 0))
              .subtract(playerDir.scale(0.35))
              .normalize();
          } else if (en.aiState === 'break') {
            const away = dVag < 54
              ? toVag.scale(1 / Math.max(1, dVag))
              : playerDir.scale(-1);
            const sideVec = BABYLON.Vector3.Cross(BABYLON.Vector3.Up(), away);
            if (sideVec.lengthSquared() < 0.01) sideVec.set(1, 0, 0);
            else sideVec.normalize();
            desDir = away.scale(0.7)
              .add(new BABYLON.Vector3(0, 0.62, 0))
              .add(sideVec.scale(en.evadeSide * 0.45))
              .normalize();
          } else if (dVag > 390) {
            // Keep dogfight within the Vagabond sky arena
            desDir = vCenter.add(new BABYLON.Vector3(0, 72, 0)).subtract(en.root.position).normalize();
          } else {
            // Lead-pursuit intercept toward player's flight path with wingman flank offset
            const sideRight = BABYLON.Vector3.Cross(BABYLON.Vector3.Up(), playerDir);
            if (sideRight.lengthSquared() < 0.01) sideRight.set(1, 0, 0);
            else sideRight.normalize();
            const leadPos = ship.group.position
              .add(ship.velocity.scale(0.55))
              .add(sideRight.scale((en.flankOffset || 0) * Math.min(1, dPl / 140)));
            const toLead = leadPos.subtract(en.root.position);
            desDir = toLead.lengthSquared() > 1 ? toLead.normalize() : playerDir;
          }

          const turnRate = en.aiState === 'evade' ? 2.9 : (en.aiState === 'break' ? 2.4 : 2.1);
          const prevHeading = en.heading.clone();
          BABYLON.Vector3.LerpToRef(en.heading, desDir, Math.min(1, turnRate * dt), en.heading);
          if (en.heading.lengthSquared() < 0.001) en.heading.copyFrom(desDir);
          else en.heading.normalize();

          const spdMult = en.aiState === 'evade' ? 1.26 : (en.aiState === 'break' ? 1.16 : 1.08);
          const curSpd = en.speed * spdMult;
          en.velocity = en.heading.scale(curSpd);
          en.root.position.addInPlace(en.velocity.scale(dt));

          // Compute realistic banking roll into the turn
          const turnCross = BABYLON.Vector3.Cross(prevHeading, en.heading);
          const bankAngle = Math.max(-1.05, Math.min(1.05, -turnCross.y * 20));
          const baseQ = aircraftHeading(en.heading);
          const rollQ = BABYLON.Quaternion.RotationAxis(BABYLON.Axis.Z, bankAngle);
          en.root.rotationQuaternion = baseQ.multiply(rollQ);
        } else {
          // Bomber evasive weave when damaged or patrol orbit around Vagabond
          const weaveBoost = en.evadeTimer > 0 ? 1.45 : 1.0;
          en.phase += dt * (en.variant === 'bomber' ? 0.18 * weaveBoost : 0.28);
          const rad = en.variant === 'bomber' ? (135 + Math.sin(en.phase * 1.7) * 26) : 115;
          const alt = en.variant === 'bomber' ? (68 + Math.sin(en.phase * 2.4) * (en.evadeTimer > 0 ? 22 : 10)) : (60 + Math.sin(en.phase * 2) * 14);
          const tgtPos = new BABYLON.Vector3(
            vCenter.x + Math.cos(en.phase) * rad,
            vCenter.y + alt,
            vCenter.z + Math.sin(en.phase) * rad
          );
          const toTgt = tgtPos.subtract(en.root.position);
          const distT = toTgt.length();
          if (distT > 0.5) {
            const dir = toTgt.scale(1 / distT);
            en.heading.copyFrom(dir);
            en.velocity = dir.scale(en.speed * (en.evadeTimer > 0 ? 1.2 : 1.0));
            en.root.position.addInPlace(dir.scale(Math.min(distT, en.velocity.length() * dt)));
            en.root.rotationQuaternion = aircraftHeading(dir);
          }
        }

        // Trailing damage smoke once enemy drops below 55% HP
        if (!en.damageTrail && en.hp < en.maxHp * 0.55 && typeof BABYLON.TrailMesh === 'function') {
          if (!demoState._dmgSmokeMat || demoState._dmgSmokeMat.isDisposed) {
            demoState._dmgSmokeMat = new BABYLON.StandardMaterial('enemyDmgSmokeMat', scene);
            demoState._dmgSmokeMat.emissiveColor = BABYLON.Color3.FromHexString('#5c3824');
            demoState._dmgSmokeMat.disableLighting = true;
            demoState._dmgSmokeMat.backFaceCulling = false;
            demoState._dmgSmokeMat.alpha = 0.55;
          }
          const smokeAnchor = new BABYLON.TransformNode(`enDmgAnchor_${en.phase}`, scene);
          smokeAnchor.parent = en.root;
          smokeAnchor.position.set(0, 0.2, 1.4);
          en.damageTrail = new BABYLON.TrailMesh(`enDmgTrail_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`, smokeAnchor, scene, 0.65, 28, true);
          en.damageTrail.material = demoState._dmgSmokeMat;
          en.damageTrail.isPickable = false;
        }

        // Player projectile hits & enemy pilot countermeasure flares against homing rockets
        for (let pi = ship.projectiles.length - 1; pi >= 0; pi--) {
          const pr = ship.projectiles[pi];
          if (!pr.mesh || pr.mesh.isDisposed()) continue;

          // Enemy fighter deploys decoy flares when a player homing rocket closes within 115m
          if (en.variant === 'fighter' && pr.kind === 'rocket' && pr.target && en.flareCd <= 0) {
            const dRocket = BABYLON.Vector3.Distance(en.root.position, pr.mesh.position);
            if (dRocket < 115 && dRocket > 12) {
              en.flareCd = 6.5;
              en.evadeTimer = 2.6;
              en.evadeSide = -en.evadeSide;
              en.aiState = 'evade';
              const decoy = spawnEnemyFlares(en);
              if (decoy && Math.random() < 0.45) {
                pr.target = { position: decoy.mesh.position, velocity: decoy.vel };
                if (demoState.enemyFlareToastCd <= 0) {
                  demoState.enemyFlareToastCd = 3.5;
                  ui.showToast('✨ Противник отстрелил ловушки и увёл ракету!', 2200);
                }
              }
            }
          }

          if (distanceToSegment(en.root.position, pr.previousPosition, pr.mesh.position) < (en.variant === 'bomber' ? 9.5 : 6.8)) {
            const dmg = pr.kind === 'rocket' ? 85 : 14;
            en.hp -= dmg;
            audio?.playHitmarker?.();
            spawnDemoExplosion(pr.mesh.position, pr.kind === 'rocket' ? 1.45 : 0.45);
            pr.trail?.dispose();
            pr.mesh.dispose(false, false);
            ship.projectiles.splice(pi, 1);

            if (en.hp > 0) {
              // Evade sharply when taking hits
              en.evadeTimer = Math.max(en.evadeTimer, en.variant === 'fighter' ? 2.1 : 3.0);
              en.evadeSide = -en.evadeSide;
            }

            if (en.hp <= 0) {
              missionEnemyDown(en);
              break;
            }
          }
        }

        // Enemy return fire: Fighter burst cannons + homing missiles, AND Bomber defensive dorsal turret!
        if (en.alive && playerInAirCombat) {
          en.fireCd -= dt;
          const aimDot = dPl > 0.5 ? BABYLON.Vector3.Dot(en.heading, toPlayer.scale(1 / dPl)) : 0;

          // Trigger a 3–4 round burst when in firing envelope
          if (en.burstLeft <= 0 && en.fireCd <= 0) {
            if (en.variant === 'fighter' && dPl < 245 && aimDot > 0.62) {
              en.burstLeft = 4;
              en.burstTimer = 0;
              en.fireCd = 2.1 + Math.random() * 1.1;
            } else if (en.variant === 'bomber' && dPl < 235) {
              // Bomber defensive dorsal/tail turret fires bursts in any direction
              en.burstLeft = 3;
              en.burstTimer = 0;
              en.fireCd = 2.5 + Math.random() * 1.2;
            }
          }

          if (en.burstLeft > 0) {
            en.burstTimer -= dt;
            if (en.burstTimer <= 0) {
              en.burstLeft--;
              en.burstTimer = 0.11;
              const leadAim = ship.group.position.add(ship.velocity.scale(dPl / 170)).add(new BABYLON.Vector3(
                (Math.random() - 0.5) * 3.8,
                (Math.random() - 0.5) * 3.0,
                (Math.random() - 0.5) * 3.8
              ));
              const shotDir = leadAim.subtract(en.root.position).normalize();
              const es = BABYLON.MeshBuilder.CreateCylinder('enemyTracer', { diameter: 0.28, height: 3.2, tessellation: 6 }, scene);
              es.position.copyFrom(en.root.position).addInPlace(shotDir.scale(3.5));
              es.lookAt(es.position.add(shotDir));
              es.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);
              es.isPickable = false;
              if (!demoState._enemyTracerMat || demoState._enemyTracerMat.isDisposed) {
                demoState._enemyTracerMat = new BABYLON.StandardMaterial('enemyTracerSharedMat', scene);
                demoState._enemyTracerMat.emissiveColor = BABYLON.Color3.FromHexString('#ff3b30');
                demoState._enemyTracerMat.disableLighting = true;
              }
              es.material = demoState._enemyTracerMat;
              demoState.enemyShots.push({ mesh: es, vel: shotDir.scale(172), life: 2.0 });
            }
          }

          // Fighter homing missile launch
          if (en.variant === 'fighter' && en.missileCd <= 0 && dPl > 85 && dPl < 340 && aimDot > 0.42 && demoState.enemyMissiles.length < 2) {
            en.missileCd = 7.0 + Math.random() * 2.8;
            launchEnemyMissile(en, toPlayer.scale(1 / Math.max(1, dPl)));
          }
        }
      }

      // Update falling burning wrecks (death spiral -> final explosion)
      demoState.fallingWrecks ||= [];
      for (let i = demoState.fallingWrecks.length - 1; i >= 0; i--) {
        const w = demoState.fallingWrecks[i];
        w.life -= dt;
        w.blastCd -= dt;
        w.vel.y -= 23.0 * dt;
        w.vel.x *= Math.exp(-dt * 0.35);
        w.vel.z *= Math.exp(-dt * 0.35);
        w.root.position.addInPlace(w.vel.scale(dt));
        if (!w.root.rotationQuaternion) {
          w.root.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(w.root.rotation.x, w.root.rotation.y, w.root.rotation.z);
        }
        const dq = BABYLON.Quaternion.FromEulerAngles(w.spin.x * dt, w.spin.y * dt, w.spin.z * dt);
        w.root.rotationQuaternion.multiplyInPlace(dq).normalize();
        if (w.fireCore && !w.fireCore.isDisposed()) {
          w.fireCore.scaling.setAll(0.85 + Math.sin(performance.now() * 0.03 + i) * 0.3);
        }
        if (w.blastCd <= 0) {
          w.blastCd = 0.42 + Math.random() * 0.28;
          spawnDemoExplosion(w.root.position.clone(), 0.75);
        }
        if (w.life <= 0 || w.root.position.y < -95) {
          spawnDemoExplosion(w.root.position.clone(), w.isBomber ? 2.6 : 2.0);
          audio?.playExplosion?.(0.75);
          w.trail?.dispose?.();
          w.fireCore?.dispose?.(false, false);
          w.root?.dispose?.();
          demoState.fallingWrecks.splice(i, 1);
        }
      }

      // Update break-apart spinning debris chunks
      demoState.fallingDebris ||= [];
      for (let i = demoState.fallingDebris.length - 1; i >= 0; i--) {
        const db = demoState.fallingDebris[i];
        db.life -= dt;
        db.vel.y -= 24.0 * dt;
        db.vel.scaleInPlace(Math.exp(-dt * 0.25));
        db.mesh.position.addInPlace(db.vel.scale(dt));
        db.mesh.rotation.x += db.rotVel.x * dt;
        db.mesh.rotation.y += db.rotVel.y * dt;
        db.mesh.rotation.z += db.rotVel.z * dt;
        if (db.life <= 0 || db.mesh.position.y < -105) {
          db.trail?.dispose?.();
          db.mesh.dispose(false, false);
          demoState.fallingDebris.splice(i, 1);
        }
      }

      // Update enemy decoy flares
      for (let i = demoState.enemyFlares.length - 1; i >= 0; i--) {
        const fl = demoState.enemyFlares[i];
        fl.life -= dt;
        fl.vel.scaleInPlace(Math.exp(-dt * 1.35));
        fl.vel.y -= 9.5 * dt;
        fl.mesh.position.addInPlace(fl.vel.scale(dt));
        fl.mesh.scaling.setAll(Math.max(0.15, fl.life / 2.6));
        if (fl.life <= 0) {
          fl.trail?.dispose();
          fl.mesh.dispose(false, false);
          demoState.enemyFlares.splice(i, 1);
        }
      }

      // Update enemy homing missiles (with cockpit RWR warning + player [H] flare spoofing)
      let incomingMissileWarning = false;
      for (let i = demoState.enemyMissiles.length - 1; i >= 0; i--) {
        const em = demoState.enemyMissiles[i];
        em.life -= dt;

        // Check if player deployed countermeasure flares within 165m
        if (!em.spoofedTarget && ship.flares?.length) {
          for (const pf of ship.flares) {
            if (pf.mesh && !pf.mesh.isDisposed() && BABYLON.Vector3.Distance(em.mesh.position, pf.mesh.position) < 165) {
              em.spoofedTarget = pf;
              ui.showToast('✨ Ловушка увела вражескую ракету!', 1800);
              break;
            }
          }
        }

        const spoofValid = em.spoofedTarget && em.spoofedTarget.mesh && !em.spoofedTarget.mesh.isDisposed();
        const tgtPos = spoofValid ? em.spoofedTarget.mesh.position : ship.group.position;
        if (!spoofValid && playerInAirCombat) incomingMissileWarning = true;

        const curSpd = Math.max(110, em.vel.length());
        const dir = em.vel.scale(1 / curSpd);
        const toTgt = tgtPos.subtract(em.mesh.position);
        const distT = toTgt.length();
        if (distT > 1.0) {
          const des = toTgt.scale(1 / distT);
          const turnRate = spoofValid ? 6.0 : 3.35;
          BABYLON.Vector3.LerpToRef(dir, des, Math.min(1, turnRate * dt), dir);
          dir.normalize();
          em.vel.copyFrom(dir.scale(curSpd));
        }

        em.mesh.position.addInPlace(em.vel.scale(dt));
        em.mesh.lookAt(em.mesh.position.add(dir));
        em.mesh.rotate(BABYLON.Axis.X, Math.PI * 0.5, BABYLON.Space.LOCAL);

        let hit = false;
        if (spoofValid && distT < 6.0) {
          spawnDemoExplosion(em.mesh.position, 0.85);
          hit = true;
        } else if (!spoofValid && playerInAirCombat && distT < 5.5) {
          ship.hull = Math.max(0, ship.hull - 22);
          ship.recoilShake = Math.max(ship.recoilShake || 0, 0.85);
          audio?.playExplosion?.();
          spawnDemoExplosion(em.mesh.position, 1.35);
          if (ship.hull <= 0) checkWinLose();
          hit = true;
        }

        if (em.life <= 0 || hit) {
          em.trail?.dispose();
          em.mesh.dispose(false, false);
          demoState.enemyMissiles.splice(i, 1);
        }
      }

      if (incomingMissileWarning) {
        if (demoState.rwrWarnCd <= 0) {
          demoState.rwrWarnCd = 0.55;
          audio?.playMissileWarning?.();
        }
        if (demoState.rwrToastCd <= 0) {
          demoState.rwrToastCd = 2.6;
          ui.showToast('⚠️ РАКЕТА НА ХВОСТЕ! [H] Ловушки / [X] Бочка!', 2000);
        }
      }

      // Combat HUD: Gun Lead Pipper, Target HP Box, Off-screen Enemy Chevron & RWR Alert
      const leadEl = document.getElementById('lead-pipper');
      const boxEl = document.getElementById('target-box');
      const hpFillEl = document.getElementById('target-hp-fill');
      const distEl = document.getElementById('target-dist-label');
      const chevEl = document.getElementById('offscreen-chevron');
      const rwrEl = document.getElementById('rwr-alert');
      if (rwrEl) rwrEl.style.display = incomingMissileWarning ? 'block' : 'none';
      const activeEnemies = [
        ...(demoState.enemies || []).filter(e => e.alive && e.root && !e.root.isDisposed?.()),
        ...((world.jobs?.entities || []).filter(e => e.alive && e.kind === 'scout' && e.root && !e.root.isDisposed?.())),
      ];
      if (controlMode === 'aircraft' && !ship.dockedAsteroid && activeEnemies.length && camera) {
        let bestEn = activeEnemies[0];
        let bestD = Infinity;
        for (const cand of activeEnemies) {
          const d = BABYLON.Vector3.Distance(ship.group.position, cand.root.position);
          if (d < bestD) { bestD = d; bestEn = cand; }
        }
        const cw = canvas.clientWidth || window.innerWidth;
        const ch = canvas.clientHeight || window.innerHeight;
        const vp = new BABYLON.Viewport(0, 0, cw, ch);
        const transformMat = scene.getTransformMatrix();
        const proj = BABYLON.Vector3.Project(bestEn.root.position, BABYLON.Matrix.Identity(), transformMat, vp);
        const inFront = proj.z >= 0 && proj.z <= 1;
        const onScreen = inFront && proj.x >= 28 && proj.x <= cw - 28 && proj.y >= 28 && proj.y <= ch - 28;
        if (onScreen) {
          if (boxEl) {
            boxEl.style.display = 'block';
            boxEl.style.left = `${proj.x.toFixed(1)}px`;
            boxEl.style.top = `${proj.y.toFixed(1)}px`;
          }
          if (hpFillEl) hpFillEl.style.width = `${Math.max(0, Math.min(100, (bestEn.hp / (bestEn.maxHp || 100)) * 100)).toFixed(0)}%`;
          if (distEl) distEl.textContent = `${Math.round(bestD)} м`;
          if (chevEl) chevEl.style.display = 'none';
          // Gun lead pipper within cannon envelope (< 320m)
          if (leadEl && bestD < 320) {
            const gunSpd = ship.spec?.gunSpeed || 240;
            const tFlight = bestD / gunSpd;
            const leadWorld = bestEn.root.position.add((bestEn.velocity || BABYLON.Vector3.Zero()).scale(tFlight));
            const leadProj = BABYLON.Vector3.Project(leadWorld, BABYLON.Matrix.Identity(), transformMat, vp);
            if (leadProj.z >= 0 && leadProj.z <= 1 && leadProj.x >= 10 && leadProj.x <= cw - 10 && leadProj.y >= 10 && leadProj.y <= ch - 10) {
              leadEl.style.display = 'block';
              leadEl.style.left = `${leadProj.x.toFixed(1)}px`;
              leadEl.style.top = `${leadProj.y.toFixed(1)}px`;
            } else {
              leadEl.style.display = 'none';
            }
          } else if (leadEl) {
            leadEl.style.display = 'none';
          }
        } else {
          if (boxEl) boxEl.style.display = 'none';
          if (leadEl) leadEl.style.display = 'none';
          if (chevEl) {
            let dx = proj.x - cw * 0.5;
            let dy = proj.y - ch * 0.5;
            if (!inFront) { dx = -dx; dy = -dy; }
            const ang = Math.atan2(dy, dx);
            const pad = 42;
            const rx = (cw * 0.5 - pad);
            const ry = (ch * 0.5 - pad);
            const c = Math.cos(ang), s = Math.sin(ang);
            const scale = Math.min(rx / Math.max(0.001, Math.abs(c)), ry / Math.max(0.001, Math.abs(s)));
            chevEl.style.display = 'block';
            chevEl.style.left = `${(cw * 0.5 + c * scale).toFixed(1)}px`;
            chevEl.style.top = `${(ch * 0.5 + s * scale).toFixed(1)}px`;
            chevEl.style.transform = `rotate(${(ang + Math.PI * 0.5).toFixed(3)}rad)`;
          }
        }
      } else {
        if (boxEl) boxEl.style.display = 'none';
        if (leadEl) leadEl.style.display = 'none';
        if (chevEl) chevEl.style.display = 'none';
      }

      // Update enemy return tracers
      for (let i = demoState.enemyShots.length - 1; i >= 0; i--) {
        const es = demoState.enemyShots[i];
        es.life -= dt;
        es.mesh.position.addInPlace(es.vel.scale(dt));
        const hitPlayer = BABYLON.Vector3.Distance(es.mesh.position, ship.group.position) < 4.5;
        if (hitPlayer) {
          ship.hull = Math.max(0, ship.hull - 8);
          ship.recoilShake = Math.max(ship.recoilShake || 0, 0.45);
          audio?.playImpact?.();
          spawnDemoExplosion(es.mesh.position, 0.55);
          if (ship.hull <= 0) checkWinLose();
        }
        if (es.life <= 0 || hitPlayer) {
          es.mesh.dispose(false, false);
          demoState.enemyShots.splice(i, 1);
        }
      }
    }

    explosionEffects?.update(dt);

    // Megastructure discovery & quest reward
    if (world.megastructures) {
      const activePos = controlMode === 'asteroid' ? asteroidBase.group.position : ship.group.position;
      for (const ms of world.megastructures) {
        if (!ms.visited && BABYLON.Vector3.Distance(activePos, ms.group.position) < ms.radius + 26) {
          ms.visited = true;
          ship.refuel(35);
          audio.playUpgrade();
          ui.showToast(`🏛️ Мегаструктура открыта: ${ms.name}! (+35% топлива)`, 3800);
        }
      }
    }

    // Dynamic FOV & space dust stream for strong sense of speed
    const activeVel = controlMode === 'asteroid' ? asteroidBase.velocity : (controlMode === 'foot' ? player.velocity : ship.velocity);
    const spd = activeVel.length();
    if (!freezeCameraForShot && demoState?.stage !== 'intro_cutscene' && (controlMode === 'aircraft' || controlMode === 'asteroid')) {
      const targetFov = 0.96 + Math.min(0.24, spd * 0.0045);
      camera.fov += (targetFov - camera.fov) * Math.min(1, dt * 4);
    }
    const showDust = spd > 2.5 && (controlMode === 'aircraft' || controlMode === 'asteroid');
    for (const dp of speedDust) {
      dp.isVisible = showDust;
      if (showDust) {
        const rel = dp.position.subtract(camera.position);
        if (Math.abs(rel.x) > 26) dp.position.x = camera.position.x - Math.sign(rel.x) * 24;
        if (Math.abs(rel.y) > 18) dp.position.y = camera.position.y - Math.sign(rel.y) * 16;
        if (Math.abs(rel.z) > 26) dp.position.z = camera.position.z - Math.sign(rel.z) * 24;
        dp.lookAt(dp.position.add(activeVel));
        dp.scaling.z = 1 + Math.min(8, spd * 0.22);
      }
    }

    world.updateShadowFocus(freezeCameraForShot ? (shotMode==='arch_forest'?world.forestIsland.group.position:shotMode==='arch_industrial'||shotMode==='arch_crane'?world.industrialIsland.group.position:shotMode==='arch_landmark'?world.landmarks.root.position:asteroidBase.group.position) : controlMode === 'foot' ? player.group.position : ship.group.position);

    // Sync controlMode when aircraft lifts off from planet
    if (controlMode === 'drive' && !ship.dockedPlanet) {
      controlMode = 'aircraft';
      ui.setMode('aircraft');
    }

    if (controlMode === 'foot' && !freezeCameraForShot && !construction?.isOpen) {
      player.update(dt, ship, world.simTime);
    }

    // Atmospheric perspective fog & adaptive day/sunset/night lighting (SolarWorld mode only)
    if (worldMode === 'space') {
      let inAtmo = false;
      let atmoDensity = 0;
      let sunElevation = 0.5;
      if (world.terrainPlanet) {
        const tpPos = world.terrainPlanet.group.position;
        const toCam = camera.position.subtract(tpPos);
        const distToTP = toCam.length();
        if (distToTP < world.terrainPlanet.radius + 22) {
          inAtmo = true;
          atmoDensity = Math.max(0, Math.min(1, 1 - (distToTP - world.terrainPlanet.radius) / 22));
          const localUp = toCam.scale(1 / Math.max(1, distToTP));
          const toSun = tpPos.scale(-1).normalize();
          sunElevation = BABYLON.Vector3.Dot(localUp, toSun);
          const dayT = Math.max(0, Math.min(1, (sunElevation + 0.18) / 0.68));
          const sunsetT = Math.max(0, 1 - Math.abs(sunElevation - 0.06) / 0.28);

          scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
          scene.fogColor = new BABYLON.Color3(
            0.05 + dayT * 0.11 + sunsetT * 0.14,
            0.11 + dayT * 0.17 + sunsetT * 0.04,
            0.18 + dayT * 0.21 - sunsetT * 0.05
          );
          scene.fogStart = 36 - atmoDensity * 12;
          scene.fogEnd = 155 - atmoDensity * 30;
        } else {
          scene.fogMode = BABYLON.Scene.FOGMODE_NONE;
        }
      }
      if (world.graphics) {
        const onAst = Boolean(
          (controlMode === 'foot' && player.currentAsteroid) ||
          (controlMode === 'aircraft' && ship.dockedAsteroid) ||
          controlMode === 'asteroid'
        );
        world.graphics.updateAtmosphereLighting(dt, world, { inAtmo, atmoDensity, sunElevation, onAsteroid: onAst });
      }
    }

    if (demoState?.stage !== 'intro_cutscene' && !construction?.isOpen) {updateInteractions();ui.setPrompt(nearestAction?.label || null);}
    checkWinLose();

    world.jobs?.update(dt,{ship,controlMode,onFoot:controlMode==='foot',landed:ship.dockedAsteroid===asteroidBase});
    ui.updateHUD(ship, player, world, controlMode, keysAttuned, asteroidBase, getQuestState());
    ui.updateScanner(controlMode === 'foot' && player.scannerActive, camera, world, ship, audio);
  } else if (gameState === 'menu') {
    world.motion?.update(dt,false);
    world.industrialCranes?.update(dt);
    world.update(dt * 0.35, null, camera.position);
    const basePos = asteroidBase ? asteroidBase.group.position : ship.group.position;
    const angle = 0.58 + Math.sin(world.simTime * .035) * .18;
    const framing=Math.max(1,1.1/engine.getAspectRatio(camera));
    // Frame the AsteroidBase on the right side of the screen while left menu sits cleanly over dark space
    camera.position.set(
      basePos.x + Math.cos(angle) * 115 * framing,
      basePos.y + 52 * framing,
      basePos.z + Math.sin(angle) * 115 * framing
    );
    camera.upVector.set(0, 1, 0);
    camera.setTarget(basePos.add(new BABYLON.Vector3(-8.0, 10.0, 0)));
  }

  const drawTotal=engine._drawCalls?.current||0;
  const frameDraws=scene.metadata.performanceProbe?.sceneProbe.drawCallsCounter.current??Math.max(0,drawTotal-(scene.metadata.previousDrawTotal||0));
  scene.metadata.previousDrawTotal=drawTotal;
  if((urlParams.has('profile')||urlParams.has('metrics')||urlParams.has('qa')) && (!scene.metadata.perfPublishedAt || performance.now()-scene.metadata.perfPublishedAt>250)){
  scene.metadata.perfPublishedAt=performance.now();
  const cumulativeDraws = engine._drawCalls?.current || 0;
  window.__perfStats = {
    fps: Math.round(engine.getFps()),
    frameMs: Math.round(engine.getDeltaTime() * 10) / 10,
    activeMeshes: scene.getActiveMeshes().length,
    drawCalls: frameDraws,
    triangles: scene.getActiveIndices() / 3,
    stage: demoState?.stage, controlMode,
    collision: scene.collisionWorld?.snapshot,
    island: construction?.snapshot,
    position: ship.group.position.asArray(),
    footPosition: player?.localPos?.asArray(),
    variant:ship.variant,
    runway:ship._runwayState?{x:ship._runwayState.local.x,z:ship._runwayState.local.z,pitch:ship._runwayState.pitch,speed:ship.driveSpeed}:null,
    forward: ship.group.rotationQuaternion ? BABYLON.Vector3.TransformNormal(new BABYLON.Vector3(0,0,-1), BABYLON.Matrix.FromQuaternionToRef(ship.group.rotationQuaternion,new BABYLON.Matrix())).asArray() : null,
    target: world.missionTarget?.name,
    landmark: world.landmarks?.snapshot,
    practicalLights:world.practicalLights?.snapshot,
    motion:world.motion?.snapshot,
    explosions:explosionEffects?.snapshot,
    cranes:world.industrialCranes?.snapshot,
    fleet:world.fleet?.snapshot,
    contract:world.jobs?.snapshot,
    materialKit:world.materialKit?.snapshot,
    bakedLighting:world.bakedLighting?.snapshot,
    engineVersion:BABYLON.Engine.Version,
    celestials:world.celestials?.snapshot,
    lessons: demoState?.flightLessons,
    kills: demoState?.kills,
  };
  window.__lastDrawTotal = cumulativeDraws;
  document.body.dataset.perf = JSON.stringify(window.__perfStats);
  }
  if (prologue && !freezeCameraForShot) {
    const introActive = gameState === 'loading' || (gameState === 'playing' && demoState?.stage === 'intro_cutscene');
    prologue.overlay.hidden = !introActive;
    ui.showHUD(gameState === 'playing' && !introActive && !construction?.isOpen);
    document.body.classList.toggle('is-building', Boolean(construction?.isOpen));
    document.body.classList.toggle('in-prologue', introActive);
  }
  if(urlParams.get('profile')==='1' && !scene.metadata.performanceProbe)scene.metadata.performanceProbe=new PerformanceProbe(scene);
  scene.render();
  scene.metadata.performanceProbe?.record();
  if (urlParams.get('metrics') === '1' && metricsFrames++ % 60 === 0) {
    const terrain = world.forestIsland?.generated?.terrain;
    if(terrain) {
      const material=terrain.material, tex=material.albedoTexture;
      document.body.dataset.materialDiagnostics=JSON.stringify({name:material.name,texture:tex?.name,plugin:Boolean(material._rockProjection),rockDefineOnTerrain:Boolean(terrain.subMeshes[0]?.materialDefines?.ROCK_PROJECTION),finalImagePass:world.graphics.pipeline?.imageProcessingEnabled,applyByPostProcess:scene.imageProcessingConfiguration.applyByPostProcess,toneMappingType:scene.imageProcessingConfiguration.toneMappingType,sameEffect:terrain.subMeshes[0]?.effect===world.forestIsland.generated.rock.subMeshes[0]?.effect,rockDefineOnCliff:Boolean(world.forestIsland.generated.rock.subMeshes[0]?.materialDefines?.ROCK_PROJECTION),sample:tex?.getContext ? Array.from(tex.getContext().getImageData(256,256,1,1).data) : null});
    }
    const gl = engine._gl, pixel = new Uint8Array(4), histogram = new Map(), lumas=[];
    for(let y=0;y<16;y++) for(let x=0;x<16;x++) {
      gl.readPixels(Math.floor((x+.5)*engine.getRenderWidth()/16),Math.floor((y+.5)*engine.getRenderHeight()/16),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
      const key=(pixel[0]>>5)*64+(pixel[1]>>5)*8+(pixel[2]>>5);
      histogram.set(key,(histogram.get(key)||0)+1);
      lumas.push(.2126*pixel[0]+.7152*pixel[1]+.0722*pixel[2]);
    }
    let entropy=0, dominant=0, edges=0;
    for(const count of histogram.values()){const p=count/256;entropy-=p*Math.log2(p);dominant=Math.max(dominant,p);}
    for(let i=0;i<256;i++)if(i%16<15&&Math.abs(lumas[i]-lumas[i+1])>24)edges++;
    document.body.dataset.canvasMetrics=JSON.stringify({samples:256,colorEntropyBits:entropy,dominantColorShare:dominant,edgeDensity:edges/240,luminance:{min:Math.min(...lumas),max:Math.max(...lumas),mean:lumas.reduce((a,b)=>a+b,0)/256,contrast:Math.max(...lumas)-Math.min(...lumas)}});
  }
});

if (urlParams.get('qa') === '1') {
  const panel = document.createElement('div');
  panel.id='qa-checkpoints'; panel.style.cssText='position:fixed;bottom:4px;left:38%;z-index:120;display:flex;gap:5px;font:12px monospace';
  const checkpoint = (label, fn) => {const b=document.createElement('button');b.textContent=label;b.onclick=()=>{prologue?.hide();document.body.classList.remove('in-prologue');menuOverlay.style.display='none';gameState='playing';ui.showHUD(true);fn();ship.keys={};player.keys={};b.blur();canvas.focus();};panel.append(b);};
  checkpoint('QA: взрыв',()=>{spawnDemoExplosion(ship.group.position.add(new BABYLON.Vector3(12,5,-12)),1.8);});
  checkpoint('QA: заход',()=>{demoState.stage='approach';player.boardShip();ship.undockFromAsteroid({force:true});ship.group.position.copyFrom(deckPoint(105,9,0));ship.group.rotationQuaternion=aircraftHeading(new BABYLON.Vector3(-1,0,0));ship.velocity.set(-20,0,0);ship.throttle=.1;controlMode='aircraft';ui.setMode('aircraft');});
  checkpoint('QA: ангар',()=>{ship.dockOnAsteroid(asteroidBase);player.placeOnAsteroid(asteroidBase,new BABYLON.Vector3(2,3.38,-5.5));demoState.stage='find_lever';controlMode='foot';ui.setMode('foot');});
  checkpoint('QA: лестница',()=>{ship.dockOnAsteroid(asteroidBase);player.placeOnAsteroid(asteroidBase,new BABYLON.Vector3(11,3.38,-12.4));player.yaw=Math.PI/2;demoState.powerOn=true;demoState.stage='build_generator';controlMode='foot';ui.setMode('foot');});
  checkpoint('QA: бой',()=>{construction.stage=null;construction.addSalvage(80);construction.build('generator',0);construction.build('turret',1);demoState.powerOn=true;ship.dockOnAsteroid(asteroidBase);player.placeOnAsteroid(asteroidBase,new BABYLON.Vector3(2,3.38,-5.5));demoState.stage='board_fighter';controlMode='foot';ui.setMode('foot');});
  checkpoint('QA: цель',()=>{const e=demoState.enemies.find(e=>e.alive);if(!e)return;player.boardShip();ship.undockFromAsteroid({force:true});ship.group.position.copyFrom(e.root.position).addInPlace(new BABYLON.Vector3(0,0,75));const d=e.root.position.subtract(ship.group.position).normalize();ship.group.rotationQuaternion=aircraftHeading(d);ship.velocity.copyFrom(d.scale(22));ship.throttle=.4;controlMode='aircraft';ui.setMode('aircraft');ship.camInited=false;});
  checkpoint('QA: мостик',()=>{ship.dockOnAsteroid(asteroidBase);player.placeOnAsteroid(asteroidBase,new BABYLON.Vector3(-2.6,3.38,-5.5));demoState.powerOn=true;construction.stage=null;for(const [i,type] of ['generator','turret','radar'].entries()){construction.addSalvage(40);construction.build(type,i);}demoState.kills=3;demoState.stage='take_helm';controlMode='foot';ui.setMode('foot');});
  for(const variant of ['cargo','fighter','attacker','bomber'])checkpoint(`QA: ${variant}`,()=>{
    construction.stage=null;construction.addSalvage(100);for(const [i,type]of ['generator','turret','radar'].entries())if(!construction.buildings.some(b=>b.type===type))construction.build(type,i);
    demoState.freeFlight=true;demoState.powerOn=true;demoState.stage='free_flight';world.fleet.parkActive(ship);
    const bay=world.fleet.records.find(r=>r.variant===variant);player.placeOnAsteroid(asteroidBase,new BABYLON.Vector3(bay.x+6.5,3.38,bay.z));controlMode='foot';ui.setMode('foot');
  });
  panel.style.left='4px';panel.style.maxWidth='calc(100vw - 8px)';panel.style.flexWrap='wrap';
  document.body.append(panel);
}
