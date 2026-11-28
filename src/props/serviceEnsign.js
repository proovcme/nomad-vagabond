// A split fly and a stepped ivory wing identify the ports served by the cruiser.
export function mountServiceEnsign(scene, parent, position, width, height) {
  const B = BABYLON;
  const paths = Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 17 }, (_, column) => {
      const u = column / 16, v = row / 4;
      const notch = 0.22 * (1 - Math.abs(2 * v - 1)) * u ** 4;
      return new B.Vector3(width * (u - notch), -height * (v + 0.09 * u),
        height * u * (0.22 * Math.sin(10 * u + v) + 0.12));
    }));
  const cloth = B.MeshBuilder.CreateRibbon('serviceEnsign', {
    pathArray: paths, sideOrientation: B.Mesh.DOUBLESIDE,
    uvs: paths.flatMap((row, j) => row.map((_, i) => new B.Vector2(i / 16, 1 - j / 4))),
  }, scene);
  let mat = scene.getMaterialByName('serviceEnsignCanvas');
  if (!mat) {
    mat = new B.StandardMaterial('serviceEnsignCanvas', scene);
    mat.diffuseTexture = new B.Texture('./assets/textures/nomad/service-ensign.webp', scene);
    mat.specularColor.set(0.06, 0.06, 0.05);
  }
  cloth.material = mat;
  cloth.parent = parent;
  cloth.position.copyFrom(position);
  cloth.isPickable = false;
  const sway = scene.onBeforeRenderObservable.add(() => {
    cloth.rotation.y = 0.13 * Math.sin(performance.now() * 0.0016 + width);
  });
  cloth.onDisposeObservable.addOnce(() => scene.onBeforeRenderObservable.remove(sway));
}
