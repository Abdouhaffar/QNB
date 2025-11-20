import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// تأكد من استيراد ملف TailwindCSS هنا
import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
