export function fieldRepairTexture(scene) {
  const existing = scene.getTextureByName('fieldRepairAtlas');
  if (existing) return existing;
  const texture = new BABYLON.Texture('./assets/textures/nomad/field-repairs.webp',scene);
  texture.name = 'fieldRepairAtlas';
  texture.hasAlpha = true;
  texture.wrapU = texture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
  texture.anisotropicFilteringLevel = 8;
  return texture;
}
