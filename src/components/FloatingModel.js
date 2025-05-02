import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const FloatingModel = () => {
  const { viewport, camera } = useThree();
  const group = useRef();
  
  // Since we don't have a specific model, we'll create a custom 3D shape
  useEffect(() => {
    if (group.current) {
      group.current.position.y = 0;
    }
  }, []);

  // Add floating animation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current) {
      group.current.rotation.y = time * 0.15;
      group.current.position.y = Math.sin(time * 0.5) * 0.3;
      
      // Follow mouse position slightly
      const mouse = state.mouse;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, mouse.y * 0.2, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouse.x * 0.2, 0.05);
    }
  });

  // Create a custom shape - a futuristic "atom" like structure
  return (
    <group ref={group} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Core sphere */}
      <mesh castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color="#915eff" 
          metalness={0.8}
          roughness={0.2}
          emissive="#915eff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Orbital rings */}
      <Orbital radius={1.2} rotation={[0, 0, 0]} />
      <Orbital radius={1.2} rotation={[Math.PI / 2, 0, 0]} />
      <Orbital radius={1.2} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Small orbital spheres */}
      <OrbitingSphere radius={1.2} speed={1.5} color="#00abfa" size={0.12} offset={0} />
      <OrbitingSphere radius={1.2} speed={-2.0} color="#4dabff" size={0.08} offset={2.1} />
      <OrbitingSphere radius={1.2} speed={2.5} color="#915eff" size={0.1} offset={4.2} />
    </group>
  );
};

const Orbital = ({ radius, rotation = [0, 0, 0] }) => {
  const ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = time * 0.1;
    }
  });
  
  return (
    <group rotation={rotation}>
      <mesh ref={ref}>
        <torusGeometry args={[radius, 0.02, 16, 100]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff"
          emissiveIntensity={0.5}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
};

const OrbitingSphere = ({ radius, speed, color, size, offset }) => {
  const ref = useRef();
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + offset;
    if (ref.current) {
      ref.current.position.x = Math.cos(time * speed) * radius;
      ref.current.position.z = Math.sin(time * speed) * radius;
    }
  });
  
  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[size, 32, 32]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.7}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

export default FloatingModel; 