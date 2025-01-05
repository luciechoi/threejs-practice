import { loadWarawara } from './components/warawara/warawara.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js';
import { loadEnvironments } from './components/environment/environment.js';

let camera;
let controls;
let renderer;
let scene;
let loop;
let physics;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);

    const { mainLight } = createLights();

    loop.updatables.push(controls);
    scene.add( mainLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    physics = await AmmoPhysics();
    const { floor } = loadEnvironments();
    scene.add(floor);

    const { warawara } = await loadWarawara();

    // move the target to the center of the front bird
    controls.target.copy(warawara.position);

    if (warawara.tick) {
      loop.updatables.push(warawara);
    }
    scene.add(warawara);

    console.log("scene", scene);
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
