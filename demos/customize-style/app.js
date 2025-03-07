import { CONFIG } from '../../config.js';

// Survey configuration
const SURVEY_CONFIG = {
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    clientId: CONFIG.survey123.clientId,
    portalUrl: 'https://www.arcgis.com'
};

// color based on severity value
const primaryColors = {
    Minor: '#31872E', // Green
    Moderate: '#56702E', // Light Green
    Serious: '#B16E23', // Amber/Yellow
    Severe: '#E4A810', // Orange
    Catastrophic: '#C5292C', // Red
    default: '#31872e' // Default color
};

// color based on severity value
const textColors = {
    Minor: '#353535',
    Moderate: '#1A3837',
    Serious: '#7B582D',
    Severe: '#333081',
    Catastrophic: '#6B2D2E',
    default: '#31872e'
};

const backgroundImages = {
    Minor: 'https://localhost:3000/demos/customize-style/images/1.jpeg',
    Moderate: 'https://localhost:3000/demos/customize-style/images/2.jpeg',
    Serious: 'https://localhost:3000/demos/customize-style/images/3.jpeg',
    Severe: 'https://localhost:3000/demos/customize-style/images/4.jpeg',
    Catastrophic: 'https://localhost:3000/demos/customize-style/images/5.jpeg'
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
    onFormLoaded: changeLikertStyle
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
        webform.setTheme({
            form: {
                primaryColor: primaryColors[severityValue],
                textColor: textColors[severityValue],
                backgroundOpacity: 0.9
            },
            webpage: {
                backgroundImage: backgroundImages[severityValue]
            },
            header: {
                backgroundColor: primaryColors[severityValue]
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
    for (const [index, [key, value]] of Object.entries(primaryColors).entries()) {
        styles[`& .or-appearance-likert > fieldset > div.option-wrapper > label:nth-child(${index + 1}) > i.webform-svg-icon.background > svg > g > path`] = {
            fill: value
        };
        styles[`&  .or-appearance-likert > fieldset > div.option-wrapper > label:nth-child(${index + 1}) > i.webform-svg-icon.check > svg > circle`] = {
            fill: value
        };
    }
    return styles;
}