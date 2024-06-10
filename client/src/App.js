import logo from './logo.svg';
import './App.css';


import React, { useState } from 'react';
import PromptForm from './components/PromptForm';


function App() {


  const [videoUrl, setVideoUrl] = useState(null);

  const handleVideoGenerated = (url) => {

    console.log('Video URL received:', url);

    setVideoUrl(`http://localhost:8080${url}`);
  };

  return (
    <div className="App">

      <h1>Video Generator</h1>
      <PromptForm onSubmit={handleVideoGenerated} />

      {videoUrl && (
        <div>
          <h2>Generated Video</h2>
          <a href={videoUrl} download="video.mp4">Download Video</a>
          <video src={videoUrl} controls />
        </div>
      )}
    </div>
  );
}

export default App;
