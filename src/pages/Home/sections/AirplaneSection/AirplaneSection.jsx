import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Center } from '@react-three/drei';
import Airplane from './Airplane';

const AirplaneSection = () => {
  return (
    <section className="pt-48 md:pt-24 bg-white overflow-hidden relative">
      <div
        className="w-full relative h-[400px] sm:h-[600px]"
      >
        <Canvas
          dpr={[1, 1]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          style={{ display: 'block', touchAction: 'none' }}
          camera={{ position: [0, 20, 60], fov: 40 }}
          resize={{ scroll: false }}
          onWheel={(e) => e.stopPropagation()}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <Environment preset="city" />

          <Suspense fallback={null}>
            <Center>
              <Airplane />
            </Center>
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
