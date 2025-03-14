import '../App.css';
import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useLoader, invalidate, useThree, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import VertexShader from '../assets/shaders/rasterization/vertex.glsl?raw'
import FragmentShader from '../assets/shaders/rasterization/fragment.glsl?raw'
import catHigh from '../assets/images/cat-walk-high.jpg'
import catLow from '../assets/images/cat-walk-low.jpg'
import checkerBoard from '../assets/images/checkerboard.png'
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
    return (
        <>  
            <div className="header-div" style={{ marginTop: '20px' }}>
                original image:<br/>
                <img src={catLow} alt="cat low res" />
            </div>
            <div className="canvas-div" style={{ marginTop: '100px' }}>
                <div style={{width: 300, position:"absolute", right:0, top:0, zIndex: 100}}>
                    <Leva fill/>
                </div>
                <Canvas>
                    <MagnificationImage interpolationType={interpolationOption.interpolation} />
                    <OrbitControls />
                </Canvas>
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
    return (
        <>  
            <div className="header-div" style={{ marginTop: '20px' }}>
                {/* <h2>Texture Minification</h2> */}
                original image:<br/>
                <img src={catHigh} alt="cat high res" />
            </div>
            <div className="canvas-div" style={{ marginTop: '120px' }}>
                <Leva/>
                <Canvas gl={{antialias: false}}>
                    <MinificationImage filterType={filterOption.filter}/>
                    <OrbitControls />
                </Canvas>
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
    return (
        <>  
            <div className="header-div" style={{ marginTop: '20px' }}>
                original image:<br/>
                <img src={checkerBoard} alt="checkerboard" />
            </div>
            <div className="canvas-div" style={{ marginTop: '120px' }}>
                <Leva />
                <Canvas >
                    <AnisotropicImage/>
                    <OrbitControls />
                </Canvas>
            </div>
        </>
    )
}

function MappingScene() {
    return (
        <mesh>
            <sphereGeometry />
            <meshBasicMaterial />
        </mesh>
    )
}

function Mapping() {
    const mapTypes
        = useControls( {
            textureMap: { value: false },
            normalMap: { value: false },
            displacementMap: { value: false },
            environmentMap: { value: false },
        });
    return (
        <>  
            <div className="header-div" style={{ marginTop: '20px' }}>
                original image:<br/>
                <img src={checkerBoard} alt="checkerboard" />
            </div>
            <div className="canvas-div" style={{ marginTop: '120px' }}>
                <Leva theme={{ sizes: { rootWidth: "200px", controlWidth: '30px'  } }} />;
                <Canvas >
                    <MappingScene/>
                    <OrbitControls />
                </Canvas>
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
        case ('#mapping'): {
            return <Mapping/>;
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

const hrefs = ["#magnification", "#minification", "#anisotropic", "#mapping"];

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
                <a href="#mapping"><h2 className='section' id={getSectionIdTag("#mapping")}>Mapping</h2></a>
            </div>
            <SubPage />
        </>
    )
}
