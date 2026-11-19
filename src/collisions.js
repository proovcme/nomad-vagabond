// Babylon's swept ellipsoid solver: static level triangles, arcade flight/feet.
// Dedicated invisible proxies keep detailed imported visual meshes out of the solver.
export class CollisionWorld {
  constructor(scene) {
    this.scene = scene;
    scene.collisionsEnabled = true;
    this.foot = BABYLON.MeshBuilder.CreateBox('footCollisionProxy', {size:1}, scene);
    this.foot.isVisible = false; this.foot.isPickable = false;
    this.foot.ellipsoid.set(.45,.925,.45);
    this.foot.ellipsoidOffset.set(0,.925,0);
    this.air = BABYLON.MeshBuilder.CreateBox('airCollisionProxy', {size:1}, scene);
    this.air.isVisible = false; this.air.isPickable = false;
    this.air.ellipsoid.set(3.3,1.4,3.4);
    this.hits = 0;
    this.lastHit = null;
    this.air.onCollide = mesh => {this.hits++;this.lastHit=mesh.name;};
    this.foot.onCollide = mesh => {this.hits++;this.lastHit=mesh.name;};
  }
  move(from, desired, kind='foot') {
    const proxy = kind === 'aircraft' ? this.air : this.foot;
    proxy.position.copyFrom(from);
    proxy.computeWorldMatrix(true);
    proxy.moveWithCollisions(desired.subtract(from));
    return proxy.position.clone();
  }
  /** Grounded character motion keeps both boots and head in the swept body.
   * A bounded up/across/down sweep handles real stair risers, with a separate
   * ceiling-clearance test. Low overhangs block travel instead of pushing boots
   * below the known support surface.
   */
  moveGrounded(from, desired, {grounded=false, floorAt=null, stepHeight=.36}={}) {
    let resolved=this.move(from,desired,'foot');
    if(!grounded||typeof floorAt!=='function')return resolved;
    const B=BABYLON;
    const horizontal=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
    const requested=horizontal(from,desired),normalProgress=horizontal(from,resolved);
    const fromFloor=floorAt(from),desiredFloor=floorAt(desired);
    const obstructed=horizontal(resolved,desired)>.006;
    // Only a rising walk surface permits stepping. Flat floors under low wings
    // never invoke a step-up and cannot turn into a tunnel beneath the aircraft.
    if(requested>.001&&obstructed&&desiredFloor>fromFloor+.005&&desiredFloor-fromFloor<=stepHeight+.01){
      const raisedTarget=from.add(new B.Vector3(0,stepHeight,0));
      const raised=this.move(from,raisedTarget,'foot');
      if(raised.y>=raisedTarget.y-.012){
        const across=this.move(raised,new B.Vector3(desired.x,raised.y,desired.z),'foot');
        if(horizontal(from,across)>normalProgress+.006){
          const floor=floorAt(across);
          const landed=this.move(across,new B.Vector3(across.x,floor,across.z),'foot');
          if(landed.y>=floor-.012&&landed.y-from.y<=stepHeight+.025){resolved=landed;this.stepUps=(this.stepUps||0)+1;}
        }
      }
    }
    const support=floorAt(resolved);
    if(Number.isFinite(support)&&resolved.y<support-.012){
      // Reject the unsafe horizontal move; raising the resolved point in place
      // would insert the character's head through the low obstacle.
      resolved=from.clone();
      if(Number.isFinite(fromFloor))resolved.y=Math.max(resolved.y,fromFloor);
      this.blockedDownwardPushes=(this.blockedDownwardPushes||0)+1;
    }
    return resolved;
  }
  get snapshot() {return {engine:'Babylon swept ellipsoid',colliders:this.scene.meshes.filter(m=>m.checkCollisions).length,hits:this.hits,lastHit:this.lastHit,footHeight:this.foot.ellipsoid.y*2,footBottomOffset:this.foot.ellipsoidOffset.y-this.foot.ellipsoid.y,stepUps:this.stepUps||0,blockedDownwardPushes:this.blockedDownwardPushes||0};}
}

export function makeSolid(mesh, enabled = true) {
  if (!mesh || !mesh.getTotalVertices || !mesh.getTotalVertices()) return;
  mesh.checkCollisions = enabled;
  mesh.metadata = {...mesh.metadata, solid:enabled};
}
