import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glowEffect = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(145, 94, 255, 0.5); }
  50% { box-shadow: 0 0 20px rgba(145, 94, 255, 0.8); }
`;

// Add star twinkle and movement animation
const starAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-15px) rotate(360deg);
    opacity: 0.6;
  }
`;

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.backgroundColor || '#0a1029'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  animation: ${fadeOut} 1s ease-in-out forwards;
  animation-delay: 2s;
  overflow: hidden;
`;

const BackgroundStars = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Star = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  opacity: ${props => props.opacity};
  animation: ${starAnimation} ${props => props.duration}s ease-in-out infinite;
  box-shadow: 0 0 ${props => props.size * 2}px rgba(255, 255, 255, 0.8);
`;

const LogoContainer = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${float} 6s ease-in-out infinite;
  position: relative;
  z-index: 2;
`;

const Logo = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  color: white;
  animation: ${pulse} 2s ease-in-out infinite;
  
  span {
    background: linear-gradient(90deg, #915eff, #00abfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #aaa;
  margin-top: 0.5rem;
  letter-spacing: 2px;
`;

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const jumpAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const IconContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const TechIcon = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 24px;
  font-weight: bold;
  animation: ${jumpAnimation} ${props => props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay * 0.1}s;
  box-shadow: 0 0 10px rgba(145, 94, 255, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(145, 94, 255, 0.3);
    transform: scale(1.1);
  }
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  border-top: 4px solid #915eff;
  animation: ${spinAnimation} 1s linear infinite;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 10px rgba(145, 94, 255, 0.5);
  animation: ${spinAnimation} 1s linear infinite, ${glowEffect} 2s ease-in-out infinite;
`;

const ProgressContainer = styled.div`
  width: 250px;
  position: relative;
  margin-top: 1.5rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(90deg, #915eff, #00abfa);
    transform-origin: left;
    transition: width 0.3s ease;
    box-shadow: 0 0 10px rgba(145, 94, 255, 0.8);
  }
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 14px;
  color: #aaa;
  
  span {
    color: #00abfa;
    font-weight: bold;
  }
`;

// Define the default color for consistency with App.js
const DEFAULT_BG_COLOR = "#0a1029";

const LoadingScreen = ({ backgroundColor = DEFAULT_BG_COLOR }) => {
  const [progress, setProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState('Initializing...');
  const [stars, setStars] = useState([]);
  
  useEffect(() => {
    // Apply background color to body immediately for smoother transition
    document.body.style.backgroundColor = backgroundColor;
    
    // Generate random stars with faster movement like in the app
    const generatedStars = [];
    for (let i = 0; i < 100; i++) { // More stars for a denser look
      generatedStars.push({
        id: i,
        size: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.3,
        duration: Math.random() * 8 + 6 // Faster animation duration
      });
    }
    setStars(generatedStars);
    
    // Simulate loading progress
    const loadingSteps = [
      { phase: 'Initializing...', targetProgress: 20 },
      { phase: 'Loading assets...', targetProgress: 40 },
      { phase: 'Preparing flat bear...', targetProgress: 60 },
      { phase: 'Optimizing UI...', targetProgress: 80 },
      { phase: 'Final touches...', targetProgress: 100 }
    ];
    
    let currentStep = 0;
    const progressInterval = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingPhase(loadingSteps[currentStep].phase);
        
        // Animate progress to target
        const { targetProgress } = loadingSteps[currentStep];
        const progressAnimation = setInterval(() => {
          setProgress(prev => {
            if (prev < targetProgress) {
              return prev + 1;
            } else {
              clearInterval(progressAnimation);
              currentStep++;
              return prev;
            }
          });
        }, 30);
      } else {
        clearInterval(progressInterval);
      }
    }, 500);
    
    return () => {
      clearInterval(progressInterval);
    };
  }, [backgroundColor]);

  return (
    <LoadingContainer backgroundColor={backgroundColor}>
      <BackgroundStars>
        {stars.map(star => (
          <Star 
            key={star.id}
            size={star.size}
            top={star.top}
            left={star.left}
            opacity={star.opacity}
            duration={star.duration}
          />
        ))}
      </BackgroundStars>
      
      <LogoContainer>
        <Logo>
          <span>Youssef</span> Portfolio
        </Logo>
        <LoadingText>{loadingPhase}</LoadingText>
        
        <IconContainer>
          <TechIcon delay={1.5}>R</TechIcon>
          <TechIcon delay={2}>Py</TechIcon>
          <TechIcon delay={2.5}>JS</TechIcon>
        </IconContainer>
      </LogoContainer>
      
      <Spinner />
      
      <ProgressContainer>
        <ProgressBar progress={progress} />
        <ProgressText>
          <div>Loading...</div>
          <div><span>{progress}%</span></div>
        </ProgressText>
      </ProgressContainer>
    </LoadingContainer>
  );
};

export default LoadingScreen; 