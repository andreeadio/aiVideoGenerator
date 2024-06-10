import React, { useState } from 'react'
import axios from 'axios';

function PromptForm({ onSubmit }) {


    //variables 
    const [prompts, setPrompts] = useState([''])
    const [loading, setLoading] = useState(false);


    //functions
    const handleChange = (e, index) => {
        const newPrompts = [...prompts]
        newPrompts[index] = e.target.value
        setPrompts(newPrompts)
    }

    const addPrompt = () => setPrompts([...prompts, ''])

    const handleSubmit = async (e) => {
        e.preventDefault()
        // onSubmit(prompts)
        setLoading(true);
        console.log('Submitting prompts:', prompts); // Debugging statement

        try {
            const response = await axios.post(`http://localhost:8080/api/generate-video`, {
                prompts,
                // width,
                // height
            });

            console.log('Response from server:', response.data);

            onSubmit(response.data.videoUrl);
        } catch (error) {
            console.error('Error generating video:', error);
        }
        finally {
            setLoading(false);
        }
    }


    //visual part
    return (

        < form onSubmit={handleSubmit} >
            {
                prompts.map((prompt, index) => (
                    <div key={index}>
                        <input
                            type='text'
                            value={prompt}
                            onChange={(e) => handleChange(e, index)}
                            placeholder={`Prompt ${index + 1}`}
                        />
                        <button type='button'> gen</button>
                    </div>
                ))}
            <div>
                <button type="button" onClick={addPrompt} disabled={loading}> Add Scene
                </button>
            </div>

            <div>
                <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Video'}
                </button>
            </div>

        </form>
    )

}

export default PromptForm