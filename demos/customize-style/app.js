import { CONFIG } from '../../config.js';

// Survey configuration
const SURVEY_CONFIG = {
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    clientId: CONFIG.survey123.clientId,
    portalUrl: 'https://www.arcgis.com'
};

// color based on severity value
const colors = {
    Minor: '#4CAF50', // Green
    Moderate: '#8BC34A', // Light Green
    Serious: '#FFC107', // Amber/Yellow
    Severe: '#FF9800', // Orange
    Catastrophic: '#F44336', // Red
    default: '#31872e' // Default color
};

// Initialize Survey123 WebForm
const webform = new Survey123WebForm({
    container: 'surveyContainer',
    itemId: SURVEY_CONFIG.itemId,
    clientId: SURVEY_CONFIG.clientId,
    portalUrl: SURVEY_CONFIG.portalUrl,
    hideElements: ['navbar'],
    questionValue: {
        your_name: "Alex"
    },
    onFormLoaded: changeLikertStyle,
    onFormResized: (data) => {
        resizeWebform(data.contentHeight);
    }
});

// Change likert question style on form loaded
function changeLikertStyle() {
    const styles = createStyleObject();
    webform.setStyle(styles);
}

// Event listener for question value changes
webform.on("questionValueChanged", async (event) => {
    if (event.field === 'severity_of_the_wildfire') {
        const values = await webform.getQuestionValue();
        const severityValue = values['severity_of_the_wildfire'];

        // Update the webform theme based on severity value
        const backgroundColor = colors[severityValue];
        webform.setTheme({
            webpage: {
                backgroundColor: backgroundColor
            }
        });
    }
})

// Resize webform container
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = `${height}px`;
    }
}

// Create style object for webform
function createStyleObject() {
    const styles = {};
    for (const [index, [key, value]] of Object.entries(colors).entries()) {
        styles[`& .or-appearance-likert > fieldset > div.option-wrapper > label:nth-child(${index + 1}) > i.webform-svg-icon.background > svg > g > path`] = {
            fill: value
        };
        styles[`&  .or-appearance-likert > fieldset > div.option-wrapper > label:nth-child(${index + 1}) > i.webform-svg-icon.check > svg > circle`] = {
            fill: value
        };
    }
    return styles;
}