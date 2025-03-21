import * as THREE from 'three'

function createCamera() {
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  camera.position.set(0, 2, -2);

  return camera;
}

export { createCamera };
