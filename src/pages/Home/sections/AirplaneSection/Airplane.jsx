import React, { useRef, useState } from 'react';
import { useGLTF, Float } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

export default function Airplane(props) {
  const { scene } = useGLTF('/Airplane.glb');
  const groupRef = useRef();
  const { viewport, size } = useThree();
  
  // State for dragging
  const [isDragging, setIsDragging] = useState(false);
  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });

  // Responsive scale: balanced for mobile and desktop
  const isMobile = size.width < 768;
  const responsiveScale = isMobile ? 0.015 : 0.025;

  useFrame(() => {
    if (groupRef.current && !isDragging) {
      // Auto-rotation when not dragging
      groupRef.current.rotation.y += 0.003;
    }
  });

  const handlePointerDown = (e) => {
    e.stopPropagation();
    // Use setPointerCapture to track the pointer even if it leaves the model's bounds
    e.target.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setLastPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!isDragging || !groupRef.current) return;
    
    const deltaX = e.clientX - lastPointerPos.x;
    const deltaY = e.clientY - lastPointerPos.y;

    // Adjust sensitivity as needed
    groupRef.current.rotation.y += deltaX * 0.01;
    groupRef.current.rotation.x += deltaY * 0.01;

    setLastPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };

  return (
    <Float
      speed={2} // Animation speed, defaults to 1
      rotationIntensity={0.5} // Ammo of rotation, defaults to 1
      floatIntensity={0.5} // Up/down float intensity, defaults to 1
    >
      <group 
        ref={groupRef} 
        {...props} 
        scale={[responsiveScale, responsiveScale, responsiveScale]} 
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <primitive object={scene} />
      </group>
    </Float>
  );
}

useGLTF.preload('/Airplane.glb');
