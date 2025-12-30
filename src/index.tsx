import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../index.css'; 

console.log("React is running! Attempting to find root element...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("CRITICAL ERROR: Element with id 'root' not found in index.html.");
  throw new Error("Failed to find the root element");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("React application mounted successfully.");
} catch (error) {
  console.error("CRITICAL ERROR: React failed to mount.", error);
}