import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

export default function Airplane(props) {
  const { scene } = useGLTF('/Airplane.glb');
  const groupRef = useRef();
  const { viewport } = useThree();

  // Responsive scale: smaller on mobile, larger on desktop
  const responsiveScale = viewport.width < 5 ? 0.006 : 0.01;

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
  });

  return (
    <group ref={groupRef} {...props} scale={[responsiveScale, responsiveScale, responsiveScale]} position={[0, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload('/Airplane.glb');
