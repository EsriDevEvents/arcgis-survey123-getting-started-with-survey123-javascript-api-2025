## Introduction

This demo showcases how to use the Survey123 JS API to generate survey reports. After users submit the form, a customized report will be generated.

## Using the Survey123 JS API

To use the Survey123 JS API, you need to include the relevant JavaScript libraries in your HTML file. The example includes the following steps:

1. **Initialize Survey123 WebForm**: 
    Create a new Survey123 WebForm instance using the `initializeWebForm` function and configure necessary parameters such as `itemId` and `clientId`.

2. **Handle the form submission event**: 
    Implement the `onFormSubmitted` function to create a report web component using `document.createElement('feature-report')` and append it to the webpage once the submission process is complete.

3. **Utilize the report web component**: 
    Include the `calcite-components` style in your HTML file. 
    Additionally, import the custom elements loader:
    `import { defineCustomElements } from './report-component/loader/index.js';`
    Specify the resourcesUrl for the report web component:
    ```javascript
       defineCustomElements(window, {
        resourcesUrl: './report-component/dist/'
    })
    ```
    In the future, we will integrate this into the Maps SDK, allowing it to be referenced from there.