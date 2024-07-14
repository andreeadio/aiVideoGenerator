import './PromptForm.css';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { InputNumber } from 'primereact/inputnumber';
import { FileUpload } from 'primereact/fileupload';
import { useNavigate } from 'react-router-dom';
import { Panel } from 'primereact/panel';
import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card'
import { Toast } from 'primereact/toast';

import { Accordion, AccordionTab } from 'primereact/accordion';
import LoadingOverlay from './LoadingOverlay';

function PromptForm({ onSubmit }) {
    const [prompts, setPrompts] = useState(['']);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    //scenes
    const [numScenes, setNumScenes] = useState(1);
    const [topic, setTopic] = useState('');
    const [pageLoading, setPageLoading] = useState(false);


    //*audio    
    const [dialogVisible, setDialogVisible] = useState(false);
    const [duration, setDuration] = useState(5); // Default duration
    const [audioFile, setAudioFile] = useState(null);
    const [audioId, setAudioId] = useState(null);

    //errors
    const [errors, setErrors] = useState({})
    const toast = useRef(null)
    const validateDialog = () => {
        let tempErrors = {}
        let isValid = true

        if (!topic) {
            tempErrors.topic = 'This field is required!'
            isValid = false
        }

        if (!numScenes) {
            tempErrors.numScenes = 'This field is required!'
            isValid = false
        } else if (numScenes > 10 || numScenes < 0) {
            tempErrors.numScenes = 'Input a maximum of 10 scenes!'
            isValid = false
        }


        setErrors(tempErrors)
        return isValid
    }

    const handleGenerateDescriptions = async () => {


        if (!validateDialog()) {
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Form is not valid',
                life: 3000
            })
            return;
        }
        setPageLoading(true);
        setDialogVisible(false);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8080/api/generate-descriptions',
                { numScenes, topic },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPrompts(response.data.descriptions);
            setDialogVisible(false);
            // setPageLoading(false);

        } catch (error) {
            console.error('Error generating descriptions:', error);
        } finally {
            setDialogVisible(false);
            setPageLoading(false);
            setNumScenes(1); // Reset numScenes
            setTopic(''); // Reset topic
        }
    };

    const dialogFooter = (
        <div>
            <Button label="Generate" icon="pi pi-sparkles" onClick={handleGenerateDescriptions} autoFocus />
        </div>
    );



    const handleAudioUpload = async (event) => {
        const file = event.files[0];
        setAudioFile(file);
        console.log('Audio uploaded:', file); // Ensure this message is logged

        // Upload audio file to server and get audioId
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('audio', file);

            const response = await axios.post('http://localhost:8080/api/upload-audio', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAudioId(response.data.audioId);
            console.log('Audio ID:', response.data.audioId);
        } catch (error) {
            console.error('Error uploading audio:', error);
        }
    };

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
        setPageLoading(true);

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('prompts', JSON.stringify(prompts));
            formData.append('duration', duration);
            formData.append('audioId', audioId); // Send the audio ID

            const response = await axios.post('http://localhost:8080/api/generate-video', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Response from server:', response.data);
            onSubmit(response.data.videoUrl);
            navigate('/video', { state: { videoUrl: `http://localhost:8080${response.data.videoUrl}` } });
        } catch (error) {
            console.error('Error generating video:', error);
            setPageLoading(false);

        } finally {
            setPageLoading(false);

        }
    };

    return (
        <div>
            <Toast ref={toast} />
            <LoadingOverlay visible={pageLoading} />
            <div className="container">


                <Button label="AI Scenes" icon="pi pi-sparkles" onClick={() => setDialogVisible(true)} className='p-button-help' />
                {errors.api && <p className="error-message">{errors.api}</p>}
                <Dialog header="Generate Scene Descriptions" visible={dialogVisible} style={{ width: '50vw' }} footer={dialogFooter}
                    onHide={() => {
                        setErrors({});
                        setNumScenes(1);
                        setTopic('');
                        setDialogVisible(false)
                    }}>

                    <div className='dialog-content'>
                        <div className="p-fluid">
                            <div className="p-field">
                                <label htmlFor="numScenes">Number of Scenes:</label>
                                <InputNumber id="numScenes" value={numScenes} onValueChange={(e) => setNumScenes(e.value)} />
                                {errors.numScenes && <small className="p-error">{errors.numScenes}</small>}
                            </div>
                        </div>
                        <div className="p-fluid">
                            <div className="p-field">
                                <label htmlFor="topic">Topic:</label>
                                <InputTextarea id="topic" value={topic} onChange={(e) => setTopic(e.target.value)} autoResize />
                                {errors.topic && <small className="p-error">{errors.topic}</small>}
                            </div>
                        </div>
                    </div>
                </Dialog>


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
                    <Panel header="Scene Settings" className="custom-panel" toggleable>
                        <div className="duration-audio-container">

                            <div className="duration-setting">
                                <label htmlFor="duration">Duration for each scene (seconds):</label>
                                <InputNumber
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.value)}
                                    placeholder="Duration"
                                    className="full-width"

                                />
                            </div>

                            <div className="audio-upload">
                                <label htmlFor="audio">Choose music or voiceover:</label>
                                <FileUpload
                                    mode="basic"
                                    accept="audio/*"
                                    maxFileSize={10000000}
                                    customUpload
                                    uploadHandler={handleAudioUpload}
                                    className="full-width"
                                />

                            </div>
                        </div>


                    </Panel>
                    <Button
                        label="Generate Video"
                        icon="pi pi-video"
                        onClick={handleGenerateVideo}
                        disabled={loading.includes(true) || pageLoading}
                        className="generate-video-button"
                    />
                </form>
            </div>
        </div>
    );
}

export default PromptForm;
