import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { setupAnimation } from './setupAnimation';

let textString1 = '모든 사람은 태어날 때부터 자유롭고, 존엄성과 권리에 있어서 평등하다. 사람은 이성과 양심을 부여받았으며 서로에게 형제의 정신으로 대하여야 한다.';

async function loadFont() {
    const fontLoader = new FontLoader();
    const [font,] = await Promise.all([
        fontLoader.loadAsync(
            '/assets/fonts/gowun_dodum_regular.typeface.json',
        )
      ]);
    return font;
}

async function loadTexts() {
    const font = await loadFont()
    const textGeometry = new TextGeometry(
        textString1,
        {
            font: font,
            size: 0.05,
            depth: 0.005,
            // curveSegments: 12,
            // bevelEnabled: true,
            // bevelThickness: 0.03,
            // bevelSize: 0.02,
            // bevelOffset: 0,
            // bevelSegments: 5
        }
    )
    const textMaterial = new THREE.MeshBasicMaterial({
        'color': 'white'
    })
    const text = new THREE.Mesh(textGeometry, textMaterial)
    text.position.set(0, 0, 0);

    setupAnimation(text);
    return { text }
}

export { loadTexts };