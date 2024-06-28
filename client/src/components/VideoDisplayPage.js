import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import './VideoDisplayPage.css';

function VideoDisplayPage() {
    const location = useLocation();
    const { videoUrl } = location.state;

    const handleDownloadVideo = async (url) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'video/mp4',
                },
            });
            const blob = await response.blob();
            const aTag = document.createElement('a');
            const fileName = url.split('/').pop();
            const objectUrl = URL.createObjectURL(blob);
            aTag.href = objectUrl;
            aTag.download = fileName;
            document.body.appendChild(aTag);
            aTag.click();
            URL.revokeObjectURL(objectUrl);
            document.body.removeChild(aTag);
        } catch (error) {
            console.error('Error downloading video:', error);
        }
    };

    return (
        <div className="video-display-container">
            <h3>Video Ready!</h3>
            <p>Your video has been successfully generated and is ready for viewing and download.</p>

            <Card className="video-card">

                <video src={videoUrl} controls />
                <div className="download-button">
                    <Button label="Download Video" icon="pi pi-download" onClick={() => handleDownloadVideo(videoUrl)} className="p-button-primary" />
                </div>
            </Card>
        </div>
    );
}

export default VideoDisplayPage;
