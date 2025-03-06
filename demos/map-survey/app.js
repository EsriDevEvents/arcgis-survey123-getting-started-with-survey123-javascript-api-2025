// Import ArcGIS modules
import Map from "https://js.arcgis.com/4.28/@arcgis/core/Map.js";
import MapView from "https://js.arcgis.com/4.28/@arcgis/core/views/MapView.js";
import GraphicsLayer from "https://js.arcgis.com/4.28/@arcgis/core/layers/GraphicsLayer.js";
import Graphic from "https://js.arcgis.com/4.28/@arcgis/core/Graphic.js";
import { CONFIG } from '../../config.js';

// Survey configuration
const SURVEY_CONFIG = {
    itemId: "d4d1f2b6738d4a739d7d82c0fe077e53",
    clientId: CONFIG.survey123.clientId,
    portalUrl: 'https://www.arcgis.com'
};

const highlightColor = 'rgba(255, 193, 7, 1)';

const SYMBOLS = {
    defaultSymbol: createSymbol([255, 0, 0]),  // Red color
    highlightSymbol: createSymbol(highlightColor),  // Yellow color
    checkedSymbol: createSymbol([0, 255, 0])  // Green color
};

const landmarks = [
    { "name": "Palisades", "latitude": 34.05, "longitude": -118.53 },
    { "name": "Kenneth", "latitude": 34.29, "longitude": -118.70 },
    { "name": "Hughes", "latitude": 34.50, "longitude": -118.62 },
    { "name": "Hearst", "latitude": 34.20, "longitude": -118.60 },
    { "name": "Sunset", "latitude": 34.09, "longitude": -118.41 },
    { "name": "Altadena", "latitude": 34.19, "longitude": -118.13 },
    { "name": "Hollywood Hills", "latitude": 34.12, "longitude": -118.32 }
];

// Initialize map and view
const graphicsLayer = new GraphicsLayer();
const mapView = initializeMap();

// Initialize Survey123 WebForm
let webform = initializeWebForm();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the To-Do List and handle click event
    initializeTodoList(landmarks);

    // Handle map click events
    mapView.on("click", (event) => {
        mapView.hitTest(event).then((response) => {
            if (response.results.length) {
                handleMapClick(response.results[0].graphic);
            }
        });
    });
});


// Function to add landmarks to the To-Do List and bind click event
function initializeTodoList(landmarks) {
    const todoList = document.getElementById('todoList');
    landmarks.forEach(landmark => {
        const listItem = document.createElement('li');
        listItem.textContent = landmark.name;
        listItem.addEventListener('click', () => {
            highlightTodoItem(listItem, true);
        });
        todoList.appendChild(listItem);
    });
}


function initializeMap() {
    const map = new Map({
        basemap: "streets-vector"
    });
    const view = new MapView({
        container: "mapContainer",
        map: map,
        zoom: 8,
        center: [-118.38907253265381, 34.27594653015247]
    });
    map.add(graphicsLayer);

    addLandmarksToMap(landmarks, graphicsLayer);

    return view;
}

// Adds landmarks to the map using the provided graphics layer.
function addLandmarksToMap(landmarks, graphicsLayer) {
    landmarks.forEach((landmark) => {
        const point = {
            type: "point",
            longitude: landmark.longitude,
            latitude: landmark.latitude
        };

        const pointGraphic = new Graphic({
            geometry: point,
            symbol: SYMBOLS.defaultSymbol,
            attributes: { name: landmark.name }
        });

        graphicsLayer.add(pointGraphic);
    });

}

// Highlights the selected To-Do item and triggers a map click if specified.
function highlightTodoItem(item, trigerMapClick) {
    resetTodoListStyle();
    item.classList.add('highlighted'); // Add highlighted class
    if (trigerMapClick) {
        let graphic = null;
        graphicsLayer.graphics.forEach((g) => {
            if (g.attributes['name'] === item.textContent) {
                graphic = g;
            }
        });
        if (graphic) {
            handleMapClick(graphic, true);
            mapView.goTo(graphic.geometry);
        }
    }
}

// Handles the map click event and updates the survey form accordingly.
function handleMapClick(feature, fromTodoList) {
    resetGraphicsStyle();
    if (feature.symbol?.color.toString() != 'rgba(0, 255, 0, 1)') {
        feature.symbol = SYMBOLS.highlightSymbol;
    }

    const newValue = {
        location_name: feature.attributes['name']
    };
    webform.setQuestionValue(newValue);
    webform.setGeometry(feature.geometry);
    if (!fromTodoList) {
        let item = null;
        document.querySelectorAll("#todoList > li").forEach((li) => {
            if (li.textContent == feature.attributes['name']) {
                item = li;
            }
        })
        highlightTodoItem(item);
    }
}

// Resets the styles of all graphics on the map.
function resetGraphicsStyle() {
    graphicsLayer.graphics.forEach(g => {
        if (g.symbol.color.toString() == highlightColor && g.symbol.color.toString() != 'rgba(0, 255, 0, 1)') {
            g.symbol = SYMBOLS.defaultSymbol;
        }
    });
}

// Resets the styles of the To-Do list items.
function resetTodoListStyle() {
    document.querySelectorAll("#todoList > li").forEach((li) => {
        li.classList.remove('highlighted');
    });
}

// Handles the form submission and updates the graphics and To-Do list accordingly.
function handleFormSubmit(event) {
    const landmarkName = event.surveyFeatureSet.features[0].attributes['location_name'];
    graphicsLayer.graphics.forEach((item) => {
        if (item.attributes['name'] == landmarkName) {
            item.symbol = SYMBOLS.checkedSymbol;
        }
    });

    resetTodoListStyle();
    const todoListItems = document.querySelectorAll('#todoList li');
    todoListItems.forEach((listItem) => {
        if (listItem.textContent === landmarkName) {
            listItem.classList.add('checked'); // Add checked class
        }
    });

    document.getElementById('surveyContainer').innerHTML = '';
    webform = initializeWebForm();
}

// Resizes the webform container height after the form is loaded or resized.
function resizeWebform(height) {
    const webformIframe = document.querySelector('#surveyContainer>iframe');
    if (webformIframe && height > 0) {
        webformIframe.style.height = height + 'px';
    }
}

// Creates a symbol with the specified color for map graphics.
function createSymbol(color) {
    return {
        type: "simple-marker",
        color: color,
        size: "14px",
        outline: {
            color: [255, 255, 255],
            width: 2
        },
        shadowColor: [0, 0, 0, 0.4],
        shadowBlur: 3,
        shadowOffsetX: 2,
        shadowOffsetY: 2
    };
}

function initializeWebForm(){
    return new Survey123WebForm({
        container: 'surveyContainer',
        itemId: SURVEY_CONFIG.itemId,
        clientId: SURVEY_CONFIG.clientId,
        portalUrl: SURVEY_CONFIG.portalUrl,
        hideElements: ['navbar', 'description'],
        token: SURVEY_CONFIG.token,
        version: 'latest',
        onFormSubmitted: handleFormSubmit,
        onFormResized: (data) => {
            console.log('Form resized', data);
            resizeWebform(data.contentHeight);
        }
    });

}