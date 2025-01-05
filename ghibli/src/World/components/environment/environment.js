import * as THREE from 'three';

function loadEnvironments() {
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(5, 5, 10, 10),
        new THREE.MeshPhongMaterial({
                color: 0x808080,
                side: THREE.DoubleSide,
            }),
    );
    floor.rotateX(Math.PI/2);
    floor.position.set(0, -0.2, 0);
    floor.receiveShadow = true;
    floor.userData.physics = { mass: 0 };

    console.log(floor);
    return { floor, };
}

export { loadEnvironments };