import './PromptForm.css'
import React, { useState } from 'react'
import axios from 'axios'

import { Button } from 'primereact/button'
// import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { ProgressSpinner } from 'primereact/progressspinner'
//import 'primeicons'

function PromptForm({ onSubmit }) {


    //variables 
    const [prompts, setPrompts] = useState([''])
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState([]);

    const [videoLoading, setVideoLoading] = useState(false); // Loading state for video
    const [videoUrl, setVideoUrl] = useState(null); // State to hold the generated video URL

    //functions
    const handleChange = (e, index) => {
        const newPrompts = [...prompts]
        newPrompts[index] = e.target.value
        setPrompts(newPrompts)
    }

    const addPrompt = () => setPrompts([...prompts, ''])

    const generateImage = async (prompt, index) => {
        setLoading((prevLoading) => {
            const newLoading = [...prevLoading];
            newLoading[index] = true;
            return newLoading;
        });

        try {
            const response = await axios.post('http://localhost:8080/api/generate-image', { prompt, index });
            const newImages = [...images];
            newImages[index] = response.data.imageUrl;
            setImages(newImages);
        } catch (error) {
            console.error('Error generating image:', error);
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
        // const newLoading = loading.filter((_, i) => i !== index);
        setPrompts(newPrompts);
        setImages(newImages);
        //setLoading(newLoading);
    };


    const handleGenerateVideo = async () => {

        //e.preventDefault()
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/generate-video', { prompts });

            console.log('Response from server:', response.data);

            onSubmit(response.data.videoUrl);
        } catch (error) {
            console.error('Error generating video:', error);
        } finally {
            setLoading(false);
        }
    };


    //visual part
    return (

        < form onSubmit={(e) => e.preventDefault()} className='form' >
            {
                prompts.map((prompt, index) => (
                    <div key={index} className='prompt-container'>

                        <div>
                            <label htmlFor="scene">Scene {index + 1}</label>
                            <InputTextarea
                                id={`scene${index + 1}`}
                                type='text'
                                value={prompt}
                                onChange={(e) => handleChange(e, index)}
                                placeholder={`Description here...`}
                            />
                            <Button icon='pi pi-trash' severity="danger" tooltip='Delete'
                                onClick={() => deletePrompt(index)}
                                disabled={loading[index]}> </Button>
                            <Button icon='pi pi-arrow-right' tooltip='Generate'
                                onClick={() => generateImage(prompt, index)}
                                disabled={loading[index]}> </Button>

                            {/* {images[index] && <img src={images[index]} alt={`Generated ${index}`} style={{ maxWidth: '100px', marginTop: '10px' }} />} */}
                            {/* {images[index] && <img src={`${images[index]}?timestamp=${new Date().getTime()}`} alt={`Generated ${index}`} className="generated-image" />} */}

                            {loading[index] ? (
                                <ProgressSpinner style={{ width: '50px', height: '50px' }} />
                            ) : (
                                images[index] && <img src={`${images[index]}?timestamp=${new Date().getTime()}`} alt={`Generated ${index}`} className="generated-image" />
                            )}

                        </div>

                    </div>
                ))}
            <div>
                <Button type="button" onClick={addPrompt} label='Add Scene' icon='pi pi-plus'>
                </Button>
            </div>

            <div>
                <Button type="submit" onClick={handleGenerateVideo} icon='pi pi-video' label='Generate video' >
                </Button>
            </div>

        </form>
    )

}

export default PromptForm
