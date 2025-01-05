import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { setupModel } from './setupModel.js';
import { Object3D } from 'three';

async function loadWarawara() {
  const loader = new GLTFLoader();

  const [warawaraData, ] = await Promise.all([
    loader.loadAsync('/assets/models/warawara-static.glb'),
  ]);

  console.log('Wara wara!', warawaraData);

  const warawara = setupModel(warawaraData);
  warawara.position.set(Math.random(0, 2), -0.08, Math.random(0, 2));
  warawara.scale.set(0.3, 0.3, 0.3);
  const rotation = Math.PI + Math.random(-0.5, 0.5);
  warawara.rotation.set(0, rotation, 0);
  warawara.userData.physics = { mass: 1 };

  warawara.traverse(function(node) {
    if (node.isMesh) {
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });

  return warawara;
}

export { loadWarawara };
