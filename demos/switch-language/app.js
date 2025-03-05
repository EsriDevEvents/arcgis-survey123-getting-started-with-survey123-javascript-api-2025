// Survey configuration
const SURVEY_CONFIG = {
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    clientId: 'vy3vxiEn4OmoBqQW',
    portalUrl: 'https://www.arcgis.com'
};

// Language options
const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh-cn', name: '简体中文' }
];

// Initialize Survey123 WebForm
const webform = new Survey123WebForm({
    container: 'surveyContainer',
    itemId: SURVEY_CONFIG.itemId,
    clientId: SURVEY_CONFIG.clientId,
    portalUrl: SURVEY_CONFIG.portalUrl,
    onFormLoaded: handleFormLoaded,
    onFormResized: (data) => {
        console.log('Form resized', data);
        resizeWebform(data.contentHeight);
    }
});

// Handle form loaded event
function handleFormLoaded(data) {
    console.log('Form loaded:', data);
    createLanguageSelector();
    resizeWebform(data.contentHeight);
}

// Create language selector
function createLanguageSelector() {
    const selector = document.createElement('select');
    selector.id = 'languageSelector';
    selector.className = 'language-selector';

    LANGUAGES.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        selector.appendChild(option);
    });

    selector.addEventListener('change', (e) => {
        webform.setLanguage(e.target.value);
    });

    document.querySelector('.controls').appendChild(selector);
}

// Resize webform container
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = `${height}px`;
    }
} 