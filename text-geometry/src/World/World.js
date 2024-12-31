import * as THREE from 'three';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { loadTexts } from './components/texts/texts.js';
import { loadHead } from './components/head/head.js';

let camera;
let controls;
let renderer;
let scene;
let loop;

/** TODO
 * - Add debug ui
 * - Make the head model better
 * - Make the curvature smooth
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
    const { flows, lines } = await loadTexts();
    for (let i in flows) {
      scene.add(flows[i].object3D);
      loop.updatables.push(flows[i]);
    }
    for (let i in lines) {
      // scene.add(lines[i]);
    }
    
    const { head } = await loadHead();
    scene.add(head);
    controls.target.copy(head.position);
    loop.updatables.push(head);
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
