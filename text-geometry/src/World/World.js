import * as THREE from 'three';
import { loadBirds } from './components/birds/birds.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { loadTexts } from './components/texts/texts.js';

let camera;
let controls;
let renderer;
let scene;
let loop;

/** TODO
 * - Add debug ui
 * - Add bounding box ui
 * - Add curvature to the text
 */
class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);

    const { ambientLight, mainLight } = createLights();

    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight);

    const axesHelper = new THREE.AxesHelper( 1 );
    scene.add( axesHelper );

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    const { parrot } = await loadBirds();
    const { text } = await loadTexts();

    controls.target.copy(parrot.position);
    loop.updatables.push(parrot);
    scene.add(parrot);

    loop.updatables.push(text);
    scene.add(text);
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
