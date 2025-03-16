import '../App.css';
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useLoader, invalidate, useThree, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import VertexShader from '../assets/shaders/rasterization/vertex.glsl?raw'
import FragmentShader from '../assets/shaders/rasterization/fragment.glsl?raw'
import catHigh from '../assets/images/cat-walk-high.jpg'
import catLow from '../assets/images/cat-walk-low.jpg'
import checkerBoard from '../assets/images/checkerboard.png'
import colorMap from '../assets/textures/COL_1K_METALNESS.png'
import roughnessMap from '../assets/textures/ROUGHNESS_1K_METALNESS.png'
import displacementMap from '../assets/textures/DISP16_1K_METALNESS.png'
import ambientOcclusionMap from '../assets/textures/AO_1K_METALNESS.png'
import normalMap from '../assets/textures/NRM_1K_METALNESS.png'
import { 
    TextureLoader, Uniform, Vector2, SRGBColorSpace, NearestFilter,
    LinearFilter, LinearMipmapLinearFilter, RepeatWrapping,
    Vector3
} from 'three'
import { Leva, useControls } from 'leva'
import { useLocation } from 'react-router-dom'

const interpolationOptions = ['Nearest', 'Bilinear'];

const MagnificationImage = ({interpolationType = 'Nearest'}) => {
    const tx = useLoader(TextureLoader, catLow);
    // tx.colorSpace = SRGBColorSpace;
    const textureRef = useRef();
    textureRef.current = tx;
    useEffect(() => {
        console.log("Updating interpolation type to " + interpolationType);
        switch (interpolationType) {
            case 'Nearest': {
                textureRef.current.magFilter = NearestFilter;
                break;
            }
            default: {
                textureRef.current.magFilter = LinearFilter;
            }
        }
        textureRef.current.needsUpdate = true;
    }, [interpolationType])
    
    const uniforms = useRef();
    uniforms.current ??= {
        u_texture: { value: tx }
    }
    return(
        <mesh >
            <planeGeometry args={[15, 15]}/>
            {/* <shaderMaterial 
                vertexShader={VertexShader}
                fragmentShader= {FragmentShader}
                uniforms={uniforms.current}
                /> */}
            <meshBasicMaterial map={textureRef.current} />
        </mesh>
    )
};

function TextureMagnification() {
    const interpolationOption
    = useControls( { interpolation: { value: 'Nearest', options: interpolationOptions } });
    const [collapsed, setCollapsed] = useState(true)
        useEffect(() => {
        const timeoutId = setTimeout(() => { setCollapsed(false) }, 0)
        return () => clearTimeout(timeoutId)
        }, [])
    return (
        <>  
            <div className="header-div" style={{ marginTop: '20px' }}>
                original image:<br/>
                <img src={catLow} alt="cat low res" />
            </div>
            <div className="canvas-container">
                <div className="canvas-div" >
                    <Canvas>
                        <MagnificationImage interpolationType={interpolationOption.interpolation} />
                        <OrbitControls />
                    </Canvas>
                </div>
                <div className="leva-container">
                    <Leva fill collapsed={{collapsed, onChange: (value) => { setCollapsed(value) },}}/>
                </div>
            </div>
        </>
    )
}

const filterOptions = ['Nearest', 'Bilinear', 'Trilinear (Mipmap)'];

const MinificationImage = ({filterType = 'Nearest'}) => {
    const tx = useLoader(TextureLoader, catHigh);
    const textureRef = useRef();
    textureRef.current = tx;
    useEffect(() => {
        console.log("Updating filter type to " + filterType);
        switch (filterType) {
            case 'Nearest': {
                textureRef.current.minFilter = NearestFilter;
                break;
            }
            case 'Bilinear': {
                textureRef.current.minFilter = LinearFilter;
                break;
            }
            default: {
                textureRef.current.minFilter = LinearMipmapLinearFilter;
            }
        }
        textureRef.current.needsUpdate = true;
    }, [filterType])

    return(
        <mesh >
            <planeGeometry args={[5, 5]}/>
            <meshBasicMaterial map={textureRef.current} />
        </mesh>
    )
};


function TextureMinification() {
    const filterOption
        = useControls( { filter: { value: 'Nearest', options: filterOptions } });
    
    const [collapsed, setCollapsed] = useState(true)
        useEffect(() => {
          const timeoutId = setTimeout(() => { setCollapsed(false) }, 0)
          return () => clearTimeout(timeoutId)
        }, [])
    return (
        <>  
            <div className="canvas-container">
                <div className="canvas-div">
                    <Canvas gl={{antialias: false}}>
                        <MinificationImage filterType={filterOption.filter}/>
                        <OrbitControls />
                    </Canvas>
                </div>
                <div className="leva-container">
                    <Leva fill collapsed={{collapsed, onChange: (value) => { setCollapsed(value) },}}/>
                </div>
            </div>
            <div className="header-div" style={{ marginTop: '20px' }}>
                {/* <h2>Texture Minification</h2> */}
                original image:<br/>
                <img src={catHigh} alt="cat high res" />
            </div>
        </>
    )
}

