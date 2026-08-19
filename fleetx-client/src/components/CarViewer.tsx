import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

function CarModel({ url }: { url?: string }) {
  const { scene } = useGLTF(url || '/models/car.glb')

  return (
    <primitive
      object={scene}
      scale={350}
      position={[0, -1, 0]}
    />
  )
}

function CarViewer({ modelUrl }: { modelUrl?: string }) {
  return (
    <div className="car-viewer">
      <Canvas
        camera={{
          position: [6, 3, 9 ],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 10, 5]}
          intensity={2}
        />

        <directionalLight
          position={[-5, 5, -5]}
          intensity={1}
        />

        {/* BMW */}
        <CarModel url={modelUrl} />

        {/* Camera Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={6}
          maxDistance={25}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload('/models/car.glb')

export default CarViewer
