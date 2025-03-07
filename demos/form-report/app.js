// import { defineCustomElements } from './report-component/loader/index.js';
import { defineCustomElements } from 'https://cdn.jsdelivr.net/gh/EsriDevEvents/arcgis-survey123-getting-started-with-survey123-javascript-api-2025@main/demos/form-report/report-component/loader/index.js';

import { CONFIG } from '../../config.js';

// Specify the resourcesUrl for the report web component
defineCustomElements(window, {
    // resourcesUrl: './report-component/dist/' 
    resourcesUrl: 'https://cdn.jsdelivr.net/gh/EsriDevEvents/arcgis-survey123-getting-started-with-survey123-javascript-api-2025@main/demos/form-report/report-component/dist/'
});

// Survey configuration constants
const SURVEY_CONFIG = {
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    templateItemId: '7168f7ab886a40afa1f2a7846bbc3b60',
    clientId: CONFIG.survey123.clientId,
    portalUrl: 'https://www.arcgis.com',
    featureLayerUrl: 'https://services1.arcgis.com/oC086ufSSQ6Avnw2/arcgis/rest/services/survey123_d4d1f2b6738d4a739d7d82c0fe077e53_results/FeatureServer/0',
    token: '{{your-token}}'
}


// Initialize Survey123 WebForm
const webform=new Survey123WebForm({
    container: 'surveyContainer',
    itemId: SURVEY_CONFIG.itemId,
    clientId: SURVEY_CONFIG.clientId,
    version: 'latest',
    width: 1,
    autoRefresh: -1,
    portalUrl: SURVEY_CONFIG.portalUrl,
    hideElements: ['navbar', 'description'],
    questionValue: {
        your_name: "Carlos",
        severity_of_the_wildfire: "Serious",
        location_name: "Sonoma",
        wildfire_description_text: "La zona de investigación se encuentra en el condado de Sonoma, California del Norte. El incendio forestal ha arrasado más de 5,000 acres de bosque y destruido alrededor de 200 edificios, causando grandes pérdidas. El 80% de los residentes fueron evacuados. La calidad del aire es extremadamente mala, algunas carreteras están cerradas y los esfuerzos de rescate continúan. La comunidad afectada necesita urgentemente ayuda y reconstrucción.",
        wildfire_description_text_en: "The research area is located in Sonoma County, Northern California. The wildfire has scorched over 5,000 acres of forest and destroyed around 200 buildings, causing significant losses. 80% of the residents have been evacuated. The air quality is extremely poor, some roads are closed, and rescue efforts are ongoing. The affected community urgently needs assistance and rebuilding.", "globalid": "{EF5257DA-3DB9-4FF0-8EFC-A1F8C4D7FBAF}"
    },
    onFormLoaded: (() => {
        webform.setGeometry({
            x: -122.8,
            y: 38.5,
            sptialReference: { wkid: 4326 }
        })
    }),
    onFormSubmitted: ((event) => {
        const objectid = event.surveyFeatureSet.features[0].attributes.objectid;
        showReportPage(objectid);
    }),
    onFormResized: (data) => {
        resizeWebform(data.contentHeight);
    }
});

// Hide the survey form and display the report page
function showReportPage(objectid) {
    // Hide the survey container
    const surveyContainer = document.getElementById('surveyContainer');
    surveyContainer.style.display = 'none';

    // Create the report component and append it to the Thank You screen container
    const customThankYouContainer = document.getElementById('customThankYouContainer');
    const reportComponent = createReportComponent(objectid);
    customThankYouContainer.appendChild(reportComponent);
    customThankYouContainer.style.display = 'block';

    // Update the styles for the report component
    applyReportCustomStyles();
}

// Create feature report component
function createReportComponent(objectid) {
    const node = document.createElement('feature-report');
    const attributes = {
        'token': SURVEY_CONFIG.token,
        'client-id': SURVEY_CONFIG.clientId,
        'portal-url': SURVEY_CONFIG.portalUrl,
        'feature-layer-url': SURVEY_CONFIG.featureLayerUrl,
        'survey-item-id': SURVEY_CONFIG.itemId,
        'template-item-id': SURVEY_CONFIG.templateItemId,
        'query-parameters': `{"objectIds":"${objectid}","orderByFields":"||EditDate DESC, objectid ASC"}`,
        'output-format': 'docx',
        'hide': 'inputFeatures,selectTemplate,fileOptions,reportName,saveToAGSAccount,outputFormat,showCredits,recentReports,navbar',
        'label': '{"generateReport":"Generate Your Exclusive Certificate Now!"}'
    };

    Object.entries(attributes).forEach(([key, value]) => {
        node.setAttribute(key, value);
    });

    return node;
}

// Apply custom styles to the report
function applyReportCustomStyles() {
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

// Resize webform container
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = `${height}px`;
    }
}




