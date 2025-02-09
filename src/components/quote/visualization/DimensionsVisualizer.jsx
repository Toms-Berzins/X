import React from 'react';
import { Canvas, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { Scene } from './Scene';

// Extend Three.js elements
extend(THREE);

export const DimensionsVisualizer = (props) => {
  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <Canvas
        shadows
        camera={{ position: [100, 100, 100], fov: 50 }}
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}; 