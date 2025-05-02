import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Home from './components/Home';
import About from './components/About';
import Resume from './components/Resume';
import Contact from './components/Contact';
import FloatingModel from './components/FloatingModel';

function App() {
  const homeRef = useRef(null);
  const aboutRef = useRef(null);
  const resumeRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    // Enable smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header 
        onHomeClick={() => scrollToSection(homeRef)} 
        onAboutClick={() => scrollToSection(aboutRef)} 
        onResumeClick={() => scrollToSection(resumeRef)} 
        onContactClick={() => scrollToSection(contactRef)} 
      />

      <AnimatePresence mode="wait">
        <div className="canvas-container">
          <Canvas 
            camera={{ position: [0, 0, 10], fov: 25 }}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[0, 0, 5]} intensity={1} />
            <Suspense fallback={null}>
              <FloatingModel />
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate 
                autoRotateSpeed={0.5}
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