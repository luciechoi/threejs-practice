import * as THREE from 'three'

function createLights() {
  const mainLight = new THREE.SpotLight('white', 4);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 4096;
  mainLight.shadow.mapSize.height = 4096;

  return { mainLight };
}

export { createLights };
