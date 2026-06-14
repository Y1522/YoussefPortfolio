import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AboutSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 5rem 2rem;
  position: relative;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  text-align: center;
  
  span {
    background: linear-gradient(90deg, #915eff, #00abfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const AboutText = styled.div`
  color: #aaa;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const Paragraph = styled(motion.p)`
  margin-bottom: 2rem;
`;

const SkillsContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SkillBadge = styled(motion.div)`
  background: rgba(145, 94, 255, 0.1);
  border: 1px solid rgba(145, 94, 255, 0.3);
  border-radius: 50px;
  padding: 0.7rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(90deg, #915eff, #00abfa);
    box-shadow: 0 5px 15px rgba(145, 94, 255, 0.4);
    transform: translateY(-3px);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 3rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #915eff, #00abfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const StatLabel = styled.p`
  font-size: 1rem;
  color: #aaa;
`;

const RobotContainer = styled(motion.div)`
  width: 100%;
  height: 400px;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1500px;
`;

const Robot = styled.div`
  position: relative;
  width: 200px;
  height: 300px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
  transform: rotateX(0deg) rotateY(0deg) scale(1.2);
  will-change: transform;
  
  &:hover {
    transform: scale(1.3);
  }
`;

const RobotHead = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #915eff, #8750e2);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    width: 80px;
    height: 20px;
    background: #0f0f0f;
    border-radius: 10px;
    bottom: 15px;
  }
`;

const RobotEye = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #00abfa;
  box-shadow: 0 0 10px #00abfa;
  
  &.left {
    left: 25px;
    top: 30px;
  }
  
  &.right {
    right: 25px;
    top: 30px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    top: 4px;
    left: 4px;
  }
`;

const RobotBody = styled.div`
  position: absolute;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  width: 140px;
  height: 150px;
  background: linear-gradient(to bottom, #915eff, #6a3bba);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #00abfa;
    box-shadow: 0 0 20px rgba(0, 171, 250, 0.6);
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 171, 250, 0.7);
    }
    
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(0, 171, 250, 0);
    }
    
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(0, 171, 250, 0);
    }
  }
