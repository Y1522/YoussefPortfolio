import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import cvPdf from '../assets/YOUSSEF SAYED HUSSIEN - CV  (2).pdf';

const ResumeSection = styled.section`
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

const Tabs = styled(motion.div)`
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
  gap: 2rem;
  flex-wrap: wrap;
`;

const Tab = styled(motion.button)`
  background: transparent;
  border: none;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${props => props.active ? '#fff' : '#aaa'};
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background: linear-gradient(90deg, #915eff, #00abfa);
    transition: width 0.3s ease;
  }
  
  &:hover:after {
    width: 100%;
  }
`;

const TimelineContainer = styled(motion.div)`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 0;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: calc(50% - 1px);
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, rgba(145, 94, 255, 0), rgba(145, 94, 255, 1), rgba(145, 94, 255, 0));
    
    @media (max-width: 768px) {
      left: 20px;
    }
  }
`;

const TimelineItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: 40px;
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:nth-child(odd) {
    .timeline-content {
      margin-left: auto;
      
      @media (max-width: 768px) {
        margin-left: 0;
      }
    }
  }
`;

const TimelineDot = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #915eff;
  left: calc(50% - 10px);
  top: 20px;
  box-shadow: 0 0 10px rgba(145, 94, 255, 0.8);
  z-index: 1;
  
  @media (max-width: 768px) {
    left: -30px;
  }
`;

const TimelineContent = styled(motion.div)`
  width: 45%;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  position: relative;
  
  @media (max-width: 768px) {
    width: 100%;
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  }
`;

const TimelineDate = styled.span`
  display: inline-block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #915eff;
  margin-bottom: 0.5rem;
  background: rgba(145, 94, 255, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
`;

const TimelineTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #fff;
`;

const TimelineSubtitle = styled.h4`
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 1rem;
  color: #00abfa;
`;

const TimelineText = styled.p`
  font-size: 1rem;
  color: #aaa;
  line-height: 1.5;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ProjectCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
    border-color: rgba(145, 94, 255, 0.5);
  }
`;

const ProjectTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
`;

const ProjectLink = styled.a`
  display: inline-block;
  color: #00abfa;
  text-decoration: none;
  font-weight: 500;
  margin-top: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #915eff;
    text-decoration: underline;
  }
`;

const SkillBar = styled(motion.div)`
  margin-bottom: 1.5rem;
  
  .skill-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  
  .skill-name {
    font-size: 1rem;
    font-weight: 500;
    color: #fff;
  }
  
  .skill-percentage {
    font-size: 0.9rem;
    color: #00abfa;
  }
  
  .skill-bar-bg {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
  }
  
  .skill-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #915eff, #00abfa);
    border-radius: 10px;
    transform-origin: left;
  }
