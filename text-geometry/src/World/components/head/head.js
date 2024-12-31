import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setupAnimation } from '../head/setupAnimation';

async function loadHead() {
  const loader = new GLTFLoader();

  const [objData,] = await Promise.all([
    loader.loadAsync('/assets/models/head/head.glb'),
  ]);

  console.log(objData);
  const head = objData.scene.children[0];
  head.position.set(0, 0, 0.3);
  head.scale.set(0.001, 0.001, 0.001);

  setupAnimation(head);
  return {
    head
  };
}

export { loadHead };
