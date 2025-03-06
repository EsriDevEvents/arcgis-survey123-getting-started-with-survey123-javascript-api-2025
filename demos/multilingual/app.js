import { CONFIG } from '../../config.js';

// OpenAI API configuration
const OPENAI_CONFIG = {
    apiKey: CONFIG.openai.apiKey,
    audioEndpoint: CONFIG.openai.endpoints.audio,
    translationEndpoint: CONFIG.openai.endpoints.chat
};

// Survey123 WebForm configuration
const webform = new Survey123WebForm({
    container: 'surveyContainer',
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    clientId: CONFIG.survey123.clientId,
    portalUrl: 'https://www.arcgis.com',
    version: 'latest',
    onFormResized: (data) => {
        resizeWebform(data.contentHeight);
    }
});

// Listen for changes to the 'trigger_field_name' question
webform.on("questionValueChanged", async function (event) {
    if (event.field === 'wildfire_description_audio' && event.trigger == 'user' && event.value) {
        const values = await webform.getQuestionValue();
        const file = values['wildfire_description_audio'][0];
        await processAudio(file);
    }
});

// This function processes the audio file by transcribing and translating its content.
async function processAudio(file) {
    try {

        const values = await webform.getQuestionValue();

        const transcription = await transcribeAudio(file);
        values['wildfire_description_text'] = transcription;
        webform.setQuestionValue(values);

        const translation = await translateText(transcription);
        values['wildfire_description_text_en'] = translation;
        webform.setQuestionValue(values);

        console.log('Processing complete:', { transcription, translation });

    } catch (error) {
        console.error('Error processing audio file:', error);
    }

}

// Transcribe audio using Whisper API
async function transcribeAudio(audioFile) {
    try {
        const formData = new FormData();
        formData.append('file', new File([audioFile.file], audioFile.name, {
            type: audioFile.file.type
        }));
        formData.append('model', 'whisper-1');
        formData.append('response_format', 'json');

        const response = await fetch(OPENAI_CONFIG.audioEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Transcription failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.text;
    } catch (error) {
        console.error('Transcription error:', error);
        throw new Error('Failed to transcribe audio');
    }
}

// Translate text using GPT API
async function translateText(text) {
    try {
        const response = await fetch(OPENAI_CONFIG.translationEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a translator. Translate the following text to English.'
                    },
                    {
                        role: 'user',
                        content: text
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Translation failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;
    } catch (error) {
        console.error('Translation error:', error);
        throw new Error('Failed to translate text');
    }
}

// Resize webform container
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = height + 'px';
    }
}