`;

const Resume = () => {
  const [activeTab, setActiveTab] = useState('experience');
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });
  
  const experienceData = [
    {
      date: "2017 - Present",
      title: "Volunteer",
      company: "Bibliotheca Alexandrina",
      description: `Volunteering at the Children's Library.
    Creating and presenting scientific content in an engaging and fun way for children aged 6–11.
    Conducting workshops such as Web Land, Make Your Own Game, AI Sites, and more for children aged 9–11.`
    },
    {
      date: "2023 - Present",
      title: "Volunteer",
      company: "Bibliotheca Alexandrina",
      description: `Volunteering at the Planetarium Science Center.
    Creating and presenting scientific content in an engaging and fun way for participants aged 6–18.
    Mentoring teams in robotics competitions, including FLL Challenge and Robofest.
    Organizing and planning large-scale educational and scientific events.`
    },
    {
      date: "2025",
      title: "IT Volunteer",
      company: "Techne Summit Alexandria",
      description: `As an IT team member, I contributed to the setup and maintenance of network infrastructure, managed audio-visual equipment and presentation systems, and provided real-time technical support during large-scale events. By troubleshooting hardware, network, and AV issues and collaborating closely with the IT team, I helped ensure smooth technical operations and a seamless experience for attendees, speakers, and event organizers.`
    },
    {
      date: "2026",
      title: "Part Time organizer ",
      company: "icom Group ",
      description: `Part of the IT and AV teams dealing with a real world projects and stepup `
    },
    {
      date: "2025-2026",
      title: "JUDGE",
      company: "Robotics Competitions",
      description: `(MRC, OREC, Guins Cup , RoboCup ) Judging the Robotics Competitions, providing feedback and guidance to the participants, and helping them improve their skills. `
    }
  ];
  
  const educationData = [
    {
      date: "2024 - Present",
      title: "Student of Computers and Data Science",
      institution: "Alexandria University",
      description: "Majored in Data Science, studying core tools and software used in the field, along with data science methodologies, machine learning, probability (I & II), data structures , and more "
    }
  ];
  
  const projectsData = {
    dataScience: [
      {
        name: "cardio-risk-analysis",
        githubLink: "https://github.com/Y1522/cardio-risk-analysis",
        description: "Cardio Risk Analysis is a data mining and machine learning project focused on analyzing cardiovascular health data using preprocessing, feature scaling, clustering algorithms, and logistic regression to discover hidden patterns and predict potential health risks.",
        technologies: ["Python", "Logistic Regression", "K-Medoids Clustering", "Feature Scaling", "Data Visualization", "Scikit-learn", "Genatic Algorithm","Pandas", "Matplotlib"]
      },
       {
        name: "WeatherPulse-DataScience",
        githubLink: "https://github.com/Y1522/WeatherPulse-DataScience",
        description: "A complete data science pipeline for weather analytics using NOAA data, including data acquisition, preprocessing, EDA, visualization, and machine learning forecasting.",
        technologies: ["Python", "Data Collection","API", "Data Visualization", "Scikit-learn","Pandas", "Matplotlib","LSTM"]
      },
      {
        name: "car-price-prediction-sas",
        githubLink: "https://github.com/Y1522/car-price-prediction-sas",
        description: "End-to-end SAS data Science and machine learning project for used car price prediction and price category classification using preprocessing, feature engineering, regression, and multinomial logistic models.",
        technologies: ["SAS", "Data Science", "Machine Learning", "Preprocessing", "Feature Engineering", "Regression", "Multinomial Logistic Models"]
      }
    ],
    machineLearning: [
      {
        name: "AI-vs-Human-Puzzle",
        githubLink: "https://github.com/Y1522/AI-vs-Human-Puzzle",
        description: "An interactive 8-puzzle game built with Python and Tkinter, featuring AI-powered solving using A* and BFS algorithms. Challenge yourself, watch the AI solve puzzles in real time, or compete against intelligent search algorithms in an exciting race mode.",
        technologies: ["Python", "Tkinter", "A*", "BFS"]
      },
      {
        name: "housing-price-regression",
        githubLink: "https://github.com/Y1522/housing-price-regression",
        description: "Machine learning regression project analyzing the California Housing dataset using exploratory data analysis, preprocessing, feature engineering, and regression modeling for house price prediction.",
        technologies: ["Python", "Linear Regression", "Pandas", "Matplotlib"]
      }
    ],
    web: [
      {
        name: "Science_Festivity-25",
        githubLink: "https://github.com/Y1522/Science_Festivity-25",
        description: "An interactive educational website developed for Science Festivity 2025, showcasing the achievements of Arab scientists during the Golden Age of Islam. Features multilingual support, educational games, an AI-powered chatbot assistant AND  an interactive map",
        technologies: ["HTML", "CSS", "JavaScript", "Firebase Hosting"]
      },
      {
        name: "Portfolio Website",
        githubLink: "https://github.com/Y1522/Youssefcv1.1",
        description: "A modern, responsive portfolio website built with React, Three.js, and Framer Motion. Features interactive 3D elements, smooth animations, and a clean, professional design.",
        technologies: ["React", "Three.js", "Framer Motion", "Styled Components", "CSS3"]
      }
    ]
  };
  
  const skillsData = [
    { name: "Python ", percentage: 95 },
    { name: "JavaScript", percentage: 80 },
    { name: "Java", percentage: 80 },
    { name: "C++ (Arduino)", percentage: 80 },
    { name: "React,Three.js", percentage: 80 },
    { name: "HTML/CSS", percentage: 95 },
    { name: "Git/GitHub", percentage: 85 },
    { name: "Data Structures & Algorithms", percentage: 80 },
    { name: "Problem Solving", percentage: 80 },
    { name: "AI & ML", percentage: 80 },
    { name: "IT", percentage: 80 },
    { name: "Robotics", percentage: 80 },
    { name: "Mindstorm", percentage: 90 },
  ];
  
  const renderTimeline = (data) => {
    return data.map((item, index) => (
      <TimelineItem
        key={index}
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.5, delay: index * 0.2 }}
      >
        <TimelineDot 
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : { scale: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
        />
        <TimelineContent 
          className="timeline-content"
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <TimelineDate>{item.date}</TimelineDate>
          <TimelineTitle>{item.title}</TimelineTitle>
          <TimelineSubtitle>{item.company || item.institution}</TimelineSubtitle>
          <TimelineText>{item.description}</TimelineText>
        </TimelineContent>
      </TimelineItem>
    ));
  };
  
  const renderSkills = () => {
    return (
      <SkillsGrid>
        {skillsData.map((skill, index) => (
          <SkillBar
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="skill-info">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-percentage">{skill.percentage}%</span>
            </div>
            <div className="skill-bar-bg">
              <motion.div 
                className="skill-bar-fill"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: skill.percentage / 100 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: "easeOut" }}
              />
            </div>
          </SkillBar>
        ))}
      </SkillsGrid>
    );
  };
  
  const renderProjectCategory = (title, projects) => {
    if (projects.length === 0) {
      return (
        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ color: '#00abfa', marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>{title}</h3>
          <p style={{ textAlign: 'center', color: '#aaa' }}>Projects coming soon...</p>
        </div>
      );
    }
    return (
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ color: '#00abfa', marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>{title}</h3>
        <ProjectsGrid>
          {projects.map((project, index) => (
            <ProjectCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}
            >
              <ProjectTitle>{project.name}</ProjectTitle>
              <TimelineText style={{ marginBottom: '1rem' }}>{project.description}</TimelineText>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px', 
                marginBottom: '1rem' 
              }}>
                {project.technologies.map((tech, i) => (
                  <span key={i} style={{
                    background: 'rgba(145, 94, 255, 0.2)',
                    color: '#00abfa',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
              <ProjectLink 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View on GitHub →
              </ProjectLink>
            </ProjectCard>
          ))}
        </ProjectsGrid>
      </div>
    );
  };

  const renderProjects = () => {
    return (
      <div>
        {renderProjectCategory("Data Science Projects", projectsData.dataScience)}
        {renderProjectCategory("Machine Learning Projects", projectsData.machineLearning)}
        {renderProjectCategory("Web Projects", projectsData.web)}
      </div>
    );
  };
  
  const tabVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <ResumeSection id="resume" ref={ref}>
      <ContentContainer>
        <SectionTitle
          initial={{ opacity: 0, y: -50 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          My <span>Resume</span>
        </SectionTitle>
        
        <Tabs
          variants={tabVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <Tab 
            active={activeTab === 'experience'} 
            onClick={() => setActiveTab('experience')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Experience
          </Tab>
          <Tab 
            active={activeTab === 'education'} 
            onClick={() => setActiveTab('education')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Education
          </Tab>
          <Tab 
            active={activeTab === 'projects'} 
            onClick={() => setActiveTab('projects')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            My Projects
          </Tab>
          <Tab 
            active={activeTab === 'skills'} 
            onClick={() => setActiveTab('skills')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Skills
          </Tab>
        </Tabs>
        
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'experience' && (
            <TimelineContainer>
              {renderTimeline(experienceData)}
            </TimelineContainer>
          )}
          
          {activeTab === 'education' && (
            <TimelineContainer>
              {renderTimeline(educationData)}
            </TimelineContainer>
          )}
          
          {activeTab === 'projects' && renderProjects()}
          
          {activeTab === 'skills' && renderSkills()}
        </motion.div>
        
        <motion.div
          style={{ textAlign: 'center', marginTop: '3rem' }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 1 }}
        >
          <a 
            href={cvPdf}
            download="Youssef_CV.pdf"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, #915eff, #00abfa)',
              padding: '0.8rem 2rem',
              borderRadius: '5px',
              color: 'white',
              fontWeight: 500,
              textDecoration: 'none',
              boxShadow: '0 10px 20px rgba(145, 94, 255, 0.3)'
            }}
          >
            Download Full CV
          </a>
        </motion.div>
      </ContentContainer>
    </ResumeSection>
  );
};

export default Resume;
