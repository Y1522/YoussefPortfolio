import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ContactSection = styled.section`
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

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  position: relative;
`;

const FormInput = styled(motion.input)`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #915eff;
    box-shadow: 0 0 15px rgba(145, 94, 255, 0.2);
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const FormTextarea = styled(FormInput).attrs({ as: 'textarea' })`
  min-height: 150px;
  resize: vertical;
`;

const FormButton = styled(motion.button)`
  background: linear-gradient(90deg, #915eff, #00abfa);
  border: none;
  padding: 1rem 2rem;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover {
    box-shadow: 0 10px 20px rgba(145, 94, 255, 0.3);
    transform: translateY(-5px);
  }
`;

const SendOptions = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #aaa;
  cursor: pointer;
  
  &:hover {
    color: #fff;
  }
`;

const RadioInput = styled.input`
  appearance: none;
  width: 1.2rem;
  height: 1.2rem;
  border: 2px solid #915eff;
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  position: relative;
  
  &:checked {
    background: #915eff;
    
    &:after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0.5rem;
      height: 0.5rem;
      background: white;
      border-radius: 50%;
    }
  }
  
  &:hover {
    border-color: #00abfa;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ContactCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: #915eff;
  }
`;

const IconBox = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #915eff, #00abfa);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    width: 24px;
    height: 24px;
    color: white;
  }
`;

const ContactText = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #fff;
  }
  
  p {
    font-size: 1rem;
    color: #aaa;
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
`;

const SocialButton = styled(motion.a)`
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(45deg, #915eff, #00abfa);
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(145, 94, 255, 0.3);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const BearContainer = styled(motion.div)`
  position: sticky;
  top: 100px;
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  perspective: 1500px;
  z-index: 50;
`;

const Bear = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.1s ease;
  will-change: transform;
  cursor: pointer;
`;

const BearHead = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateZ(20px);
  width: 120px;
  height: 100px;
  border-radius: 60% 60% 50% 50%;
  background: linear-gradient(135deg, #915eff, #7340c7);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: inherit;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 50%);
  }
`;

const BearEar = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #7340c7;
  box-shadow: inset 3px -3px 10px rgba(0, 0, 0, 0.3);
  
  &.left {
    top: -15px;
    left: 10px;
    transform: translateZ(5px);
    
    &::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #b490ff;
      top: 10px;
      left: 10px;
      opacity: 0.6;
    }
  }
  
  &.right {
    top: -15px;
    right: 10px;
    transform: translateZ(5px);
    
    &::before {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #b490ff;
      top: 10px;
      left: 10px;
      opacity: 0.6;
    }
  }
`;

const BearEye = styled.div`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  z-index: 11;
  transition: height 0.3s ease;
  overflow: hidden;
  transform: translateZ(25px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  
  &.left {
    top: 40px;
    left: 30px;
  }
  
  &.right {
    top: 40px;
    right: 30px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #000;
    top: 4px;
    left: 4px;
    animation: eyeBlink 3s infinite;
  }
  
  @keyframes eyeBlink {
    0%, 95%, 100% { transform: scale(1); }
    97% { transform: scale(1, 0.1); }
  }
  
  &.covered {
    height: 2px;
    top: 48px;
  }
`;

const BearMuzzle = styled.div`
  position: absolute;
  width: 60px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(145deg, #00abfa, #0090d4);
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%) translateZ(30px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    width: 30px;
    height: 15px;
    border-radius: 0 0 15px 15px;
    background: #00abfa;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &::before {
    content: '';
    position: absolute;
    width: 40px;
    height: 25px;
    border-radius: 50%;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%);
    top: 10px;
    left: 10px;
  }
`;

const BearNose = styled.div`
  position: absolute;
  width: 20px;
  height: 15px;
  border-radius: 50%;
  background: #333;
  top: 15px;
  left: 50%;
  transform: translateX(-50%) translateZ(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const BearBody = styled.div`
  position: absolute;
  width: 140px;
  height: 120px;
  border-radius: 60px 60px 50px 50px;
  background: linear-gradient(to bottom, #915eff, #6a3bba);
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) translateZ(10px);
  z-index: 1;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    width: 100px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 70%);
    top: 20px;
    left: 20px;
  }
