## Introduction

This demo showcases how to use the Survey123 JS API to support multilingual information submission.

## Using the Survey123 JS API

1. **Initialize Survey123 WebForm**: 
    Create a new Survey123 WebForm instance using the `initializeWebForm` function and configure necessary parameters such as `itemId` and `clientId`.

2. **Audio Processing**:
    Use `webform.on("questionValueChanged", ...)` to listen for changes in the value of specific questions. When a user uploads an audio file, the system will call the `processAudio` function for audio transcription and translation. This function utilizes the OpenAI API for audio transcription and translates the transcription results into English.

3. **Update Subsequent Questions**:
    The identified results will be assigned to subsequent questions using the `setQuestionValue` method.
