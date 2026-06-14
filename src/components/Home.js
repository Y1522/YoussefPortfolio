import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import profilePhoto from '../assets/my foto ( cv).png';

const HomeSection = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 6rem 2rem 2rem; /* Increased top padding to make space for header */
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 1200px;
  width: 100%;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const TextContent = styled(motion.div)`
  max-width: 600px;
  z-index: 1;
  
  @media (max-width: 768px) {
    margin-top: 2rem;
    margin-bottom: 2rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const SubHeading = styled(motion.h3)`
  font-size: 1.2rem;
  font-weight: 500;
  color: #aaa;
  margin-bottom: 1rem;
`;

const MainHeading = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  
  span {
    display: inline-block;
    background: linear-gradient(90deg, #915eff, #00abfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  @media (min-width: 768px) {
    font-size: 4.5rem;
  }
`;

const Description = styled(motion.p)`
  font-size: 1.1rem;
  color: #aaa;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const CTAButton = styled(motion.button)`
  background: linear-gradient(90deg, #915eff, #00abfa);
  border: none;
  padding: 0.8rem 2rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 5px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, #00abfa, #915eff);
    transition: all 0.5s ease;
    z-index: -1;
  }
  
  &:hover:before {
    width: 100%;
  }
`;

const ScrollDown = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  
  svg {
    width: 24px;
    height: 24px;
    margin-top: 0.5rem;
    animation: bounce 2s infinite;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-15px);
    }
    60% {
      transform: translateY(-7px);
    }
  }
`;

const ImagePreview = styled(motion.div)`
  max-width: 300px; /* Reduced from 400px */
  width: 100%;
  position: relative;
  margin-left: 2rem;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent 65%, rgba(145, 94, 255, 0.8) 100%);
    border-radius: 20px;
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover::after {
    opacity: 0.6;
  }
  
  img {
    width: 100%;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    transition: all 0.5s ease;
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -10px; /* Reduced from -20px */
    left: -10px; /* Reduced from -20px */
    right: 10px; /* Reduced from 20px */
    bottom: 10px; /* Reduced from 20px */
    border: 2px solid #915eff;
    border-radius: 20px;
    z-index: -1;
    transition: all 0.5s ease;
  }
  
  &:hover:before {
    top: -8px; /* Adjusted for smaller image */
    left: -8px; /* Adjusted for smaller image */
    right: 8px; /* Adjusted for smaller image */
    bottom: 8px; /* Adjusted for smaller image */
    border-color: #00abfa;
  }
  
  @media (max-width: 768px) {
    display: block; /* Changed from none to make visible on mobile */
    max-width: 200px; /* Smaller on mobile */
    margin: 0 auto 2rem; /* Center on mobile */
  }
`;

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  const scrollToContact = () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <HomeSection id="home">
      <ContentWrapper
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <TextContent>
          <SubHeading variants={itemVariants}>Welcome to my portfolio</SubHeading>
          <MainHeading variants={itemVariants}>
            Hi, I'm <span className="gradient-text">Youssef</span><br />
            Data Science Student
          </MainHeading>
          <Description variants={itemVariants}>
          Passionate Data Science student with a keen interest in web development, robotics, and information technology. I enjoy creating innovative solutions, exploring new technologies, and applying data-driven insights to build impactful and user-focused projects.
          </Description>
          <CTAButton
            className="glow-effect"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContact}
          >
            Let's Talk
          </CTAButton>
        </TextContent>
        
        <ImagePreview
          className="float-animation"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.05, 
            rotate: -2,
            transition: { type: 'spring', stiffness: 300 }
          }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img 
            src={profilePhoto} 
            alt="Youssef profile"
            whileHover={{ 
              filter: 'brightness(1.2) contrast(1.1)'
            }}
          />
        </ImagePreview>
      </ContentWrapper>
      
      <ScrollDown
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
      >
        <motion.span 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Scroll Down
        </motion.span>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M12 5L12 19M12 19L19 12M12 19L5 12" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </ScrollDown>
    </HomeSection>
  );
};

export default Home; 