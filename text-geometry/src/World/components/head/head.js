import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { setupAnimation } from '../head/setupAnimation';
import { Vector3 } from 'three';

async function loadHead() {
  const loader = new GLTFLoader();

  const [objData,] = await Promise.all([
    loader.loadAsync('/assets/models/head/head.glb'),
  ]);

  console.log(objData);
  const head = objData.scene.children[0];
  head.position.set(0, 0, 0);
  head.scale.set(0.001, 0.001, 0.001);
  head.rotateOnAxis(new Vector3(1, 0, 0), -Math.PI/2);
  head.rotateOnAxis(new Vector3(0, 1, 0), -1);

  setupAnimation(head);
  return {
    head
  };
}

export { loadHead };
