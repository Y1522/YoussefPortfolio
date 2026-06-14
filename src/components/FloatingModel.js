import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const FloatingModel = () => {
  const { viewport, camera } = useThree();
  const group = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Performance optimization with useMemo for geometries
  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(0.5, 32, 32), []);
  const torusGeometry = useMemo(() => new THREE.TorusGeometry(1.2, 0.02, 16, 100), []);
  
  useEffect(() => {
    if (group.current) {
      group.current.position.y = 0;
    }
    
    // Change cursor on hover
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (group.current) {
      // Base animation
      group.current.rotation.y = time * (hovered ? 0.3 : 0.15);
      group.current.position.y = Math.sin(time * 0.5) * 0.3;
      
      // Mouse interaction
      const mouse = state.mouse;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x, 
        mouse.y * 0.2, 
        0.05
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y, 
        mouse.x * 0.5 + time * 0.15, 
        0.05
      );
      
      // Scale effect on hover
      group.current.scale.x = THREE.MathUtils.lerp(
        group.current.scale.x,
        hovered ? 1.4 : 1.2,
        0.1
      );
      group.current.scale.y = THREE.MathUtils.lerp(
        group.current.scale.y,
        hovered ? 1.4 : 1.2,
        0.1
      );
      group.current.scale.z = THREE.MathUtils.lerp(
        group.current.scale.z,
        hovered ? 1.4 : 1.2,
        0.1
      );
    }
  });

  return (
    <group 
      ref={group} 
      position={[0, 0, 0]} 
      scale={[1.2, 1.2, 1.2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => window.open('https://github.com/youssefssaied', '_blank')}
    >
      {/* Core sphere with improved materials */}
      <mesh castShadow geometry={sphereGeometry}>
        <meshPhysicalMaterial 
          color="#915eff" 
          metalness={0.9}
          roughness={0.1}
          emissive="#915eff"
          emissiveIntensity={0.7}
          clearcoat={1.0}
          clearcoatRoughness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* Orbital rings */}
      <Orbital radius={1.2} rotation={[0, 0, 0]} geometry={torusGeometry} />
      <Orbital radius={1.2} rotation={[Math.PI / 2, 0, 0]} geometry={torusGeometry} />
      <Orbital radius={1.2} rotation={[0, Math.PI / 2, 0]} geometry={torusGeometry} />
      
      {/* Small orbital spheres with more variety */}
      <OrbitingSphere radius={1.2} speed={1.5} color="#00abfa" size={0.12} offset={0} />
      <OrbitingSphere radius={1.2} speed={-2.0} color="#4dabff" size={0.08} offset={2.1} />
      <OrbitingSphere radius={1.2} speed={2.5} color="#915eff" size={0.1} offset={4.2} />
      <OrbitingSphere radius={1.3} speed={-1.2} color="#ff5e91" size={0.07} offset={1.0} />
      <OrbitingSphere radius={1.4} speed={1.8} color="#5eff91" size={0.09} offset={3.5} />
      
      {/* Added particle effect */}
      <Particles count={150} />
    </group>
  );
};

const Orbital = ({ radius, rotation = [0, 0, 0], geometry }) => {
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.z = time * 0.1;
      
      // Pulse effect when hovered
      if (hovered) {
        ref.current.material.opacity = THREE.MathUtils.lerp(
          ref.current.material.opacity,
          0.6 + Math.sin(time * 3) * 0.3,
          0.1
        );
        ref.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          ref.current.material.emissiveIntensity,
          0.8 + Math.sin(time * 3) * 0.3,
          0.1
        );
      } else {
        ref.current.material.opacity = THREE.MathUtils.lerp(
          ref.current.material.opacity,
          0.4,
          0.1
        );
        ref.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          ref.current.material.emissiveIntensity,
          0.5,
          0.1
        );
      }
    }
  });
  
  return (
    <group rotation={rotation}>
      <mesh 
        ref={ref} 
        geometry={geometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial 
          color={hovered ? "#ffffff" : "#cccccc"} 
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
  const [hovered, setHovered] = useState(false);
  
  // Reuse geometries for better performance
  const geometry = useMemo(() => new THREE.SphereGeometry(size, 32, 32), [size]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + offset;
    if (ref.current) {
      // Orbital movement
      ref.current.position.x = Math.cos(time * speed) * radius;
      ref.current.position.z = Math.sin(time * speed) * radius;
      
      // Add vertical oscillation for more dynamic movement
      ref.current.position.y = Math.sin(time * 2) * 0.1;
      
      // Pulsating effect on hover
      if (hovered) {
        ref.current.scale.set(
          1.0 + Math.sin(time * 8) * 0.2,
          1.0 + Math.sin(time * 8) * 0.2,
          1.0 + Math.sin(time * 8) * 0.2
        );
      } else {
        ref.current.scale.set(1, 1, 1);
      }
    }
  });
  
  return (
    <mesh 
      ref={ref} 
      castShadow 
      geometry={geometry}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshPhysicalMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={hovered ? 1.5 : 0.7}
        metalness={0.8}
        roughness={0.2}
        clearcoat={0.5}
      />
    </mesh>
  );
};

// New Particles Component for added visual effects
const Particles = ({ count = 100 }) => {
  const mesh = useRef();
  
  // Generate random positions for particles
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const radius = 1.8 + Math.random() * 0.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      temp.push({
        position: [
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        ],
        size: Math.random() * 0.03 + 0.01,
        color: Math.random() > 0.6 ? "#915eff" : 
               Math.random() > 0.5 ? "#00abfa" : "#ffffff"
      });
    }
    return temp;
  }, [count]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.x = time * 0.05;
      mesh.current.rotation.y = time * 0.075;
    }
  });
  
  return (
    <group ref={mesh}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshBasicMaterial color={particle.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
};

export default FloatingModel; 