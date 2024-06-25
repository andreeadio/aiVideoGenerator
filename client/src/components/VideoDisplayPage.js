import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './VideoDisplayPage.css';

function VideoDisplayPage() {
    const location = useLocation();
    const { videoUrl } = location.state;

    return (
        <div className="video-display-container">
            <Card title="Video Ready!" className="info-card">
                <p>Your video has been successfully generated and is ready for viewing and download.</p>
            </Card>
            <Card className="video-card">
                <video src={videoUrl} controls />
                <div className="download-button">
                    <Button label="Download Video" icon="pi pi-download" onClick={() => window.location.href = videoUrl} className="p-button-primary" />
                </div>
            </Card>
        </div>
    );
}

export default VideoDisplayPage;
