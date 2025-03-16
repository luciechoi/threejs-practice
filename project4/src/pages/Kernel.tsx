import { useState, useRef, useMemo, useEffect } from 'react'
import { Canvas, useLoader, invalidate } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import VertexShader from '../assets/shaders/kernel/vertex.glsl?raw'
import FragmentShader from '../assets/shaders/kernel/fragment.glsl?raw'
import '../App.css'
import { TextureLoader, Uniform, Vector2 } from 'three'
import { Leva, useControls } from 'leva'
import image1 from '../assets/images/me.jpg'
import { MathJaxContext, MathJax } from "better-react-mathjax";

const kernelOptions = [
  'original',
  'box blur',
  'gaussian blur',
  'sharpen',
  'sobel vertical',
  'sobel horizontal',
  'sobel edge detection'
];

const kernels = {
  'original': {
    kernel: [0, 0, 0, 0, 1, 0, 0, 0, 0],
    kernelWeight: 1
  },
  'box blur': {
    kernel: [1, 1, 1, 1, 1, 1, 1, 1, 1],
    kernelWeight: 9
  },
  'gaussian blur': {
    kernel: [
      1, 2, 1,
      2, 4, 2,
      1, 2, 1
    ],
    kernelWeight: 16
  },
  'sharpen': {
    kernel: [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ],
    kernelWeight: 1
  },
  'sobel vertical': {
    kernel: [
      1,  0, -1,
      2,  0, -2,
      1,  0, -1
    ],
    kernelWeight: 1
  },
  'sobel horizontal': {
    kernel: [
      1,  2,  1,
      0,  0,  0,
     -1, -2, -1
    ],
    kernelWeight: 1
  },
};

// TODO:
// 1. Change picture
// 2. Show Frequency domain
const Image = ({kernelType = 'original'}) => {
  const tx = useLoader(TextureLoader, image1);
  const uniforms = useRef();
  uniforms.current ??= {
    u_texture: { value: tx },
    u_textureSize: new Uniform(new Vector2(tx.image.width, tx.image.height)),
    u_kernelWeight: { value: 0 },
    u_kernel: { value: [0, 0, 0, 0, 0, 0, 0, 0, 0]},
    u_kernel2: { value: [0, 0, 0, 0, 0, 0, 0, 0, 0]},
    u_is_sobel_edge: { value: false }
  }
  
  useEffect(() => {
    console.log("Updating kernel type to " + kernelType)
    if (kernelType == 'sobel edge detection') {
      uniforms.current.u_kernel.value = kernels['sobel vertical']['kernel'];
      uniforms.current.u_kernel2.value = kernels['sobel horizontal']['kernel'];
      uniforms.current.u_is_sobel_edge.value = true;
      uniforms.current.u_kernelWeight.value = 1;

    } else {
      uniforms.current.u_kernel.value = kernels[kernelType]['kernel'];
      uniforms.current.u_kernelWeight.value = kernels[kernelType]['kernelWeight'];
      uniforms.current.u_is_sobel_edge.value = false;
    }
  }, [kernelType]);

  return (
    <mesh>
      <planeGeometry args={[5, 5]}/>
      <shaderMaterial
        vertexShader={VertexShader}
        fragmentShader= {FragmentShader}
        uniforms={uniforms.current}
      />
    </mesh>
  )
};

const FrequencyImage = () => {
  return (
    <mesh>
      
    </mesh>
  )
};

export default function KernelPage() {
  const kernelOption
    = useControls( { kernel: { value: 'original', options: kernelOptions } });

  return (
    <>
      <MathJaxContext>
        <div className="header-div">
          <h1>Image Processing</h1>
          <h2>{ kernelOption.kernel }</h2>
          <MathJax>
            {getMarkdown(kernelOption.kernel)}
          </MathJax>
        </div>
        <div className="canvas-div">
          <Leva />
          <Canvas>
            <Image kernelType={kernelOption.kernel}/>
            <OrbitControls />
          </Canvas>
        </div>
      </MathJaxContext>
    </>
  )
}

const getMarkdown = (kernelType = 'original') =>  {
  if (kernelType == 'sobel edge detection') {
    const gx = getMatrixMarkdown(kernels['sobel horizontal']['kernel']);
    const gy = getMatrixMarkdown(kernels['sobel vertical']['kernel']);
    const markdown = `\\(\\sqrt{ (${gx} \\times I )^2 + (${gy} \\times I )^2 } \\)`;
    return markdown;
  }
  const matrix = getMatrixMarkdown(kernels[kernelType]['kernel']);
  const markdown = `\\( ${matrix} \\times I \\)`;
  return markdown;
};

const getMatrixMarkdown = (m) => {
  let matrix = "\\begin{bmatrix} ";
  matrix += `${m[0]} & ${m[1]} & ${m[2]} \\\\`;
  matrix += `${m[3]} & ${m[4]} & ${m[5]} \\\\`;
  matrix += `${m[6]} & ${m[7]} & ${m[8]}`;
  matrix += " \\end{bmatrix}";
  return matrix;
}