function AnisotropicImage() {
    const { gl } = useThree();
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    const anisotropyOption
        = useControls( {
            anisotropy: { value: 1, min: 1, max: maxAnisotropy, step: 1 },
            minFilter: { value: false },
            magFilter: { value: false }
        });

    const tx = useLoader(TextureLoader, checkerBoard);
    tx.repeat = new Vector2(30, 30);
    tx.wrapS = RepeatWrapping;
    tx.wrapT = RepeatWrapping;
    tx.magFilter = NearestFilter;
    tx.minFilter = NearestFilter;

    const meshRef = useRef();
    useFrame(() => {
        meshRef.current.rotation.z += 0.0005;
    })

    const textureRef = useRef();
    textureRef.current = tx;
    useEffect(() => {
        console.log("Updating sampling ");
        textureRef.current.anisotropy = anisotropyOption.anisotropy;
        if (anisotropyOption.magFilter) {
            textureRef.current.magFilter = LinearFilter;
        } else {
            textureRef.current.magFilter = NearestFilter;
        }
        if (anisotropyOption.minFilter) {
            textureRef.current.minFilter = LinearMipmapLinearFilter;
        } else {
            textureRef.current.minFilter = NearestFilter;
        }
        textureRef.current.needsUpdate = true;
    }, [anisotropyOption])

    return(
        <mesh position={[0, 2.5, 0]} rotation={[-1, 0, 0]} ref={meshRef} >
            <planeGeometry args={[100, 100] }/>
            <meshBasicMaterial map={textureRef.current} />
        </mesh>
    )
}

function Anisotropic() {
    const [collapsed, setCollapsed] = useState(true)
        useEffect(() => {
        const timeoutId = setTimeout(() => { setCollapsed(false) }, 0)
        return () => clearTimeout(timeoutId)
        }, [])
    return (
        <>  
            <div className="header-div" style={{ marginTop: '20px' }}>
                texture:<br/>
                <img src={checkerBoard} alt="checkerboard" />
            </div>
            <div className="canvas-container">
                <div className="canvas-div" >
                    <Canvas >
                        <AnisotropicImage/>
                        <OrbitControls />
                    </Canvas>
                </div>
                <div className="leva-container">
                    <Leva fill collapsed={{collapsed, onChange: (value) => { setCollapsed(value) },}} />
                </div>
            </div>
        </>
    )
}

function MappingScene() {
    const colorTx = useLoader(TextureLoader, colorMap);
    const displacementTx = useLoader(TextureLoader, displacementMap);
    const roughnessTx = useLoader(TextureLoader, roughnessMap);
    const ambientOcclusionTx = useLoader(TextureLoader, ambientOcclusionMap);
    const normalTx = useLoader(TextureLoader, normalMap);

    return (
        <>  
            {/* <ambientLight /> */}
            <directionalLight position={[0, 20, -150]}  castShadow />
            <mesh position={[0, 1, -100]} castShadow>
                <sphereGeometry args={[20, 100, 100]}/>
                <meshStandardMaterial
                    map={colorTx}
                    roughnessMap={roughnessTx}
                    roughness={0.5}
                    displacementMap={displacementTx}
                    aoMap={ambientOcclusionTx}
                    aoMapIntensity={1}
                    normalMap={normalTx}
                    normalScale={new Vector2(5, 5)}
                />
            </mesh>
            <mesh position={[0, -30, -100]} rotation={[-1.5, 0, 0]} receiveShadow>
                <planeGeometry args={[100, 100]}/>
                <meshPhongMaterial color={'white'} />
            </mesh>
        </>
    )
}

function Textures() {
    const textureTypes
        = useControls( {
            colorMap: { value: true },
            displacementMap: { value: false },
            normalMap: { value: false },
            roughnessMap: { value: false },
            ambeintOcclusionMap: {value: false},
            environmentMap: { value: false },
        });
    const [collapsed, setCollapsed] = useState(true)
        useEffect(() => {
          const timeoutId = setTimeout(() => { setCollapsed(false) }, 0)
          return () => clearTimeout(timeoutId)
        }, [])

    return (
        <>  
            <div className="header-div" style={{ marginTop: '20px' }}>
                textures:
            </div>
            <div className="canvas-container">
                <div className="canvas-div">
                    <Canvas shadows>
                        <MappingScene/>
                        <Environment preset="forest" background />
                        <OrbitControls />
                    </Canvas>
                </div>
                <div className="leva-container">
                    <Leva fill
                        theme={{ sizes: { rootWidth: "200px", controlWidth: '30px' } }}
                        collapsed={{collapsed, onChange: (value) => { setCollapsed(value) },}}
                    />
                </div>
            </div>
        </>
    )
}

function SubPage() {
    const section = useLocation();
    switch(section.hash) {
        case ('#magnification'): {
            return <TextureMagnification/>;
        }
        case ('#minification'): {
            return <TextureMinification/>;
        }
        case ('#anisotropic'): {
            return <Anisotropic/>;
        }
        case ('#textures'): {
            return <Textures/>;
        }
        default: {
            return <TextureMagnification/>;
        }
    }
}

function getSectionIdTag(pageName) {
    const section = useLocation().hash;
    if (pageName == section) {
        return 'selected'
    }
    return ''
}

const hrefs = ["#magnification", "#minification", "#anisotropic", "#textures"];

export default function TextureMappingPage() {
    const section = useLocation().hash;
    if (!hrefs.includes(section)) {
        window.location.href = hrefs[0];
        location.reload();
    }

    return (
        <>
            <div className="title-div">
                <h1>Texture Mapping</h1>
                <a href="#magnification"><h2 className='section' id={getSectionIdTag("#magnification")}>Magnification</h2></a>
                <h2 className='section'>|</h2>
                <a href="#minification"><h2 className='section' id={getSectionIdTag("#minification")}>Minification</h2></a>
                <h2 className='section'>|</h2>
                <a href="#anisotropic"><h2 className='section' id={getSectionIdTag("#anisotropic")}>Anisotropic</h2></a>
                <h2 className='section'>|</h2>
                <a href="#textures"><h2 className='section' id={getSectionIdTag("#textures")}>Textures</h2></a>
            </div>
            <SubPage />
        </>
    )
}
