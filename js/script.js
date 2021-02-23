// ALL VARIABLE DECLARATIONS

// Form element
const form = document.querySelector('form');

// Basic info fieldset input elements
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const otherJobRoleInput = document.querySelector('#other-job-role');

// Basic info fieldset select element
const jobRoleSelect = document.querySelector('#title');

// T-shirt info fieldset select elements
const designSelect = document.querySelector('#design');
const colorSelect = document.querySelector('#color');

// Activities fielset
const activitiesFieldset = document.querySelector('#activities');

// Activities fielset nested elements
const activitiesCostParagraph = document.querySelector('#activities-cost');
let totalCost = 0;
const activitiesCheckboxes = document.querySelectorAll('input[type="checkbox"]');

// Payment info fieldset payment options select element
const paymentOptionSelect = document.querySelector('#payment');

// Payment info fieldset div elements
const creditCardDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');

// Credit card div input elements
const creditCardNumInput = document.querySelector('#cc-num');
const zipCodeInput = document.querySelector('#zip');
const cvvInput = document.querySelector('#cvv');


// REGEX USED FOR TEXT INPUT VALIDATION

const nameRegex = /^[a-z]+ ?[a-z]* ?[a-z]*$/i;
const emailRegex = /^[^@]+@[^@.]+\.[a-z]+$/i;
const creditCardNumRegex = /^\d{13,16}$/;
const cvvRegex = /^\d{3}$/;
const zipCodeRegex = /^\d{5}$/;


// VALIDATION RELATED FUNCTIONS

/**
 * Validates the value property of a supplied textInputElement with a supplied regular expression
 *
 * @param {object} textInputElement - HTMLElement, must be of input type="text"
 * @param {object} regex - Regular expression to perform validation
 * @return {boolean} The result of the validation, true if it passes, false if it fails
 */
function validateTextInput(textInputElement, regex) {
    const isValid = regex.test(textInputElement.value);
    if (isValid) validationPass(textInputElement);
    else validationFail(textInputElement);
    return isValid;
}

/**
 *  Converts the value property of a supplied textInputElement to number type and then validates with a supplied regular expression
 *
 * @param {object} textInputElement - HTMLElement, must be of input type="text"
 * @param {object} regex - Regular expression to perform validation
 * @return {boolean} The result of the validation, true if it passes, false if it fails
 */
function validateTextInputAsNumber(textInputElement, regex) {
    const isValid = regex.test(+textInputElement.value);
    if (isValid) validationPass(textInputElement);
    else validationFail(textInputElement);
    return isValid;
}

/**
 *  Validates that at least 1 of the activities checkboxes is checked
 * @return {boolean} The result of the validation, true if it passes, false if it fails
 */
function validateActivities() {
    const validActivities = totalCost > 0;
    if (validActivities) validationPass(activitiesFieldset.children[1]);
    else validationFail(activitiesFieldset.children[1]);
    return validActivities;
}

/**
 *  Displays user feedback when validation passes, feedback is displayed in the form of green checkmark icon
 *
 * @param {object} element - HTMLElement
 */
function validationPass(element) {
    element.parentElement.classList.add('valid');
    element.parentElement.classList.remove('not-valid');
    element.parentElement.lastElementChild.style.display = 'none';
}
 
/**
 *  Displays user feedback when validation fails, feedback is displayed in the form of red borders, a red '!' icon, and a conditional validation fail message.
 *
 * @param {object} element - HTMLElement
 */
function validationFail(element) {
    element.parentElement.classList.add('not-valid');
    element.parentElement.classList.remove('valid');
    element.parentElement.lastElementChild.style.display = 'inherit';

    /* In this form, each type="text" input has as parentElement a label, but all type="checkbox" inputs have as parentElement
     a fieldset. With the conditional below, we only run code for inputs of type="text", excluding type="checkbox"*/

    if (element.parentElement.tagName === 'LABEL') {
        const hintElement = element.parentElement.lastElementChild;
        if (element.value !== '') {
            const regex = /([A-Za-z]+ ?[A-Za-z]*)(\W)/;
            const key = element.parentElement.childNodes[0].textContent.replace(regex, '$1').trim();
            const validationMsgObject = validationMsgObjects.find((obj) => obj[key] !== undefined);
            hintElement.textContent = validationMsgObject[key];
        } else {
            hintElement.textContent = 'Field cannot be blank';
        }
    }
}

// Array containing custom validation fail messages for for when input field is not '' (empty string)
const validationMsgObjects = [
    {'Name': 'Special characters and extra spaces not allowed - middlename is optional'},
    {'Email Address': 'Email address must be formatted correctly'},
    {'Card Number': 'Credit card number must be between 13 - 16 digits'},
    {'Zip Code': 'Zip Code must be 5 digits'},
    {'CVV': 'CVV must be 3 digits'}
];


