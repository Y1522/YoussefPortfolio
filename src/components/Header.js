import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #915eff;
  cursor: pointer;

  span {
    background: linear-gradient(90deg, #915eff, #00abfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNavToggle = styled.div`
  display: none;
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 5rem;
  right: 0;
  width: 100%;
  background: rgba(10, 10, 25, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const NavItem = styled(motion.div)`
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #915eff, #00abfa);
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const Header = ({ onHomeClick, onAboutClick, onResumeClick, onContactClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        staggerChildren: 0.1,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <>
      <HeaderContainer 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        style={{ 
          background: isScrolled ? 'rgba(10, 10, 25, 0.8)' : 'rgba(255, 255, 255, 0.05)',
          padding: isScrolled ? '0.8rem 2rem' : '1rem 2rem'
        }}
      >
        <Logo 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={onHomeClick}
        >
          <span>Youssef</span>
        </Logo>

        <NavLinks as={motion.div} variants={navVariants} initial="hidden" animate="visible">
          <NavItem variants={itemVariants} onClick={onHomeClick}>Home</NavItem>
          <NavItem variants={itemVariants} onClick={onAboutClick}>About</NavItem>
          <NavItem variants={itemVariants} onClick={onResumeClick}>Resume</NavItem>
          <NavItem variants={itemVariants} onClick={onContactClick}>Connect</NavItem>
        </NavLinks>

        <MobileNavToggle onClick={toggleMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {mobileMenuOpen ? (
              <path 
                d="M18 6L6 18M6 6L18 18" 
                stroke="#ffffff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            ) : (
              <path 
                d="M3 12H21M3 6H21M3 18H21" 
                stroke="#ffffff" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            )}
          </svg>
        </MobileNavToggle>
      </HeaderContainer>

      {mobileMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <NavItem onClick={() => { onHomeClick(); setMobileMenuOpen(false); }}>Home</NavItem>
          <NavItem onClick={() => { onAboutClick(); setMobileMenuOpen(false); }}>About</NavItem>
          <NavItem onClick={() => { onResumeClick(); setMobileMenuOpen(false); }}>Resume</NavItem>
          <NavItem onClick={() => { onContactClick(); setMobileMenuOpen(false); }}>Connect</NavItem>
        </MobileMenu>
      )}
    </>
  );
};

export default Header; 