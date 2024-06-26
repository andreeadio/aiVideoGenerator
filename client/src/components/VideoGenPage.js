import React, { useState } from 'react';
import PromptForm from './PromptForm';
import { Card } from 'primereact/card'

function VideoGenPage() {


    const [videoUrl, setVideoUrl] = useState(null);

    const handleVideoGenerated = (url) => {

        console.log('Video URL received:', url);

        setVideoUrl(`http://localhost:8080${url}`);
    };

    return (
        <div className="App">


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

export default VideoGenPage;