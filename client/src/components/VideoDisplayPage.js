import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

import './VideoDisplayPage.css';

function VideoDisplayPage() {
    const location = useLocation();
    const initialVideoUrl = location.state ? location.state.videoUrl : '';
    const [videoUrl, setVideoUrl] = useState(initialVideoUrl);
    const [videos, setVideos] = useState([]);
    const toast = useRef(null);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/videos', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setVideos(response.data);
                // Optionally set the first video as the default if no initial video URL was provided
                if (!initialVideoUrl && response.data.length > 0) {
                    setVideoUrl(`http://localhost:8080${response.data[0].videoUrl}`);
                }
            } catch (error) {
                console.error('Error fetching videos:', error);
            }
        };

        fetchVideos();
    }, [initialVideoUrl]);

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
            <Toast ref={toast} />

            <Card title="Preview" className="video-card">
                <video src={videoUrl} controls style={{ width: '100%' }} />
                <div className="download-button">
                    <Button label="Download Video" icon="pi pi-download" onClick={() => handleDownloadVideo(videoUrl)} className="p-button-primary" />
                </div>
            </Card>

            <Card title="Video List" className="video-list">
                {videos.map(video => (
                    <Button
                        key={video._id}
                        label={video.videoUrl.split('/').pop()}
                        onClick={() => setVideoUrl(`http://localhost:8080${video.videoUrl}`)}
                        className="video-list-item"
                    />
                ))}
            </Card>

        </div>
    );
}

export default VideoDisplayPage;
