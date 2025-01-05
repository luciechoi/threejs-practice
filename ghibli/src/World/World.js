import { loadWarawara } from './components/warawara/warawara.js';
import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';
import { loadEnvironments } from './components/environment/environment.js';
import { setUpRayCaster } from './systems/raycaster.js';

let camera;
let controls;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);

    controls = createControls(camera, renderer.domElement);
    loop.updatables.push(controls);

    const { spotLight, directionalLight } = createLights();
    scene.add(spotLight, spotLight.target, directionalLight,);
    setUpRayCaster(camera, scene, spotLight);
    loop.updatables.push(spotLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    // Ammo().then( function ( AmmoLib ) {
    //   Ammo = AmmoLib;

    //   // init();

    // } );
    const { floor } = loadEnvironments();
    scene.add(floor);

    for (let i = 0; i < 5; i++) {
      const warawara = await loadWarawara();
      scene.add(warawara);
      if (warawara.tick) {
        loop.updatables.push(warawara);
      }
    }

    // move the target to the center of the front bird
    // controls.target.copy(vector);
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