`;

const BearArm = styled.div`
  position: absolute;
  width: 30px;
  height: 80px;
  border-radius: 15px;
  background: linear-gradient(to bottom, #915eff, #6a3bba);
  bottom: 30px;
  transform-origin: bottom center;
  box-shadow: -2px 5px 10px rgba(0, 0, 0, 0.2);
  
  &.left {
    left: 15px;
    transform: rotate(15deg) translateZ(15px);
    animation: waveArm 5s infinite alternate;
  }
  
  &.right {
    right: 15px;
    transform: rotate(-15deg) translateZ(15px);
    
    &::before {
      content: '';
      position: absolute;
      width: 100%;
      height: 50%;
      border-radius: 15px 15px 0 0;
      background: linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
      top: 0;
      left: 0;
    }
  }
  
  @keyframes waveArm {
    0%, 10% { transform: rotate(15deg) translateZ(15px); }
    40%, 60% { transform: rotate(50deg) translateZ(15px); }
    90%, 100% { transform: rotate(15deg) translateZ(15px); }
  }
`;

const BearPaw = styled.div`
  position: absolute;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: linear-gradient(145deg, #7340c7, #6a3bba);
  top: 0;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
  z-index: 12;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  
  &.visible {
    opacity: 1;
    transform: translateY(35px) translateZ(40px);
  }
  
  &.left {
    left: 20px;
    
    &::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 5px;
      border-radius: 50%;
      background: #503380;
      top: 22px;
      left: 7px;
      box-shadow: 15px 0 0 #503380;
      transform: translateZ(2px);
    }
  }
  
  &.right {
    right: 20px;
    
    &::before {
      content: '';
      position: absolute;
      width: 10px;
      height: 5px;
      border-radius: 50%;
      background: #503380;
      top: 22px;
      right: 7px;
      box-shadow: -15px 0 0 #503380;
      transform: translateZ(2px);
    }
  }
`;

const Tooltip = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  pointer-events: none;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s, transform 0.3s;
  white-space: nowrap;
  z-index: 100;
  top: -30px;
  left: 50%;
  transform: translateX(-50%) translateY(10px);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
  
  &.bear-speech {
    top: auto;
    bottom: 100%;
    margin-bottom: 10px;
    left: 50%;
    min-width: 120px;
    text-align: center;
    transform: translateX(-50%) translateY(10px);
  }
`;

const TooltipTrigger = styled.div`
  position: relative;
  
  &:hover ${Tooltip} {
    opacity: 1;
    transform: translateY(0);
  }
`;

const BearSpeech = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 15px;
  font-size: 1rem;
  pointer-events: none;
  opacity: 1;
  transition: all 0.5s ease;
  white-space: normal;
  z-index: 100;
  top: -70px;
  left: 50%;
  transform: translateX(-50%) translateY(0);
  text-align: center;
  line-height: 1.4;
  min-width: 220px;
  max-width: 280px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    margin-left: -8px;
    border-width: 8px;
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
`;

const BearTail = styled.div`
  position: absolute;
  width: 35px;
  height: 45px;
  background: linear-gradient(to right, #915eff, #6a3bba);
  border-radius: 50% 50% 0 50%;
  bottom: 15px;
  right: -10px;
  transform: rotate(45deg) translateZ(5px);
  transform-origin: bottom left;
  box-shadow: -2px 5px 10px rgba(0, 0, 0, 0.2);
  z-index: 0;
  animation: tailWag 3s infinite alternate ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    width: 70%;
    height: 70%;
    border-radius: inherit;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
    top: 5px;
    left: 5px;
  }
  
  @keyframes tailWag {
    0% { transform: rotate(45deg) translateZ(5px); }
    50% { transform: rotate(65deg) translateZ(5px); }
    100% { transform: rotate(45deg) translateZ(5px); }
  }
`;

const Contact = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [sendMethod, setSendMethod] = useState('whatsapp');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const text = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0A%0AMessage: ${formData.message}`;
    
    if (sendMethod === 'whatsapp') {
      window.open(`https://wa.me/201204385018?text=${text}`, '_blank');
    } else {
      window.open(`mailto:youssefssayed5@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`);
    }
  };
  
  const contactInfo = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      text: "youssefssayed5@gmail.com"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Phone",
      text: "+20 1204385018"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Location",
      text: "Alex,Egypt"
    }
  ];
  
  const socialLinks = [
    {
      url: "https://www.facebook.com/profile.php?id=100046510189783",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
        </svg>
      )
    },
    {
      url: "https://www.linkedin.com/in/youssef-sayed-1459362b6?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
        </svg>
      )
    },
    {
      url: "https://github.com/Y1522",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    }
  ];
  
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
  
  const bearRef = useRef(null);
  const bearContainerRef = useRef(null);
  const [isBearHovering, setBearHovering] = useState(false);
  
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [coverEyes, setCoverEyes] = useState(false);
  const [bearSpeech, setBearSpeech] = useState('Hi there! I\'m Beary nice to meet you! Scroll down to contact Youssef! 🐻');
  
  // Expanded message groups with variations
  const [messageGroups] = useState({
    welcome: [
      'Hi there! I\'m Beary nice to meet you! Scroll down to contact Youssef! 🐻',
      'Hello! I\'m Youssef\'s assistant! How can we help you today? 🐻',
      'Welcome to the contact page! I\'m here to guide you! 🐻',
      'Beary happy to see you here! Need to get in touch with Youssef? 🐻',
      'Greetings! I\'m your friendly bear guide to connecting with Youssef! 🐻'
    ],
    skills: [
      'Looking for a talented developer? You\'ve come to the right place! 🚀',
      'Youssef creates amazing websites with cutting-edge technology! 💻',
      'Need a skilled React developer? Youssef is your best choice! ⚛️',
      'Modern UI, responsive design, and clean code - that\'s what Youssef delivers! 🌟',
      'From concept to deployment, Youssef handles the entire development process! 🛠️'
    ],
    contact: [
      'Feel free to reach out! Youssef loves making new connections! 🤝',
      'Drop a message - Youssef is always excited to discuss new projects! 📨',
      'Don\'t be shy! Youssef is friendly and approachable! 😊',
      'Questions? Ideas? Opportunities? Youssef wants to hear from you! 💬',
      'Your next great project could start with a simple message to Youssef! 🚀'
    ],
    portfolio: [
      'Did you see the cool projects in the portfolio? Amazing, right? ✨',
      'Check out Youssef\'s work - the attention to detail is impressive! 🔍',
      'Youssef\'s portfolio showcases creative solutions to complex problems! 🧩',
      'Each project in the portfolio represents a unique challenge overcome! 💪',
      'From small components to full applications - see it all in the portfolio! 📱'
    ],
    response: [
      'Pssst... Youssef responds super fast to messages! 📱',
      'Quick replies guaranteed - Youssef values your time! ⏱️',
      'No waiting for days - expect a prompt response from Youssef! ⚡',
      'Communication is key - that\'s why Youssef always replies quickly! 💨',
      'Your message won\'t sit in the inbox for long - Youssef is on it! 📬'
    ]
  });
  
  // For phone hover
  const phoneMessages = [
    'Call me on WhatsApp! I promise I won\'t bite! 📱',
    'Got WhatsApp? Send a message directly to Youssef! 📲',
    'One tap on that number and you can chat with Youssef on WhatsApp! 💬',
    'WhatsApp is Youssef\'s favorite way to connect with clients! 📞',
    'Quick question? WhatsApp Youssef for an even quicker answer! ⚡'
  ];
  
  // For email hover
  const emailMessages = [
    'Drop me a message! I check my inbox... sometimes! 📧',
    'Emails are perfect for detailed project discussions! 📝',
    'Send Youssef an email - it\'s the professional way to connect! 📨',
    'Need to share documents or details? Email is the way to go! 📎',
    'Your email will land directly in Youssef\'s priority inbox! ⭐'
  ];
  
  // For location hover
  const locationMessages = [
    'Alex is the best city! The sea! The food! The traffic... well, 2 out of 3 isn\'t bad! 🌇',
    'Alexandria - where the Mediterranean meets incredible talent! 🌊',
    'The beautiful coastal city where Youssef brings designs to life! 🏙️',
    'From the shores of Alexandria to the digital world - location is no barrier! 🌍',
    'Alexandria: rich in history and home to your next favorite developer! 🏛️'
  ];
  
  // For social hover
  const socialMessages = [
    'WARNING!! Funny content ahead! Cover your eyes if you can\'t handle awesomeness! 🙈',
    'Oh no! My eyes can\'t handle this much amazing content! 🙉',
    'Too much awesomeness in these social profiles! Must... cover... eyes! 😵',
    'Sensory overload from all this social media greatness! 🙈',
    'Warning: Viewing these profiles may cause extreme admiration! 🤩'
  ];
  
  // Current group for rotation
  const [currentGroup, setCurrentGroup] = useState('welcome');
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Enhanced message rotation with group switching
  useEffect(() => {
    // Only rotate messages when there's no specific message showing
    if (!activeTooltip && !coverEyes) {
      const groupInterval = setInterval(() => {
        // Switch to a different message group every 15 seconds
        const groups = Object.keys(messageGroups);
        const currentGroupIndex = groups.indexOf(currentGroup);
        const nextGroupIndex = (currentGroupIndex + 1) % groups.length;
        setCurrentGroup(groups[nextGroupIndex]);
      }, 15000);
      
      const messageInterval = setInterval(() => {
        // Rotate through messages within the current group every 5 seconds
        const messages = messageGroups[currentGroup];
        const nextIndex = (currentIndex + 1) % messages.length;
        setCurrentIndex(nextIndex);
        setBearSpeech(messages[nextIndex]);
      }, 5000);
      
      return () => {
        clearInterval(groupInterval);
        clearInterval(messageInterval);
      };
    }
  }, [activeTooltip, coverEyes, messageGroups, currentGroup, currentIndex]);
  
  // Get random message from array
  const getRandomMessage = (messageArray) => {
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
  };
  
  const handleInfoHover = (infoType) => {
    setActiveTooltip(infoType);
    if (infoType === 'phone') {
      setBearSpeech(getRandomMessage(phoneMessages));
    } else if (infoType === 'email') {
      setBearSpeech(getRandomMessage(emailMessages));
    } else if (infoType === 'location') {
      setBearSpeech(getRandomMessage(locationMessages));
    }
  };
  
  const handleSocialHover = () => {
    setCoverEyes(true);
    setBearSpeech(getRandomMessage(socialMessages));
  };
  
  const handleSocialLeave = () => {
    setCoverEyes(false);
    // Don't clear the speech - let it return to rotation
  };
  
  const handleInfoLeave = () => {
    setActiveTooltip(null);
    // Don't clear the speech - let it return to rotation
  };

  const InteractiveBear = () => (
    <BearContainer
      ref={bearContainerRef}
      onMouseEnter={() => setBearHovering(true)}
      onMouseLeave={() => setBearHovering(false)}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BearSpeech>
        {bearSpeech}
      </BearSpeech>
      <Bear ref={bearRef}>
        <BearHead>
          <BearEar className="left" />
          <BearEar className="right" />
          <BearEye className={`left ${coverEyes ? 'covered' : ''}`} />
          <BearEye className={`right ${coverEyes ? 'covered' : ''}`} />
          <BearPaw className={`left ${coverEyes ? 'visible' : ''}`} />
          <BearPaw className={`right ${coverEyes ? 'visible' : ''}`} />
          <BearMuzzle>
            <BearNose />
          </BearMuzzle>
        </BearHead>
        <BearBody>
          <BearArm className="left" />
          <BearArm className="right" />
          <BearTail />
        </BearBody>
      </Bear>
    </BearContainer>
  );
  
  // Add back the mouse movement functionality
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!bearRef.current || !bearContainerRef.current) return;
      
      const bearElement = bearRef.current;
      const rect = bearContainerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to the center of the container
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Distance from center (normalized between -1 and 1)
      const x = ((e.clientX - centerX) / (rect.width / 2)) * 1.5;
      const y = ((e.clientY - centerY) / (rect.height / 2)) * 1.5;
      
      // Apply the rotation with stronger effect when hovering
      const rotateYValue = isBearHovering ? x * 20 : x * 10;
      const rotateXValue = isBearHovering ? -y * 20 : -y * 10;
      
      // Add subtle movement even when not directly over the bear
      bearElement.style.transform = `rotateY(${rotateYValue}deg) rotateX(${rotateXValue}deg) ${isBearHovering ? 'scale(1.1)' : ''}`;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isBearHovering]);
  
  return (
    <ContactSection id="contact" ref={ref}>
      <ContentContainer>
        <SectionTitle
          initial={{ opacity: 0, y: -50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          Connect <span>With Me</span>
        </SectionTitle>
        
        <InteractiveBear />
        
        <ContactContent>
          <ContactForm
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            onSubmit={handleSubmit}
          >
            <motion.div variants={itemVariants}>
              <FormInput 
                type="text" 
                placeholder="Your Name" 
                required 
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <FormInput 
                type="email" 
                placeholder="Your Email" 
                required 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <FormInput 
                type="text" 
                placeholder="Subject" 
                required 
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <FormTextarea 
                placeholder="Your Message" 
                required 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <SendOptions>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="sendMethod"
                    value="whatsapp"
                    checked={sendMethod === 'whatsapp'}
                    onChange={(e) => setSendMethod(e.target.value)}
                  />
                  WhatsApp
                </RadioLabel>
                <RadioLabel>
                  <RadioInput
                    type="radio"
                    name="sendMethod"
                    value="email"
                    checked={sendMethod === 'email'}
                    onChange={(e) => setSendMethod(e.target.value)}
                  />
                  Email
                </RadioLabel>
              </SendOptions>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <FormButton
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Send Message
              </FormButton>
            </motion.div>
          </ContactForm>
          
          <ContactInfo>
            {contactInfo.map((info, index) => (
              <TooltipTrigger 
                key={index} 
                onMouseEnter={() => handleInfoHover(info.title.toLowerCase())}
                onMouseLeave={handleInfoLeave}
              >
                <ContactCard
                  initial={{ opacity: 0, x: 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <IconBox>{info.icon}</IconBox>
                  <ContactText>
                    <h3>{info.title}</h3>
                    <p>{info.text}</p>
                  </ContactText>
                </ContactCard>
              </TooltipTrigger>
            ))}
            
            <SocialLinks
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onMouseEnter={handleSocialHover}
              onMouseLeave={handleSocialLeave}
            >
              {socialLinks.map((link, index) => (
                <SocialButton 
                  key={index} 
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                </SocialButton>
              ))}
            </SocialLinks>
          </ContactInfo>
        </ContactContent>
      </ContentContainer>
    </ContactSection>
  );
};

export default Contact; 