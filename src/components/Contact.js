import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Canvas } from '@react-three/fiber';
import ContactBear from './ContactBear';

// Update the animation styles for the bear's speech bubble and add section glow
const cursorTrackingStyles = `
  @keyframes blinkAnimation {
    0% { transform: scaleY(1); }
    45% { transform: scaleY(1); }
    50% { transform: scaleY(0.1); }
    55% { transform: scaleY(1); }
    100% { transform: scaleY(1); }
  }
  
  @keyframes floatAnimation {
    0% { transform: translateX(-50%) translateY(0px); }
    50% { transform: translateX(-50%) translateY(-5px); }
    100% { transform: translateX(-50%) translateY(0px); }
  }
  
  .bear-speech {
    animation: floatAnimation 4s ease-in-out infinite;
  }
  
  #contact {
    scroll-margin-top: 80px;
  }
  
  /* Add a subtle glow to the bear container when scrolling */
  .contact-section-container .fixed-bear-container {
    transition: box-shadow 0.3s ease;
  }
  
  .contact-section-container.scrolled .fixed-bear-container {
    box-shadow: none; /* Remove shadow when scrolled */
  }
  
  /* Speech bubble glow effect */
  .bear-speech {
    position: relative;
  }
  
  .bear-speech::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 15px;
    z-index: -1;
    background: transparent;
    box-shadow: 0 0 20px rgba(145, 94, 255, 0.2);
    opacity: 0.7;
    animation: pulsate 3s ease-in-out infinite;
  }
  
  @keyframes pulsate {
    0% { opacity: 0.7; }
    50% { opacity: 0.9; }
    100% { opacity: 0.7; }
  }
`;

const ContactSection = styled.section`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Start from top */
  align-items: center;
  padding: 1rem 2rem 5rem 2rem; /* Reduced top padding */
  position: relative;
  background: transparent; /* Make transparent to let app background show through */
  border-radius: 0; /* Remove border radius */
  box-shadow: none; /* Remove shadow */
  overflow: visible; /* Allow content to overflow */
  z-index: 1; /* Ensure it's above the global canvas but below the header */
  
  /* Remove the ::before element with gradients */
  &::before {
    display: none;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin-top: 20px; /* Reduced margin */
  padding-top: 10px; /* Add padding */
  position: relative;
  z-index: 10;
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  margin-top: 1rem;
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
  gap: 3rem;
  width: 100%;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ContactForm = styled(motion.form)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(145, 94, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const FormInput = styled(motion.input)`
  width: 100%;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(145, 94, 255, 0.2);
  border-radius: 10px;
  padding: 1rem;
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #915eff;
    box-shadow: 0 0 15px rgba(145, 94, 255, 0.2);
    background: rgba(255, 255, 255, 0.1);
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
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  border: 1px solid rgba(145, 94, 255, 0.2);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
`;

const ContactCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(145, 94, 255, 0.2);
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(145, 94, 255, 0.2);
    border-color: #915eff;
    background: rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 5px 15px rgba(145, 94, 255, 0.3);
  
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
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(145, 94, 255, 0.2);
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

const TooltipTrigger = styled.div`
  position: relative;
  cursor: pointer;
  
  &:hover ${ContactCard} {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    border-color: #915eff;
  }
`;

// Create a fixed container for the bear that stays visible at the top of Contact section
const FixedBearContainer = styled.div`
  position: sticky;
  top: 80px; /* Space for header */
  left: 0;
  width: 100%;
  height: 220px; /* Slightly reduced height */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to top */
  z-index: 100; /* Increased z-index to ensure visibility */
  margin-bottom: 0; /* Remove margin */
  pointer-events: none;
  padding-top: 0px; /* Removed top padding completely */
  background: linear-gradient(180deg, 
    rgba(0, 0, 0, 0.8) 0%, 
    rgba(0, 0, 0, 0.6) 40%, 
    rgba(0, 0, 0, 0.4) 70%, 
    rgba(0, 0, 0, 0) 100%
  ); /* Darker gradient that fades to transparent */
  box-shadow: none; /* Remove shadow */
  border: none; /* Remove border */
`;

const BearContainer = styled(motion.div)`
  position: relative;
  width: 280px;
  height: 200px; /* Slightly reduced height */
  perspective: 1500px;
  z-index: 50;
  pointer-events: all;
  margin-top: 0px; /* Removed space below header completely */
  border: none; /* Remove any border */
  box-shadow: none; /* Remove any shadow */
