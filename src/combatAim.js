export function leadPoint(origin, shooterVelocity, targetPosition, targetVelocity, projectileSpeed) {
  const velocity = (targetVelocity || BABYLON.Vector3.Zero()).subtract(shooterVelocity);
  let time = BABYLON.Vector3.Distance(origin,targetPosition) / projectileSpeed;
  let point = targetPosition;
  for (let i=0;i<3;i++) {
    point = targetPosition.add(velocity.scale(time));
    time = BABYLON.Vector3.Distance(origin,point) / projectileSpeed;
  }
  return point;
}

/** Ballistic sight uses the same world-down gravity as aircraft bombs (18 m/s²). */
export function bombImpactPoint(position,velocity,groundY,gravity=18){
  const h=position.y-groundY;if(!Number.isFinite(h)||h<=0||gravity<=0)return null;
  const t=(velocity.y+Math.sqrt(velocity.y*velocity.y+2*gravity*h))/gravity;
  if(!Number.isFinite(t)||t>4.5)return null;
  return position.add(velocity.scale(t)).add(new BABYLON.Vector3(0,-.5*gravity*t*t,0));
}
