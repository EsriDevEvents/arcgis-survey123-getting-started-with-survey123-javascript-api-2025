import { CONFIG } from '../../config.js';

// Survey configuration
const SURVEY_CONFIG = {
    itemId: "2161196d4b30498abc75f7591a188e18",
    portalUrl: 'https://www.arcgis.com',
    clientId: CONFIG.survey123.clientId,
};

// Initialize Survey123 WebForm
const webform = initializeWebForm();

// Function to initialize Survey123 WebForm
function initializeWebForm() {
    return new Survey123WebForm({
        container: 'surveyContainer',
        itemId: SURVEY_CONFIG.itemId,
        clientId: SURVEY_CONFIG.clientId,
        version: 'latest',
        portalUrl: SURVEY_CONFIG.portalUrl,
        hideElements: ['navbar', 'description'],
        onFormResized: (data) => {
            resizeWebform(data.contentHeight);
        }
    });
}

// Listen for changes to the 'trigger_field_name' question
webform.on("questionValueChanged", async function (event) {
    if (event.field === 'user_input_image' && event.trigger == 'user' && event.value) {
        await processAnimalRecognition();
    }
});

// Process animal recognition
async function processAnimalRecognition() {
    const values = await webform.getQuestionValue();
    const inputFile = values['user_input_image'];
    const [results, files] = await identifyAnimal(inputFile && inputFile[0]?.file);
    await changeQuestionValue(files, results);
}

// Animal recognition function using Landing AI API
async function identifyAnimal(file) {

    try {
        const response = await sendRequestToOpenAI(file);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        let results = JSON.parse(data.choices[0].message.content);
        if (results.properties) {
            results = results.properties;
        }
        const files = await processAnimalResults(results, file);
        return [results, files];
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Change question value with extracted images and results
async function changeQuestionValue(images, results) {
    const questionValue = await webform.getQuestionValue();
    questionValue['image_desc'] = results['image_description'];
    questionValue['extracted_animals_text'] = JSON.stringify(results);

    await webform.addRepeat({
        questionName: "extracted_animals",
        count: images.length - questionValue['extracted_animals']?.length || 0
    });

    const extracted_animals = results?.animals?.map((animal, index) => {
        return {
            animal_image: [images[index]],
            animal_type: animal?.species,
            animal_desc: animal?.animal_description,
            animal_score: animal?.score * 100
        }
    })
    questionValue['extracted_animals'] = extracted_animals;
    webform.setQuestionValue(questionValue);

}

// Fetch animal data from the API
async function sendRequestToOpenAI(file) {

    const url = CONFIG.openai.endpoints.vision;

    const messages = await createMessages(file);
    
    const response_format = {
        "type": "json_schema",
        "json_schema": {
            "name": "Animal_Recognition_extraction",
            "schema": {
                "type": "object",
                "properties": {
                    "image_description": {
                        "type": "string"
                    },
                    "animals": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "bbox": {
                                    "type": "array",
                                    "items": {
                                        "type": "number"
                                    },
                                    "minItems": 4,
                                    "maxItems": 4
                                },
                                "species": {
                                    "type": "string"
                                },
                                "animal_description": {
                                    "type": "string"
                                },
                                "score": {
                                    "type": "number"
                                }
                            },
                            "required": ["bbox", "species"]
                        }
                    }
                },
                "required": ["animals"]
            }
        }
    };

    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + CONFIG.openai.apiKey
        },
        body: JSON.stringify({
            model: 'gpt-4o',
            response_format: response_format,
            messages: messages,
            max_tokens: 3000
        })
    });
}


// Create messages for the API request
async function createMessages(file) {
    const base64String = await fileToBase64(file);
    return [{
        role: "user",
        content: [
            {
                type: "image_url",
                image_url: {
                    "url": `data:image/${file.type};base64,${base64String}`
                }
            },
            {
                type: "text",
                text: `1. Generate a description of the image with the key '''image_description'''.
                2. Detect all animals in the image and return a JSON object for each animal containing the species and the bounding box (bbox). The bbox should tightly enclose the smallest complete area of the animal. The bbox format should be (x_min, y_min, x_max, y_max), where (x_min, y_min) represents the top-left corner and (x_max, y_max) represents the bottom-right corner.`
            }
        ]
    }];
}

// Process the results from the animal recognition
async function processAnimalResults(results, file) {
    return await Promise.all(results?.animals?.map(async (animal) => {
        const animalName = animal.species;
        const bbox = animal.bbox;
        const croppedImage = await cropImage(file, bbox, animalName);
        return {
            name: croppedImage.name,
            file: croppedImage
        };
    }));
}

// Resize webform container height after form loaded or resized  
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = height + 'px';
    }
}

// Convert file to base64
const fileToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64String = reader.result
                .replace('data:', '')
                .replace(/^.+,/, '');
            resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}
// Crop image based on bounding box
const cropImage = async (file, bbox, animalName) => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = async () => {
            canvas.width = bbox[2] - bbox[0]; // width
            canvas.height = bbox[3] - bbox[1]; // height
            ctx.drawImage(img, bbox[0], bbox[1], bbox[2] - bbox[0], bbox[3] - bbox[1], 0, 0, bbox[2] - bbox[0], bbox[3] - bbox[1]);
            ctx.font = '24px Arial';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(animalName, canvas.width / 2, canvas.height / 2);
            const croppedImageBinary = canvas.toDataURL();
            const croppedImageBlob = await fetch(croppedImageBinary).then(res => res.blob());
            const croppedImageFile = new File([croppedImageBlob], `${animalName}.png`, { type: 'image/png' });
            resolve(croppedImageFile);
        };
        img.onerror = (error) => reject(error);
        img.src = URL.createObjectURL(file);
    });
}