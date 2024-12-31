import { AnimationMixer, AnimationClip, NumberKeyframeTrack, MathUtils, Box3, Vector3 } from 'three';

function setupAnimation(model) {
  setInitialPosition(model);

  const mixer = new AnimationMixer(model);
  const period = 1000;
  const clip = createTranslateClip(period, 'x', 'rotationAnimation')

  const action = mixer.clipAction(clip);
  // action.play();

  model.tick = (delta) => mixer.update(delta);
}

function setInitialPosition(model) {
  const boundingBox = new Box3().setFromObject(model);
  let boxSize = new Vector3();
  boundingBox.getSize(boxSize) // Returns Vector3
  console.log(boxSize);
  // Place in front of the main model.
  model.position.z = 1;
  model.position.x = -boxSize['x']/5;
  model.position.y = -boxSize['x']/5;
  model.rotation.z = MathUtils.degToRad(45);
}

function createRotationClip( period, axis, animationName ) {

		const times = [ 0, period ];
    const values = [ 0, 360 ];

		const trackName = '.rotation[' + axis + ']';

		const track = new NumberKeyframeTrack( trackName, times, values );

		return new AnimationClip(animationName, period, [ track ] );

}

function createTranslateClip( period, axis, animationName ) {

  const times = [ 0, period ];
  const values = [ 0, -2 ];

  const trackName = '.position[' + axis + ']';

  const track = new NumberKeyframeTrack( trackName, times, values );

  return new AnimationClip(animationName, period, [ track ] );

}

export { setupAnimation };
