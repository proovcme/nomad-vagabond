// Aircraft anchors use [forward, right, up] for the look point and
// [behind, right, up] for the camera. Escort anchors use world XYZ.
export function openingFrame(camera,ship,enemy,time,shots){
  const B=BABYLON;
  let shot=shots[0],local=Math.max(0,time);
  for(let i=0;i<shots.length;i++){
    shot=shots[i];if(local<shot.seconds||i===shots.length-1)break;
    local-=shot.seconds;
  }
  const u=Math.min(1,local/shot.seconds),t=u*u*(3-2*u);
  const [a,b,c]=shot.fromPos.map((n,i)=>n+(shot.toPos[i]-n)*t);
  const [x,y,z]=shot.look;
  if(shot.target==='escort'){
    camera.position.copyFrom(enemy.position).addInPlaceFromFloats(a,b,c);
    camera.setTarget(enemy.position.add(new B.Vector3(x,y,z)));
  }else{
    const mat=ship.computeWorldMatrix(true),f=B.Vector3.TransformNormal(new B.Vector3(0,0,-1),mat).normalize(),r=B.Vector3.TransformNormal(B.Axis.X,mat).normalize();
    camera.position.copyFrom(ship.position).addInPlace(f.scale(-a)).addInPlace(r.scale(b)).y+=c;
    const aim=ship.position.add(f.scale(x)).addInPlace(r.scale(y));aim.y+=z;camera.setTarget(aim);
  }
  camera.upVector.set(0,1,0);camera.fov=shot.fov+(shot.endFov-shot.fov)*t;
  return shot;
}
