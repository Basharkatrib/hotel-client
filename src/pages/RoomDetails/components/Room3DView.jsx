import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Center, useGLTF } from '@react-three/drei';

function Model({ url }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

const Room3DView = () => {
  return (
    <div className="w-full h-full bg-slate-900 rounded-3xl overflow-hidden relative">
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Center>
            <Model url="/Living Room.glb" />
          </Center>
          <Environment preset="city" />
          <ContactShadows 
            position={[0, -1, 0]} 
            opacity={0.4} 
            scale={20} 
            blur={2.5} 
            far={4.5} 
          />
        </Suspense>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          minDistance={2}
          maxDistance={15}
          makeDefault 
        />
      </Canvas>
      
      {/* Interaction Hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
        <p className="text-white/50 text-xs font-medium tracking-widest uppercase bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
};

export default Room3DView;
