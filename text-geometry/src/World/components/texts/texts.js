import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { setupAnimation } from './setupAnimation';

let textString1 = 'ebwbwboinwoianlwnok niwneginwepibnwaekm';

async function loadFont() {
    const fontLoader = new FontLoader();
    const [font,] = await Promise.all([
        fontLoader.loadAsync(
            '/assets/fonts/helvetiker_regular.typeface.json',
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