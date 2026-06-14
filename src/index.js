import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

// ✅ Dummy sample values to prevent ESLint errors (replace with real data in App.js or wherever the form is)
const formData = {
  name: 'Youssef',
  email: 'example@gmail.com',
  subject: 'Hello',
  message: 'This is a test message'
};

const sendMethod = 'whatsapp'; // or 'email'

const handleSubmit = (e) => {
  e.preventDefault();

  const text = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0A%0AMessage: ${formData.message}`;

  if (sendMethod === 'whatsapp') {
    window.open(`https://wa.me/201204385018?text=${text}`, '_blank');
  } else {
    window.open(`mailto:youssefssayed5@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)}`);
  }

  // Reload the page after sending the message
  window.location.reload();
};
