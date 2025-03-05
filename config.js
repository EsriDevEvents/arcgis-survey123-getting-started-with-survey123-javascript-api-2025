// API Keys and configuration
export const CONFIG = {
    // OpenAI Configuration
    openai: {
        apiKey:'{{your openai api key}}',
        endpoints: {
            audio: 'https://api.openai.com/v1/audio/transcriptions',
            chat: 'https://api.openai.com/v1/chat/completions',
            vision: 'https://api.openai.com/v1/chat/completions'
        }
    },

    // Survey123 Configuration
    survey123: {
        clientId: '{{your-client-id}}'
    }

}; 