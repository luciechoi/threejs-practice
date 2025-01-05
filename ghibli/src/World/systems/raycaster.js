import * as THREE from 'three';

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function setUpRayCaster(camera, scene, spotLight) {
    console.log("setting up ray caster");
    window.addEventListener( 'pointermove', onPointerMove );

    spotLight.tick = (delta) => {
        // update the picking ray with the camera and pointer position
        raycaster.setFromCamera( pointer, camera );

        // calculate objects intersecting the picking ray
        const intersects = raycaster.intersectObjects( scene.children );
        if (intersects.length <= 0) {
            return;
        }
        const intersection = intersects[0].point;
        // Update the position that the spotlight is highlighting
        spotLight.target.position.set(intersection.x, intersection.y, intersection.z);
    }
    return spotLight;
}

function onPointerMove( event ) {
    
    // calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
    
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

export { setUpRayCaster };

// function render() {


// 	renderer.render( scene, camera );
// }

// window.requestAnimationFrame(render);