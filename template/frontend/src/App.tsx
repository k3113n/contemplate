import React, { useState, useEffect } from 'react';
import './styles/App.css';  

const App: React.FC = () => {
  const [message, setMessage] = useState<string>("");


  useEffect(() => {
    fetch("/api/get")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error fetching message:", error));
  }, []);

  return (
    <div className="container">
      <h1>Message from the Backend:</h1>
      <p>{message}</p>
    </div>
  );
};

export default App;