`;

const BearSpeech = styled.div`
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 20px;
  border-radius: 15px;
  font-size: 1.1rem;
  pointer-events: none;
  opacity: 1;
  transition: all 0.5s ease;
  white-space: normal;
  z-index: 100;
  bottom: 10%; /* Position extremely close to the bear's mouth */
  margin-bottom: 0; /* Reset margin */
  left: 50%;
  transform: translateX(-50%) translateY(0);
  text-align: center;
  line-height: 1.4;
  min-width: 260px;
  max-width: 320px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5), 0 0 15px rgba(145, 94, 255, 0.3);
  border: none; /* Remove border completely */
  
  &::after {
    content: '';
    position: absolute;
    bottom: -15px; /* Extend the tail even further to connect with the bear's mouth */
    left: 50%;
    margin-left: -12px;
    border-width: 15px; /* Made larger for better visibility */
    border-style: solid;
    border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
  }
  
  .highlight {
    background: linear-gradient(90deg, #915eff, #00abfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(145, 94, 255, 0.3);
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
    
    if (sendMethod === 'whatsapp') {
      // Format for WhatsApp - using URL encoding for line breaks
      const text = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0A%0AMessage: ${formData.message}`;
      window.open(`https://wa.me/201204385018?text=${text}`, '_blank');
    } else {
      // Format for Email - using proper email encoding
      const subject = encodeURIComponent(formData.subject);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`);
      window.open(`mailto:youssefssayed5@gmail.com?subject=${subject}&body=${body}`, '_blank');
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
  
  const bearContainerRef = useRef(null);
  
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [coverEyes, setCoverEyes] = useState(false);
  
  // Fix ESLint warnings by properly initializing bearSpeechRef
  const bearSpeechRef = useRef('Hi there! I\'m Beary nice to meet you! Scroll down to contact Youssef! 🐻');
  
  // Expanded message groups with variations
  const messageGroupsRef = useRef({
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
  const phoneMessagesRef = useRef([
    'Call me on WhatsApp! I promise I won\'t bite! 📱',
    'Got WhatsApp? Send a message directly to Youssef! 📲',
    'One tap on that number and you can chat with Youssef on WhatsApp! 💬',
    'WhatsApp is Youssef\'s favorite way to connect with clients! 📞',
    'Quick question? WhatsApp Youssef for an even quicker answer! ⚡'
  ]);
  
  // For email hover
  const emailMessagesRef = useRef([
    'Drop me a message! I check my inbox... sometimes! 📧',
    'Emails are perfect for detailed project discussions! 📝',
    'Send Youssef an email - it\'s the professional way to connect! 📨',
    'Need to share documents or details? Email is the way to go! 📎',
    'Your email will land directly in Youssef\'s priority inbox! ⭐'
  ]);
  
  // For location hover
  const locationMessagesRef = useRef([
    'Alex is the best city! The sea! The food! The traffic... well, 2 out of 3 isn\'t bad! 🌇',
    'Alexandria - where the Mediterranean meets incredible talent! 🌊',
    'The beautiful coastal city where Youssef brings designs to life! 🏙️',
    'From the shores of Alexandria to the digital world - location is no barrier! 🌍',
    'Alexandria: rich in history and home to your next favorite developer! 🏛️'
  ]);
  
  // For social hover
  const socialMessagesRef = useRef([
    'WARNING!! Funny content ahead! Cover your eyes if you can\'t handle awesomeness! 🙈',
    'Oh no! My eyes can\'t handle this much amazing content! 🙉',
    'Too much awesomeness in these social profiles! Must... cover... eyes! 😵',
    'Sensory overload from all this social media greatness! 🙈',
    'Warning: Viewing these profiles may cause extreme admiration! 🤩'
  ]);
  
  // Current group for rotation - use refs instead of state
  const currentGroupRef = useRef('welcome');
  const currentIndexRef = useRef(0);
  
  // Enhanced message rotation with group switching - optimized with refs
  useEffect(() => {
    // Function to update speech bubble DOM directly without causing re-renders
    const updateSpeechBubbleText = (text) => {
      bearSpeechRef.current = text;
      // Find and update the speech bubble element directly if it exists
      const speechBubbles = document.querySelectorAll('.bear-speech-text');
      speechBubbles.forEach(bubble => {
        if (bubble) {
          bubble.innerHTML = processMessage(text);
        }
      });
    };
    
    // Process message to add highlight span to special keywords
    const processMessage = (message) => {
      // Highlight keywords with the gradient effect
      const keywords = ['talented', 'React', 'developer', 'websites', 'modern', 'amazing', 'Youssef'];
      let processedMessage = message;
      
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        processedMessage = processedMessage.replace(regex, `<span class="highlight">$&</span>`);
      });
      
      return processedMessage;
    };
    
    // Only rotate messages when there's no specific message showing
    if (!activeTooltip && !coverEyes) {
      const groupInterval = setInterval(() => {
        // Switch to a different message group every 15 seconds
        const groups = Object.keys(messageGroupsRef.current);
        const currentGroupIndex = groups.indexOf(currentGroupRef.current);
        const nextGroupIndex = (currentGroupIndex + 1) % groups.length;
        currentGroupRef.current = groups[nextGroupIndex];
      }, 15000);
      
      const messageInterval = setInterval(() => {
        // Rotate through messages within the current group every 5 seconds
        const messages = messageGroupsRef.current[currentGroupRef.current];
        const nextIndex = (currentIndexRef.current + 1) % messages.length;
        currentIndexRef.current = nextIndex;
        
        // Update text without causing re-renders
        updateSpeechBubbleText(messages[nextIndex]);
      }, 5000);
      
      return () => {
        clearInterval(groupInterval);
        clearInterval(messageInterval);
      };
    }
  }, [activeTooltip, coverEyes]);
  
  // Get random message from array without causing re-renders
  const getRandomMessage = (messageArray) => {
    const randomIndex = Math.floor(Math.random() * messageArray.length);
    return messageArray[randomIndex];
  };
  
  // Process message to add highlight spans
  const processMessage = (message) => {
    // Highlight keywords with the gradient effect
    const keywords = ['talented', 'React', 'developer', 'websites', 'modern', 'amazing', 'Youssef'];
    let processedMessage = message;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      processedMessage = processedMessage.replace(regex, `<span class="highlight">$&</span>`);
    });
    
    return processedMessage;
  };
  
  // Update handlers to use refs
  const handleInfoHover = (infoType) => {
    setActiveTooltip(infoType);
    let newMessage = '';
    if (infoType === 'phone') {
      newMessage = getRandomMessage(phoneMessagesRef.current);
    } else if (infoType === 'email') {
      newMessage = getRandomMessage(emailMessagesRef.current);
    } else if (infoType === 'location') {
      newMessage = getRandomMessage(locationMessagesRef.current);
    }
    
    // Update text without causing re-renders
    bearSpeechRef.current = newMessage;
    
    // Find and update the speech bubble element directly
    const speechBubbles = document.querySelectorAll('.bear-speech-text');
    speechBubbles.forEach(bubble => {
      if (bubble) {
        bubble.innerHTML = processMessage(newMessage);
      }
    });
  };
  
  const handleSocialHover = () => {
    setCoverEyes(true);
    const newMessage = getRandomMessage(socialMessagesRef.current);
    
    // Update text without causing re-renders
    bearSpeechRef.current = newMessage;
    
    // Find and update the speech bubble element directly
    const speechBubbles = document.querySelectorAll('.bear-speech-text');
    speechBubbles.forEach(bubble => {
      if (bubble) {
        bubble.innerHTML = processMessage(newMessage);
      }
    });
  };
  
  const handleSocialLeave = () => {
    setCoverEyes(false);
    
    // Return to a random welcome message when no longer hovering
    const welcomeMessages = messageGroupsRef.current.welcome;
    const newMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    // Update text without causing re-renders
    bearSpeechRef.current = newMessage;
    
    // Find and update the speech bubble element directly
    const speechBubbles = document.querySelectorAll('.bear-speech-text');
    speechBubbles.forEach(bubble => {
      if (bubble) {
        bubble.innerHTML = processMessage(newMessage);
      }
    });
  };
  
  const handleInfoLeave = () => {
    setActiveTooltip(null);
    // Don't clear the speech - let it return to rotation
  };

  // Create a memoized bear component to ensure it's only defined once
  const FixedBear = useMemo(() => {
    return (
      <FixedBearContainer className="fixed-bear-container">
        <BearContainer
          ref={bearContainerRef}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BearSpeech className="bear-speech">
            <span className="bear-speech-text" dangerouslySetInnerHTML={{ __html: processMessage(bearSpeechRef.current) }} />
          </BearSpeech>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [0, 0, 5], fov: 50 }}
            style={{ 
              width: '100%', 
              height: '100%',
              borderRadius: '0', /* Removed border radius */
              background: 'transparent',
              border: 'none', /* Remove any border */
              boxShadow: 'none', /* Remove any shadow */
              position: 'relative',
              top: '5px' /* Minimal offset to align with speech bubble */
            }}
          >
            <ambientLight intensity={0.7} />
            <pointLight position={[10, 10, 10]} intensity={0.5} />
            <group scale={1.7}> {/* Maintained the scale */}
              <ContactBear socialHover={coverEyes} />
            </group>
          </Canvas>
        </BearContainer>
      </FixedBearContainer>
    );
  }, [coverEyes]);

  // Add scroll detection
  const [isScrolled, setIsScrolled] = useState(false);
  const contactSectionRef = useRef(null);
  
  // Detect scroll position within the contact section
  useEffect(() => {
    const handleScroll = () => {
      if (contactSectionRef.current) {
        const scrolled = window.scrollY > contactSectionRef.current.offsetTop + 100;
        setIsScrolled(scrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply the styles when the component is rendered
  useEffect(() => {
    // Add the global styles to the document when component mounts
    const styleElement = document.createElement('style');
    styleElement.innerHTML = cursorTrackingStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  return (
    <ContactSection id="contact" ref={(el) => {
      contactSectionRef.current = el;
      ref(el);
    }} className={`contact-section-container ${isScrolled ? 'scrolled' : ''}`}>
      {/* Fixed bear component that stays visible within the Contact section */}
      {FixedBear}
      
      <ContentContainer>
        <SectionTitle
          initial={{ opacity: 0, y: -50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          Connect <span>With Me</span>
        </SectionTitle>
        
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
                minLength="2"
                maxLength="50"
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
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                title="Please enter a valid email address"
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
                minLength="2"
                maxLength="100"
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
                minLength="10"
                maxLength="1000"
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