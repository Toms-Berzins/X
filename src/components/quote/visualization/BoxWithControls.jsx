import React, { useRef, useEffect } from 'react';
import { TransformControls } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

// Extend Three.js elements
extend(THREE);

export const BoxWithControls = ({
  height,
  width,
  depth,
  onDimensionsChange,
}) => {
  const meshRef = useRef(null);
  const transformRef = useRef(null);

  useEffect(() => {
    const handleObjectChange = () => {
      if (meshRef.current) {
        const box = new THREE.Box3().setFromObject(meshRef.current);
        const size = new THREE.Vector3();
        box.getSize(size);
        onDimensionsChange?.({
          width: parseFloat(size.x.toFixed(2)),
          height: parseFloat(size.y.toFixed(2)),
          depth: parseFloat(size.z.toFixed(2))
        });
      }
    };

    if (transformRef.current) {
      transformRef.current.addEventListener('objectChange', handleObjectChange);
    }

    return () => {
      if (transformRef.current) {
        transformRef.current.removeEventListener('objectChange', handleObjectChange);
      }
    };
  }, [onDimensionsChange]);

  return (
    <TransformControls ref={transformRef} mode="scale">
      <mesh ref={meshRef} position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial 
          color="#f97316" 
          opacity={0.8} 
          transparent 
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </TransformControls>
  );
}; 