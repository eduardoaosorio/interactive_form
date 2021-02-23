# interactive_form

Techdegree project 3

## Description

Small project to showcase form validations with plain JavaScript.

### About real-time validation user feedback

This form shows real-time validation on fields marked as required. Feedback is triggered by the ['change' event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event). 

When validation is successful user feedback is displayed in the form of green checkmark.

When validation fails user feedback is displayed in the form of red borders, a red '!' icon, and a conditional validation fail message.

### About conditional validation fail messages

If validation fails because a required field is left blank a 'Field cannot be blank' message will appear. Otherwise a custom message with more detailed information regarding the expected input will appear.
 
