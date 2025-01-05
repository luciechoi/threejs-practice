import { AnimationMixer } from 'three';

function setupModel(data) {
  const model = data.scene.children[0];
  model.castShadow = true;
  model.receieveShadow = true;
  model.userData.physics = { mass: 1 };

  if (data.animations.length > 0) {
    console.log('Adding animation')
    const clip = data.animations[0];
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.play();
    model.tick = (delta) => mixer.update(delta);
  }

  return model;
}

export { setupModel };
