import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center, ContactShadows } from '@react-three/drei';
import Airplane from './Airplane';

const AirplaneSection = () => {
  return (
    <section className="pt-48 md:pt-12 bg-white overflow-hidden relative">
      <div
        className="w-full relative h-[450px] sm:h-[650px]"
      >
        {/* Sky Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white pointer-events-none" />
        
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ display: 'block', touchAction: 'pan-y' }}
          camera={{ position: [0, 15, 50], fov: 35 }}
          resize={{ scroll: false }}
          onWheel={(e) => e.stopPropagation()}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} castShadow />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Center top>
              <Airplane />
            </Center>
            <ContactShadows 
              position={[0, -15, 0]} 
              opacity={0.4} 
              scale={40} 
              blur={2.5} 
              far={20} 
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="text-center mt-12 px-4">
        <h2 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-tight">
          Fly to your <span className="text-blue-600">dream destination</span> with Vayka
        </h2>
      </div>
    </section>
  );
};

export default AirplaneSection;
