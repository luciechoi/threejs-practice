import * as THREE from 'three'

function createLights() {
  const directionalLight = new THREE.DirectionalLight(
    'white',
    1
  );
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 4096;
  directionalLight.shadow.mapSize.height = 4096;

  const spotLight = new THREE.SpotLight(
    0xE4C68F,
    1000, // intensity
    0, // distance
    Math.PI / 20, // angle
    0.2, // penumbra
  );
  spotLight.position.set(0, 5, 0);
  spotLight.target.position.set(0, 0, 0);

  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 4096;
  spotLight.shadow.mapSize.height = 4096;

  return { spotLight, directionalLight};
}

export { createLights };
