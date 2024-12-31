import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { setupModel } from './setupModel.js';

async function loadBirds() {
  const loader = new GLTFLoader();

  const [parrotData,] = await Promise.all([
    loader.loadAsync('/assets/models/Parrot.glb'),
  ]);

  console.log('Squaaawk!', parrotData);

  const parrot = setupModel(parrotData);
  parrot.position.set(0, 0, 0);
  parrot.scale.set(0.1, 0.1, 0.1);

  return {
    parrot,
  };
}

export { loadBirds };