`;

const RobotArm = styled.div`
  position: absolute;
  width: 30px;
  height: 100px;
  background: linear-gradient(to bottom, #915eff, #6a3bba);
  border-radius: 10px;
  
  &.left {
    left: -20px;
    top: 30px;
    transform: rotate(15deg);
    transform-origin: top center;
    animation: moveLeftArm 3s infinite alternate;
  }
  
  &.right {
    right: -20px;
    top: 30px;
    transform: rotate(-15deg);
    transform-origin: top center;
    animation: moveRightArm 3s infinite alternate;
  }
  
  @keyframes moveLeftArm {
    0% { transform: rotate(15deg); }
    100% { transform: rotate(30deg); }
  }
  
  @keyframes moveRightArm {
    0% { transform: rotate(-15deg); }
    100% { transform: rotate(-30deg); }
  }
`;

const RobotLeg = styled.div`
  position: absolute;
  width: 35px;
  height: 100px;
  background: linear-gradient(to bottom, #6a3bba, #502d8e);
  border-radius: 10px;
  bottom: -90px;
  
  &.left {
    left: 30px;
    animation: moveLeftLeg 3s infinite alternate;
  }
  
  &.right {
    right: 30px;
    animation: moveRightLeg 3s infinite alternate;
  }
  
  @keyframes moveLeftLeg {
    0% { transform: rotate(-5deg); }
    100% { transform: rotate(5deg); }
  }
  
  @keyframes moveRightLeg {
    0% { transform: rotate(5deg); }
    100% { transform: rotate(-5deg); }
  }
`;

const RobotMessage = styled.div`
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  background: rgba(145, 94, 255, 0.15);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  box-shadow: 0 4px 16px rgba(145, 94, 255, 0.15);
  border: 1px solid rgba(145, 94, 255, 0.3);
  pointer-events: none;
  white-space: nowrap;
  transition: background 0.3s;
  z-index: 2;
`;

const InteractiveRobot = () => {
  const robotRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const messages = [
    "I'am not Scary 😁",
    "Go to my friend Beary at the contact section 🐻",
    "Don't worry I'm Youssef's friend 🤖",
    "I'am happy to see you! 😊",
    "Youssef is a great developer 😊",
    "Youssef is a Data Science student 😊",
    "Youssef is a Robotics Instructor 😊",
  ];
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!robotRef.current || !containerRef.current) return;
      
      const robotElement = robotRef.current;
      const rect = containerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the container
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Distance from center (normalized between -1 and 1)
      const x = ((e.clientX - centerX) / (rect.width / 2)) * 1.5;
      const y = ((e.clientY - centerY) / (rect.height / 2)) * 1.5;
      
      // Apply the rotation with stronger effect when hovering
      const rotateYValue = isHovering ? x * 25 : x * 15;
      const rotateXValue = isHovering ? -y * 25 : -y * 15;
      
      // Add subtle movement even when not directly over the robot
      robotElement.style.transform = `rotateY(${rotateYValue}deg) rotateX(${rotateXValue}deg) scale(${isHovering ? 1.3 : 1.2})`;
    };
    
    // Handle entire window for smoother experience
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isHovering]);
  
  return (
    <RobotContainer 
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Robot ref={robotRef}>
        <RobotHead>
          <RobotEye className="left" />
          <RobotEye className="right" />
        </RobotHead>
        <RobotBody>
          <RobotArm className="left" />
          <RobotArm className="right" />
          <RobotLeg className="left" />
          <RobotLeg className="right" />
        </RobotBody>
      </Robot>
      <RobotMessage>
        {messages[msgIndex]}
      </RobotMessage>
    </RobotContainer>
  );
};

const About = () => {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
  });
  
  // State for animated numbers
  const [counts, setCounts] = useState([0, 0, 0]);
  
  const skills = [
    "Python", "Java", "JavaScript", "C++ (Arduino)","CSS", "HTML", 
    "React", "Three.js", "Git|Github", "Data Structures&Algorithms", "Problem Solving", "AI&ML", "IT", "Robotics","Mindstorm"
  ];
  
  const stats = [
    { number: "2+", label: "Years Experience" },
    { number: "20+", label: "Projects Completed" }
  ];

  // Animation for counting up numbers
  useEffect(() => {
    if (inView) {
      const targetValues = [2, 20];
      const duration = 2000; // 2 seconds for the animation
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        
        const newCounts = targetValues.map(target => 
          Math.floor(progress * target)
        );
        
        setCounts(newCounts);
        
        if (frame === totalFrames) {
          clearInterval(counter);
        }
      }, frameDuration);
      
      return () => clearInterval(counter);
    }
  }, [inView]);
  
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  const skillVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        duration: 0.3
      }
    })
  };
  
  return (
    <AboutSection id="about" ref={ref}>
      <ContentContainer>
        <SectionTitle
          initial={{ opacity: 0, y: -50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          About <span>Me</span>
        </SectionTitle>
        
        <AboutContent>
          <AboutText
            as={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            <Paragraph variants={itemVariants}>
            Hello! I'm Youssef, a technology enthusiast and third-year Data Science student
             at the Faculty of Computers and Data Science, Alexandria University. 
             With a strong foundation in web development, robotics, artificial intelligence,
              machine learning, and IT, I am passionate about building innovative solutions 
              that bridge the gap between ideas and real-world applications.
            </Paragraph>
            
            <Paragraph variants={itemVariants}>
            For nearly three years, I have been dedicated to learning, experimenting, and creating projects
             that challenge my skills and expand my knowledge. 
             I believe that great software is built on strong fundamentals, 
             which is why I focus on applying data structures, algorithms, and efficient problem-solving techniques . 
             Driven by curiosity and continuous improvement, I am always looking for new opportunities
              to learn, grow, and contribute to impactful technology-driven solutions.
            </Paragraph>
            
            <motion.div variants={itemVariants}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.3rem', color: '#fff' }}>My Skills</h3>
              <SkillsContainer>
                {skills.map((skill, index) => (
                  <SkillBadge
                    key={index}
                    custom={index}
                    variants={skillVariants}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {skill}
                  </SkillBadge>
                ))}
              </SkillsContainer>
            </motion.div>
          </AboutText>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <InteractiveRobot />
          </motion.div>
        </AboutContent>
        
        <StatsContainer>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
            >
              <StatNumber>{counts[index]}{stat.number.includes('+') ? '+' : ''}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsContainer>
      </ContentContainer>
    </AboutSection>
  );
};

export default About; 
