import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Create a memoized ContactBear component with pure component to prevent any re-renders
const ContactBear = React.memo(({ socialHover }) => {
  const group = useRef();
  const leftEye = useRef();
  const rightEye = useRef();
  const leftPupil = useRef();
  const rightPupil = useRef();
  const leftHand = useRef();
  const rightHand = useRef();
  const mouth = useRef();
  
  // Track mouse position with useRef to avoid re-renders
  const mousePositionRef = useRef([0, 0]);
  // Replace state with refs to prevent re-renders completely
  const blinkingRef = useRef(false);
  const expressionRef = useRef('normal');
  
  // Store the social hover state in a ref to prevent re-renders
  const socialHoverRef = useRef(socialHover);
  
  // Update ref when prop changes (without causing re-render)
  useEffect(() => {
    socialHoverRef.current = socialHover;
  }, [socialHover]);
  
  // Create memoized random behaviors
  const behaviorTimers = useMemo(() => {
    return {
      blinkInterval: 2500 + Math.random() * 2000,
      expressionInterval: 4000 + Math.random() * 3000
    };
  }, []);
  
  useEffect(() => {
    // Throttled mouse move handler to prevent frequent updates
    let ticking = false;
    const handleMouseMove = (event) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Normalize mouse position between -1 and 1
          const x = (event.clientX / window.innerWidth) * 2 - 1;
          const y = -((event.clientY / window.innerHeight) * 2 - 1);
          
          // Use refs instead of state to avoid re-renders
          mousePositionRef.current = [x, y];
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Set up blinking interval with refs instead of state
    const blinkInterval = setInterval(() => {
      blinkingRef.current = true;
      setTimeout(() => {
        blinkingRef.current = false;
      }, 200);
    }, behaviorTimers.blinkInterval);
    
    // Set up random expressions with refs
    const expressionInterval = setInterval(() => {
      if (!socialHoverRef.current) {
        const expressions = ['normal', 'happy', 'surprised'];
        const newExpression = expressions[Math.floor(Math.random() * expressions.length)];
        expressionRef.current = newExpression;
      }
    }, behaviorTimers.expressionInterval);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
      clearInterval(expressionInterval);
    };
  }, [behaviorTimers]);

  // Robot-matched color palette
  const colors = useMemo(() => ({
    bodyMain: "#915eff", // Match robot's main gradient color
    bodyOutline: "#6a3bba", // Match robot's gradient end color
    earInner: "#00abfa", // Match robot's eye color
    eyeWhite: "#ffffff",
    pupils: "#00abfa", // Match robot's eye color
    nose: "#00abfa", // Match robot's accent color
    mouth: "#00abfa", // Match robot's accent color
    paws: "#6a3bba", // Match robot's darker color
  }), []);

  // Animation loop - optimized to eliminate all state changes
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    
    // Subtle idle animation for the whole bear
    if (group.current) {
      group.current.position.y = Math.sin(time * 0.5) * 0.05 + 0.05;
    }
    
    // Eyes follow mouse cursor when not covering
    if (leftEye.current && rightEye.current) {
      if (socialHoverRef.current) {
        // Close eyes completely when hovering over social icons and keep them closed
        leftEye.current.scale.y = 0.01;  // Completely closed
        rightEye.current.scale.y = 0.01; // Completely closed
      } else if (blinkingRef.current) {
        // Normal blinking animation
        leftEye.current.scale.y = 0.1;
        rightEye.current.scale.y = 0.1;
      } else {
        // Return to normal eye state with smooth transition
        leftEye.current.scale.y = THREE.MathUtils.lerp(leftEye.current.scale.y, 1, 0.3);
        rightEye.current.scale.y = THREE.MathUtils.lerp(rightEye.current.scale.y, 1, 0.3);
      }
      
      if (!socialHoverRef.current && !blinkingRef.current) {
        // Enhanced pupil movement based on mouse position - with greater range
        if (leftPupil.current && rightPupil.current) {
          const [mouseX, mouseY] = mousePositionRef.current;
          
          // Increase the pupil movement range for more noticeable tracking
          const maxPupilMove = 0.025; // Increased from 0.015
          
          // Apply movement to pupils based on mouse position
          leftPupil.current.position.x = THREE.MathUtils.lerp(
            leftPupil.current.position.x,
            mouseX * maxPupilMove,
            0.08 // Slightly faster response
          );
          leftPupil.current.position.y = THREE.MathUtils.lerp(
            leftPupil.current.position.y,
            mouseY * maxPupilMove,
            0.08
          );
          
          rightPupil.current.position.x = THREE.MathUtils.lerp(
            rightPupil.current.position.x,
            mouseX * maxPupilMove,
            0.08
          );
          rightPupil.current.position.y = THREE.MathUtils.lerp(
            rightPupil.current.position.y,
            mouseY * maxPupilMove,
            0.08
          );
          
          // Add subtle eye rotation for more natural following
          leftEye.current.rotation.z = THREE.MathUtils.lerp(
            leftEye.current.rotation.z,
            -mouseX * 0.1, // Subtle rotation to enhance tracking effect
            0.05
          );
          rightEye.current.rotation.z = THREE.MathUtils.lerp(
            rightEye.current.rotation.z,
            -mouseX * 0.1,
            0.05
          );
        }
        
        // Reset hands position when not covering
        leftHand.current.rotation.z = THREE.MathUtils.lerp(
          leftHand.current.rotation.z,
          Math.sin(time * 0.5) * 0.1,
          0.05
        );
        rightHand.current.rotation.z = THREE.MathUtils.lerp(
          rightHand.current.rotation.z,
          -Math.sin(time * 0.5 + 0.5) * 0.1,
          0.05
        );
        
        leftHand.current.position.y = THREE.MathUtils.lerp(
          leftHand.current.position.y,
          -0.3,
          0.05
        );
        rightHand.current.position.y = THREE.MathUtils.lerp(
          rightHand.current.position.y,
          -0.3,
          0.05
        );
      } else {
        // Cover eyes with hands when hovering over social icons
        leftHand.current.rotation.z = THREE.MathUtils.lerp(
          leftHand.current.rotation.z,
          -Math.PI * 0.4,
          0.05
        );
        rightHand.current.rotation.z = THREE.MathUtils.lerp(
          rightHand.current.rotation.z,
          Math.PI * 0.4,
          0.05
        );
        
        leftHand.current.position.y = THREE.MathUtils.lerp(
          leftHand.current.position.y,
          0.05,
          0.05
        );
        rightHand.current.position.y = THREE.MathUtils.lerp(
          rightHand.current.position.y,
          0.05,
          0.05
        );
      }
    }
    
    // Mouth animations based on expression using refs
    if (mouth.current) {
      if (socialHoverRef.current) {
        // Surprised expression when covering eyes
        mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, 2.5, 0.03);
        mouth.current.scale.x = THREE.MathUtils.lerp(mouth.current.scale.x, 0.7, 0.03);
      } else if (expressionRef.current === 'normal') {
        mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, 1, 0.03);
        mouth.current.scale.x = THREE.MathUtils.lerp(mouth.current.scale.x, 1, 0.03);
      } else if (expressionRef.current === 'happy') {
        mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, 0.4, 0.03);
        mouth.current.scale.x = THREE.MathUtils.lerp(mouth.current.scale.x, 1.5, 0.03);
      } else if (expressionRef.current === 'surprised') {
        mouth.current.scale.y = THREE.MathUtils.lerp(mouth.current.scale.y, 2, 0.03);
        mouth.current.scale.x = THREE.MathUtils.lerp(mouth.current.scale.x, 0.8, 0.03);
      }
    }
  });

  // Memoize all the bear's body parts that don't need frequent updates
  const BearBody = useMemo(() => (
    <>
      {/* Body */}
      <mesh position={[0, -0.2, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshStandardMaterial 
          color={colors.bodyMain}
          metalness={0.6}
          roughness={0.4}
          emissive={colors.bodyMain}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[0, -0.2, -0.01]}>
        <ringGeometry args={[0.69, 0.74, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 0.5, 0]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial 
          color={colors.bodyMain}
          metalness={0.6}
          roughness={0.4}
          emissive={colors.bodyMain}
          emissiveIntensity={0.1}
        />
      </mesh>
      
      <mesh position={[0, 0.5, -0.01]}>
        <ringGeometry args={[0.49, 0.54, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      {/* Ears */}
      <mesh position={[-0.35, 0.9, -0.02]}>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial 
          color={colors.bodyMain}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      <mesh position={[0.35, 0.9, -0.02]}>
        <circleGeometry args={[0.16, 32]} />
        <meshStandardMaterial 
          color={colors.bodyMain}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      <mesh position={[-0.35, 0.9, -0.03]}>
        <ringGeometry args={[0.15, 0.19, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      <mesh position={[0.35, 0.9, -0.03]}>
        <ringGeometry args={[0.15, 0.19, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      <mesh position={[-0.35, 0.9, -0.01]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial 
          color={colors.earInner}
          emissive={colors.earInner}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      <mesh position={[0.35, 0.9, -0.01]}>
        <circleGeometry args={[0.1, 32]} />
        <meshStandardMaterial 
          color={colors.earInner}
          emissive={colors.earInner}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Snout */}
      <mesh position={[0, 0.4, 0.01]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial 
          color="#a3b3d8"
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      
      <mesh position={[0, 0.4, 0]}>
        <ringGeometry args={[0.17, 0.2, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      {/* Nose */}
      <mesh position={[0, 0.4, 0.02]}>
        <circleGeometry args={[0.07, 32]} />
        <meshStandardMaterial 
          color={colors.nose}
          emissive={colors.nose}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.25, -0.75, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial 
          color={colors.paws}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      <mesh position={[0.25, -0.75, 0]}>
        <circleGeometry args={[0.15, 32]} />
        <meshStandardMaterial 
          color={colors.paws}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      
      <mesh position={[-0.25, -0.75, -0.01]}>
        <ringGeometry args={[0.14, 0.18, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      <mesh position={[0.25, -0.75, -0.01]}>
        <ringGeometry args={[0.14, 0.18, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      <mesh position={[-0.25, -0.75, 0.01]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
      
      <mesh position={[0.25, -0.75, 0.01]}>
        <ringGeometry args={[0.07, 0.09, 32]} />
        <meshBasicMaterial color={colors.bodyOutline} />
      </mesh>
    </>
  ), [colors]);

  // Memoize dynamic parts too to prevent any re-renders
  const DynamicParts = useMemo(() => (
    <>
      {/* Eyes */}
      <group ref={leftEye} position={[-0.18, 0.55, 0.01]}>
        <mesh>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial color={colors.bodyOutline} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.07, 32]} />
          <meshStandardMaterial 
            color={colors.eyeWhite}
            emissive={colors.eyeWhite}
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh ref={leftPupil} position={[0, 0, 0.02]}>
          <circleGeometry args={[0.04, 32]} />
          <meshStandardMaterial 
            color={colors.pupils}
            emissive={colors.pupils}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
      
      <group ref={rightEye} position={[0.18, 0.55, 0.01]}>
        <mesh>
          <circleGeometry args={[0.09, 32]} />
          <meshBasicMaterial color={colors.bodyOutline} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <circleGeometry args={[0.07, 32]} />
          <meshStandardMaterial 
            color={colors.eyeWhite}
            emissive={colors.eyeWhite}
            emissiveIntensity={0.2}
          />
        </mesh>
        <mesh ref={rightPupil} position={[0, 0, 0.02]}>
          <circleGeometry args={[0.04, 32]} />
          <meshStandardMaterial 
            color={colors.pupils}
            emissive={colors.pupils}
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>
      
      {/* Mouth */}
      <mesh ref={mouth} position={[0, 0.28, 0.02]}>
        <planeGeometry args={[0.16, 0.05]} />
        <meshBasicMaterial color={colors.mouth} />
      </mesh>
      
      {/* Arms/hands */}
      <group ref={leftHand} position={[-0.5, -0.3, 0.01]}>
        <mesh>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial 
            color={colors.paws}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.14, 0.18, 32]} />
          <meshBasicMaterial color={colors.bodyOutline} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[0.07, 0.09, 32]} />
          <meshBasicMaterial color={colors.bodyOutline} />
        </mesh>
      </group>
      
      <group ref={rightHand} position={[0.5, -0.3, 0.01]}>
        <mesh>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial 
            color={colors.paws}
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
        <mesh position={[0, 0, -0.01]}>
          <ringGeometry args={[0.14, 0.18, 32]} />
          <meshBasicMaterial color={colors.bodyOutline} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[0.07, 0.09, 32]} />
          <meshBasicMaterial color={colors.bodyOutline} />
        </mesh>
      </group>
    </>
  ), [colors]);

  // Memoize the light as well
  const BearLight = useMemo(() => (
    <pointLight 
      position={[0, 0, 1]} 
      intensity={0.5} 
      color={colors.earInner} 
      distance={3}
    />
  ), [colors]);

  return (
    <group ref={group} position={[0, 0, 0]} scale={1}>
      {/* Completely memoized parts */}
      {BearBody}
      {DynamicParts}
      {BearLight}
    </group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent re-renders
  // Always return true to prevent re-renders since we use refs internally
  return true;
});

export default React.memo(ContactBear); // Double memoization for extra protection against re-renders 