import React, { useRef, Suspense, useEffect, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Environment } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Resume from './components/Resume';
import Contact from './components/Contact';
import LoadingScreen from './components/LoadingScreen';

// Create a spacer element to provide consistent space below the header
const HeaderSpacer = styled.div`
  height: 80px; // Matches header height plus some buffer
  width: 100%;
`;

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const resumeRef = useRef(null);
  const contactRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  // Define the exact background color used throughout the app
  const backgroundColor = "#0a1029"; // Darker blue instead ofrgb(10, 16, 44)

  // Memoize star parameters to ensure consistent appearance
  const starParams = useMemo(() => ({
    radius: 100,
    depth: 50,
    count: 5000,
    factor: 4,
    saturation: 1,
    fade: true,
    speed: 1 // Restore original speed of 1 for faster movement like before
  }), []);

  useEffect(() => {
    // Enable smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Set isLoaded to true after a brief delay for animation purposes
    const loadTimer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Remove the loader after animation completes
    const loaderTimer = setTimeout(() => {
      setShowLoader(false);
    }, 3000);

    // Apply background color to body as well for consistency
    document.body.style.backgroundColor = backgroundColor;

    return () => {
      document.documentElement.style.scrollBehavior = '';
      clearTimeout(loadTimer);
      clearTimeout(loaderTimer);
    };
  }, [backgroundColor]);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      {showLoader && <LoadingScreen backgroundColor={backgroundColor} />}
      
      <Header 
        onHomeClick={() => scrollToSection(homeRef)} 
        onAboutClick={() => scrollToSection(aboutRef)} 
        onResumeClick={() => scrollToSection(resumeRef)} 
        onContactClick={() => scrollToSection(contactRef)} 
      />
      
      {/* Add spacer to ensure content starts below the header */}
      <HeaderSpacer />

      <AnimatePresence mode="wait">
        <div className="canvas-container">
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 25 }}
            style={{ 
              position: 'fixed', 
              top: 0, 
              left: 0, 
              zIndex: -1,
              opacity: isLoaded ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              background: backgroundColor
            }}
            dpr={[1, 2]} // Dynamic resolution for better performance
            gl={{ 
              antialias: true,
              alpha: false, // Set to false for better performance with background
              powerPreference: "high-performance",
              logarithmicDepthBuffer: true // Helps with z-fighting
            }}
            frameloop="always" // Changed to always to ensure stars animate continuously
            performance={{ min: 0.5 }} // Lower performance threshold for smoother performance
          >
            {/* Simple lighting setup */}
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 0, 5]} intensity={0.6} color="#ffffff" />
            <pointLight position={[5, 5, 5]} intensity={0.5} color="#915eff" />
            <pointLight position={[-5, -5, 5]} intensity={0.5} color="#00abfa" />
            
            <Suspense fallback={null}>
              {/* Beautiful night sky with stars - with original animation speed */}
              <Stars 
                radius={starParams.radius}
                depth={starParams.depth} 
                count={starParams.count}
                factor={starParams.factor}
                saturation={starParams.saturation}
                fade={starParams.fade}
                speed={starParams.speed}
              />
              
              <Environment preset="night" />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate 
                autoRotateSpeed={0.3}
                maxPolarAngle={Math.PI / 2}
                minPolarAngle={Math.PI / 3}
                enableDamping={true}
                dampingFactor={0.05}
              />
            </Suspense>
          </Canvas>
        </div>

        <div ref={homeRef}>
          <Home />
        </div>

        <div ref={aboutRef}>
          <About />
        </div>

        <div ref={resumeRef}>
          <Resume />
        </div>

        <div ref={contactRef}>
          <Contact />
        </div>
      </AnimatePresence>
    </div>
  );
}

export default App;