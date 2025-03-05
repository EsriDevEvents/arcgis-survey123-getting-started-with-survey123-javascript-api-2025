## Introduction

This example demonstrates how to conduct surveys on a map using the Survey123 JS API. The survey in this example is designed to collect information related to wildfires in California. Upon entering the application, users are required to complete a series of survey tasks for the specified locations.


## Using the Survey123 JS API

1. **Initialize Survey123 WebForm**: 
   Create a new Survey123 WebForm instance using the `initializeWebForm` function and configure the necessary parameters such as `itemId` and `clientId`.

2. **Initialize the map and to-do list**: 
   Display the list of locations that need to be surveyed.

3. **Interactive Linking**: 
   When a user selects an item from the list, the corresponding location will be highlighted and centered on the map. The `setQuestionValue` method will be used to update the survey question with the details of that location.

4. **Handle form submissions**: 
   After a user submits a location, the system will update the map and the to-do list in the `onFormSubmitted` event to reflect the completed entries and refresh the survey form, allowing the user to continue submitting additional data.
