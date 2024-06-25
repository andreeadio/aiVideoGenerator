import './PromptForm.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useNavigate } from 'react-router-dom';

function PromptForm({ onSubmit }) {
    const [prompts, setPrompts] = useState(['']);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState([]);
    const [videoLoading, setVideoLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const newPrompts = [...prompts];
        newPrompts[index] = e.target.value;
        setPrompts(newPrompts);
    };

    const addPrompt = () => setPrompts([...prompts, '']);

    const generateImage = async (prompt, index) => {
        setLoading((prevLoading) => {
            const newLoading = [...prevLoading];
            newLoading[index] = true;
            return newLoading;
        });

        try {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            const response = await axios.post(
                'http://localhost:8080/api/generate-image',
                { prompt, index },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                }
            );
            const newImages = [...images];
            newImages[index] = response.data.imageUrl;
            setImages(newImages);
        } catch (error) {
            console.error('Error generating image:', error);

            if (error.response && error.response.status === 503) {
                setErrorMessage('Service unavailable. Please try again later.');
            } else {
                setErrorMessage('Error generating image. Please try again later.');
            }
        } finally {
            setLoading((prevLoading) => {
                const newLoading = [...prevLoading];
                newLoading[index] = false;
                return newLoading;
            });
        }
    };

    const deletePrompt = (index) => {
        const newPrompts = prompts.filter((_, i) => i !== index);
        const newImages = images.filter((_, i) => i !== index);
        setPrompts(newPrompts);
        setImages(newImages);
    };

    const handleGenerateVideo = async () => {
        setVideoLoading(true);

        try {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            const response = await axios.post('http://localhost:8080/api/generate-video', { prompts }, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            });
            console.log('Response from server:', response.data);
            onSubmit(response.data.videoUrl);
            navigate('/video', { state: { videoUrl: `http://localhost:8080${response.data.videoUrl}` } });
        } catch (error) {
            console.error('Error generating video:', error);
        } finally {
            setVideoLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={(e) => e.preventDefault()} className="form">
                {prompts.map((prompt, index) => (
                    <div key={index} className="prompt-container">
                        <div className="prompt-label-textarea">
                            <label htmlFor={`scene${index + 1}`}>Scene {index + 1}</label>
                            <InputTextarea
                                id={`scene${index + 1}`}
                                type="text"
                                value={prompt}
                                onChange={(e) => handleChange(e, index)}
                                placeholder="Description here..."
                                className="full-width"
                            />
                        </div>
                        <div className="button-group">
                            <Button
                                icon="pi pi-trash"
                                severity="danger"
                                tooltip="Delete"
                                className="p-button-danger"
                                tooltipOptions={{ position: 'center' }}
                                onClick={() => deletePrompt(index)}
                                disabled={loading[index]}
                            />
                            <Button
                                icon="pi pi-arrow-right"
                                tooltip="Generate"
                                tooltipOptions={{ position: 'center' }}
                                onClick={() => generateImage(prompt, index)}
                                disabled={loading[index]}
                            />
                        </div>
                        {loading[index] ? (
                            <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                        ) : (
                            images[index] && <img src={images[index]} alt={`Generated ${index}`} className="generated-image" />
                        )}
                    </div>
                ))}
                <Button onClick={addPrompt} label="Add Scene" icon="pi pi-plus" className="add-scene-button" />
                <Button
                    label="Generate Video"
                    icon="pi pi-video"
                    onClick={handleGenerateVideo}
                    disabled={loading.includes(true) || videoLoading}
                    className="generate-video-button"
                />
                {videoLoading && (
                    <div className="progress-spinner">
                        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                    </div>
                )}
            </form>
        </div>
    );
}

export default PromptForm;
