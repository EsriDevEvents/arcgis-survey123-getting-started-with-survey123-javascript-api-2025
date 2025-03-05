import { defineCustomElements } from './report-component/loader/index.js';

// Initialize custom elements
defineCustomElements(window, {
    resourcesUrl: './report-component/dist/'
});

// Survey configuration constants
const SURVEY_CONFIG = {
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    templateItemId:'7168f7ab886a40afa1f2a7846bbc3b60',
    clientId: 'vy3vxiEn4OmoBqQW',
    portalUrl: 'https://www.arcgis.com',
    featureLayerUrl: 'https://services1.arcgis.com/oC086ufSSQ6Avnw2/arcgis/rest/services/survey123_d4d1f2b6738d4a739d7d82c0fe077e53_results/FeatureServer/0',
    token: '3NKHt6i2urmWtqOuugvr9Sc6sAUdgyqMUNfIsWNc1D20fSCKBMYvLSBo3KglJFvmERYj5fYWk29AA4JraEG0T4eTiMllmUXe_mxQlwlxSf0qn6UWcea3v96NMCAcpY8uVZPXvRH708xoQmSKTVe3-ImwYmZRS9v4_2PQe8xAJonFL0gO5loxWeoMKEbyKba0m0pHicaefy7q_BnzwkyCLmQT0WLujdi8P9jvbR1Qk7E.'
}
// Create feature report component
function createReportComponent(objectid) {
    const node = document.createElement('feature-report');
    const attributes = getReportAttributes(objectid);
    
    Object.entries(attributes).forEach(([key, value]) => {
        node.setAttribute(key, value);
    });

    return node;
}

// Get report attributes
function getReportAttributes(objectid) {
    return {
        'token': SURVEY_CONFIG.token,
        'client-id': 'vy3vxiEn4OmoBqQW',
        'portal-url': SURVEY_CONFIG.portalUrl,
        'feature-layer-url': SURVEY_CONFIG.featureLayerUrl,
        'survey-item-id': SURVEY_CONFIG.itemId,
        'template-item-id': SURVEY_CONFIG.templateItemId,
        'query-parameters': `{"objectIds":"${objectid}","orderByFields":"||EditDate DESC, objectid ASC"}`,
        'output-format': 'docx',
        'hide': 'inputFeatures,selectTemplate,fileOptions,reportName,saveToAGSAccount,outputFormat,showCredits,recentReports,navbar',
        'label': '{"generateReport":"Generate Your Exclusive Certificate Now!"}'
    };
}

// Resize webform container
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = `${height}px`;
    }
}

// Handle form submission
function handleFormSubmit(event) {
    const objectid = event.surveyFeatureSet.features[0].attributes.objectid;
    toggleSurveyVisibility(objectid);
}

// Toggle survey visibility and display report
function toggleSurveyVisibility(objectid) {
    const surveyContainer = document.getElementById('surveyContainer');
    const customThankYouContainer = document.getElementById('customThankYouContainer');

    surveyContainer.style.display = 'none';
    customThankYouContainer.appendChild(createReportComponent(objectid));
    customThankYouContainer.style.display = 'block';

    applyCustomStyles();
}

// Apply custom styles to the report
function applyCustomStyles() {
    const checkAndApplyStyle = () => {
        const reportGeneratorDiv = document.querySelector("#customThankYouContainer > feature-report")?.shadowRoot?.querySelector("calcite-panel > div > report-generator")?.shadowRoot?.querySelector("#submit-btn")?.shadowRoot?.querySelector("div > button");
        const calcitePanelDiv = document.querySelector("#customThankYouContainer > feature-report")?.shadowRoot?.querySelector("calcite-panel > div");
        
        if (reportGeneratorDiv && calcitePanelDiv) {
            reportGeneratorDiv.style.background = '#31872e';
            calcitePanelDiv.style.cssText = 'background: white; display: flex; justify-content: center;';
        } else {
            setTimeout(checkAndApplyStyle, 100);
        }
    };
    checkAndApplyStyle();
}

// Initialize Survey123 WebForm
new Survey123WebForm({
    container: 'surveyContainer',
    itemId: SURVEY_CONFIG.itemId,
    clientId: SURVEY_CONFIG.clientId,
    version: 'latest',
    width: 1,
    autoRefresh: -1,
    portalUrl: SURVEY_CONFIG.portalUrl,
    hideElements: ['navbar', 'description'],
    onFormLoaded: (data) => {
        console.log('Form loaded:', data);
        resizeWebform(data.contentHeight + 38.5);
    },
    onFormSubmitted: handleFormSubmit,
    onFormResized: (data) => {
        console.log('Form resized', data);
        resizeWebform(data.contentHeight);
    }
});
