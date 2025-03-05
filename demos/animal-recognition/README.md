## Introduction

This demo showcases how to use the Survey123 JS API for image processing and animal recognition. Users can upload images, and the system will automatically identify the animals in the images and generate corresponding descriptions.

## Using the Survey123 JS API

1. **Initialize Survey123 WebForm**: 
    Create a new Survey123 WebForm instance using the `initializeWebForm` function and configure necessary parameters such as `itemId` and `clientId`.

2. **Listen for Question Changes**: 
    Use `webform.on("questionValueChanged", ...)` to listen for changes in the value of specific questions. When a user uploads an image, the `processAnimalRecognition` function is called, and animal recognition is performed via the OpenAI API.

3. **Update Subsequent Questions**: 
    The identified results are assigned to subsequent questions using the `setQuestionValue` and `addRepeat` methods, including animal types and image descriptions.
