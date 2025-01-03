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
  warawara.position.set(0, 0, 0);
  warawara.scale.set(0.3, 0.3, 0.3);
  warawara.rotation.set(0, Math.PI, 0);

  return {
    warawara,
  };
}

export { loadWarawara };
