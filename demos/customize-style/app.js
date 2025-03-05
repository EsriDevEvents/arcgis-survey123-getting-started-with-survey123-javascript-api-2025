// Survey configuration
const SURVEY_CONFIG = {
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    clientId: 'vy3vxiEn4OmoBqQW',
    portalUrl: 'https://www.arcgis.com'
};

// Initialize Survey123 WebForm
const webform = new Survey123WebForm({
    container: 'surveyContainer',
    itemId: SURVEY_CONFIG.itemId,
    clientId: SURVEY_CONFIG.clientId,
    portalUrl: SURVEY_CONFIG.portalUrl,
    hideElements: ['navbar'],
    onFormLoaded: handleFormLoaded,
    onFormResized: (data) => {
        console.log('Form resized', data);
        resizeWebform(data.contentHeight);
    }
});


// Get background color based on satisfaction value
const colors = {
    Minor: '#4CAF50', // Green
    Moderate: '#8BC34A', // Light Green
    Serious: '#FFC107', // Amber/Yellow
    Severe: '#FF9800', // Orange
    Catastrophic: '#F44336', // Red
    default: '#31872e' // Default color
};

// Event listener for question value changes
webform.on("questionValueChanged", handleQuestionValueChange);

// Handle question value change event
async function handleQuestionValueChange(event) {
    if (event.field === 'severity_of_the_wildfire') {
        const satisfactionValue = await getSatisfactionValue();
        updateWebformTheme(satisfactionValue);
    }
}

// Retrieve the current satisfaction value
async function getSatisfactionValue() {
    const values = await webform.getQuestionValue();
    return values['severity_of_the_wildfire'];
}

// Update the webform theme based on satisfaction value
function updateWebformTheme(satisfactionValue) {
    const backgroundColor = getBackgroundColor(satisfactionValue);
    webform.setTheme({
        webpage: {
            backgroundColor: backgroundColor
        }
    });
}

function getBackgroundColor(satisfactionValue) {
    return colors[satisfactionValue];
}

// Handle form loaded event
function handleFormLoaded(data) {
    console.log('Form loaded:', data);
    resizeWebform(data.contentHeight);
    changeFormStyle();
}

// Resize webform container
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = `${height}px`;
    }
}

// Change form style based on satisfaction levels
function changeFormStyle() {
    const styles = createStyleObject(colors);
    webform.setStyle(styles);
}

// Create style object for webform
function createStyleObject(colors) {
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