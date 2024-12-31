import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { setupAnimation } from './setupAnimation';
import { Flow } from 'three/addons/modifiers/CurveModifier.js';

let textString1 = 'When something is important enough, you do it even if the odds are not in your favor.';
let textString2 = '오직 한없이 가지고 싶은 것은 높은 문화의 힘이다. 문화의 힘은 우리 자신을 행복하게 하고, 나아가서 남에게 행복을 주기 때문이다.';
let textString3 = 'The meaning of life is to find your gift. The purpose of life is to give it away.';
let textString4 = 'A well-designed life is a life that makes sense. It\'s a life in which who you are, what you believe and what you do all line up together.'

// let textString4 = ''
// for (let i = 0; i < verticalText.length; i++) {
//     const char = verticalText[i];
//     textString4 = textString4.concat(char, '\n')
// }
// console.log(textString4)

let textConfigs = [
    {
        text: textString1,
        textSize: 0.05,
        name: "string1",
        textRotationAngles: [-Math.PI/4, 0, 0],
        curveScale: 0.5,
        curveSpeed: -0.002,
        curveRotationAxis: new THREE.Vector3(0, 0, 1),
        curveRotationAngle: -Math.PI/4,
    },
    {
        text: textString2,
        textSize: 0.03,
        name: "string2",
        textRotationAngles: [Math.PI/4, 0, 0],
        curveScale: 0.8,
        curveSpeed: 0.0005,
        curveRotationAxis: new THREE.Vector3(0, 0, 1),
        curveRotationAngle: Math.PI/4,
    },
    {
        text: textString3,
        textSize: 0.03,
        name: "string3",
        textRotationAngles: [0, 0, 0],
        curveScale: 0.7,
        curveSpeed: 0.001,
        curveRotationAxis: new THREE.Vector3(0, 0, 0),
        curveRotationAngle: 0,
    },
    {
        text: textString4,
        textSize: 0.02,
        name: "string4",
        textRotationAngles: [0, 0, 0],
        curveScale: 0.4,
        curveSpeed: -0.0005,
        curveRotationAxis: new THREE.Vector3(0, 0, 1),
        curveRotationAngle: -Math.PI/2,
    },
    // {
    //     text: verticalText,
    //     textSize: 0.03,
    //     name: "string4",
    //     textRotationAngles: [0, 0, -Math.PI/2],
    //     curveScale: 0.6,
    //     curveSpeed: -0.0005,
    //     curveRotationAxis: new THREE.Vector3(0, 0, 1),
    //     curveRotationAngle: Math.PI/2,
    // },
];

async function loadFont() {
    const fontLoader = new FontLoader();
    const [font,] = await Promise.all([
        fontLoader.loadAsync(
            '/assets/fonts/gowun_dodum_regular.typeface.json',
        )
      ]);
    return font;
}

function createTextFlow(font, textConfig) {
    const textGeometry = new TextGeometry(
        textConfig.text,
        {
            font: font,
            size: textConfig.textSize,
            depth: 0.005,
            curveSegments: 12,
            // bevelEnabled: true,
            // bevelThickness: 0.005,
            // bevelSize: 0.001,
            // bevelOffset: 0,
            // bevelSegments: 5
        }
    )
    // Flip the text upside down
    textGeometry.rotateX(Math.PI);
    // Put the line in the center of the text
    textGeometry.translate(0, textConfig.textSize * 0.5, 0);
    // Rotate the text along with the curve.
    textGeometry.rotateX(textConfig.textRotationAngles[0]);
    textGeometry.rotateY(textConfig.textRotationAngles[1]);
    textGeometry.rotateZ(textConfig.textRotationAngles[2]);

    const textMaterial = new THREE.MeshBasicMaterial({
        'color': 'white',
        side: THREE.DoubleSide,
    })
    const textObject = new THREE.Mesh(textGeometry, textMaterial);
    textObject.name = textConfig.name;

    const flow = new Flow( textObject );
    const {line, curve} = getCurve(
        textConfig.curveScale,
        textConfig.curveRotationAxis,
        textConfig.curveRotationAngle,
    );
    // curve.mesh.applyAxisAngle(rotationVector, rotationAngle)
    flow.updateCurve( 0, curve );
    flow.tick = (delta) => {
        // console.log(flow.uniforms.pathOffset)
        flow.moveAlongCurve( textConfig.curveSpeed );
    };
    return {flow, line}
}

async function loadTexts() {
    const font = await loadFont()
    const flows = [];
    const lines = [];
    textConfigs.forEach((textConfig) => {
        const {flow, line} = createTextFlow(
            font,
            textConfig,
        )
        flows.push(flow)
        lines.push(line)
    })
    return { flows, lines }
}

function getCurve(
    curveScale,
    curveRotationAxis,
    curveRotationAngle,
) {
    const curveHandles = [];

    const initialPoints = [
        new THREE.Vector3(-curveScale, 0, 0,),
        new THREE.Vector3(0, 0, curveScale),
        new THREE.Vector3(curveScale, 0, 0),
        new THREE.Vector3(0, 0, -curveScale)
    ];

    const boxGeometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    const boxMaterial = new THREE.MeshBasicMaterial();

    for ( const handlePos of initialPoints ) {
        const handle = new THREE.Mesh( boxGeometry, boxMaterial );
        handle.position.copy( handlePos );
        curveHandles.push( handle );
    }

    const curve = new THREE.CatmullRomCurve3(
        curveHandles.map( ( handle ) => 
            handle.position.applyAxisAngle(curveRotationAxis, curveRotationAngle)
    )
    );
    curve.curveType = 'centripetal';
    curve.closed = true;
    const points = curve.getSpacedPoints( 50 );
    const bufferGeometry = new THREE.BufferGeometry().setFromPoints( points );
    const line = new THREE.LineLoop(
        bufferGeometry,
        new THREE.LineBasicMaterial( { color: 'white' } )
    );
    return {line, curve}
}

export { loadTexts };

// const curve = new THREE.EllipseCurve(0, 0, 0.5, 0.5);
// const points = curve.getPoints( 50 );
// const curveGeometry = new THREE.BufferGeometry().setFromPoints( points );
// const curveMaterial = new THREE.LineBasicMaterial( { color : 0xffffff } );
// const line = new THREE.LineLoop( curveGeometry, curveMaterial );
// setupAnimation(text);