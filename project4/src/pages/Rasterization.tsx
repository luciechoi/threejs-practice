import '../App.css';
import { Canvas, useLoader, invalidate } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function RasterizationPage() {
  return (
    <>
        <div className="header-div">
            <h1>Rasterization</h1>
            <h2>Texture Magnification</h2>
        </div>
        <div className="canvas-div">
            <Canvas>
                <OrbitControls />
            </Canvas>
        </div>
    </>
  )
}