// START OF DOM MANIPULATION

// Set focus onto the name input elemente when page first loads
nameInput.focus();

// Hide otherJobRoleInput when page loads
otherJobRoleInput.hidden = true;

// Event listener to hide/unhide otherJobRoleInput according to selected option's value
jobRoleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'other') otherJobRoleInput.hidden = false;
    else otherJobRoleInput.hidden = true;
});

// Disable color select when page loads
colorSelect.disabled = true;

// Enable colorSelect options to match designSelect option
designSelect.addEventListener('change', (e) => {
    colorSelect.disabled = false;
    const designOptionValue = e.target.value;
    for (let colorOption of colorSelect.children) {
        const optionTheme = colorOption.getAttribute('data-theme');
        if (designOptionValue === optionTheme) {
            colorOption.hidden = false;
            colorOption.selected = true;
        } else {
            colorOption.hidden = true;
            colorOption.selected = false;
        }
    }
});

// Update activitiesCostParagraph according to checked checkboxes and disable/enable checkboxes if schedule conflicts exist
activitiesFieldset.addEventListener('change', (e) => {
    const activityCost = +e.target.getAttribute('data-cost');
    const selectedActivitySchedule = e.target.nextElementSibling.nextElementSibling.textContent;
    if (e.target.checked) {
        totalCost += activityCost;
        activitiesCheckboxes.forEach((checkbox) => {
            const activitySchedule = checkbox.nextElementSibling.nextElementSibling.textContent;
            if(!checkbox.checked && activitySchedule === selectedActivitySchedule) {
                checkbox.disabled = true;
                checkbox.parentElement.classList.add('disabled');
            }
        });
    } else {
        totalCost -= activityCost;
        activitiesCheckboxes.forEach((checkbox) => {
            const activitySchedule = checkbox.nextElementSibling.nextElementSibling.textContent;
            if(!checkbox.checked && activitySchedule === selectedActivitySchedule) {
                checkbox.disabled = false;
                checkbox.parentElement.classList.remove('disabled');
            }
        });
    }
    activitiesCostParagraph.innerHTML = `Total: $${totalCost}`;
});

// Hide paypalDiv and bitcoinDiv when page loads
paypalDiv.hidden = true;
bitcoinDiv.hidden = true;

// Select credit-card as a default option when page loads
paymentOptionSelect.children[1].selected = true;

// Update show/hide payment option divs according to selected option
paymentOptionSelect.addEventListener('change', (e) => {
    if (e.target.value === 'credit-card') {
        creditCardDiv.hidden = false;
        paypalDiv.hidden = true;
        bitcoinDiv.hidden = true;
    } else if (e.target.value === 'paypal') {
        creditCardDiv.hidden = true;
        paypalDiv.hidden = false;
        bitcoinDiv.hidden = true;
    } else {
        creditCardDiv.hidden = true;
        paypalDiv.hidden = true;
        bitcoinDiv.hidden = false;
    }
});

// Event listener to perform validations on submit
form.addEventListener('submit', (e) => {
    e.preventDefault();

    validateTextInput(nameInput, nameRegex) ? console.log('valid name'): console.log('invalid name');
    validateTextInput(emailInput, emailRegex) ? console.log('valid email'): console.log('invalid email');
    validateActivities() ? console.log('ok activitis'): console.log('select at least 1 activity');
    
    // Validate credit card info only if cerdit card is the selected payment method
    if (paymentOptionSelect.children[1].selected) {
        validateTextInputAsNumber(creditCardNumInput, creditCardNumRegex) ? console.log('ok cardnum'): console.log('invalid cardnum');
        validateTextInputAsNumber(cvvInput, cvvRegex) ? console.log('ok CVV'): console.log('invalid CVV');
        validateTextInputAsNumber(zipCodeInput, zipCodeRegex) ? console.log('ok zip'): console.log('invalid zip');
    }
});

// Add focus and blur event listeners on all checkboxes
for (let checkbox of activitiesCheckboxes) {
    checkbox.addEventListener('focus', (e) => e.target.parentElement.classList.add('focus'));
    checkbox.addEventListener('blur', (e) => e.target.parentElement.classList.remove('focus'));
}

// Real-time validation on required input fields of type text
nameInput.addEventListener('change', () => validateTextInput(nameInput, nameRegex));
emailInput.addEventListener('change', () => validateTextInput(emailInput, emailRegex));
activitiesFieldset.addEventListener('change', validateActivities);
creditCardNumInput.addEventListener('change', () => validateTextInputAsNumber(creditCardNumInput, creditCardNumRegex));
zipCodeInput.addEventListener('change', () => validateTextInputAsNumber(zipCodeInput, zipCodeRegex));
cvvInput.addEventListener('change', () => validateTextInputAsNumber(cvvInput, cvvRegex));