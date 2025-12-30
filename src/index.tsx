import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../index.css'; 

// Ensure the root element exists in index.html
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Make sure index.html has a <div id='root'></div>");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);