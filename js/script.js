// ALL VARIABLE DECLARATIONS

// form element
const form = document.querySelector('form');

// basic info fieldset input elements
const nameInput = document.querySelector('#name');
const emailInput = document.querySelector('#email');
const otherJobRoleInput = document.querySelector('#other-job-role');

// basic info fieldset select element
const jobRoleSelect = document.querySelector('#title');

// t-shirt info fieldset select elements
const designSelect = document.querySelector('#design');
const colorSelect = document.querySelector('#color');

// activities fielset
const activitiesFieldset = document.querySelector('#activities');

// activities fielset nested elements
const activitiesCostParagraph = document.querySelector('#activities-cost');
let totalCost = 0;
const activitiesCheckboxes = document.querySelectorAll('input[type="checkbox"]');

// payment info fieldset payment options select element
const paymentOptionSelect = document.querySelector('#payment');

// payment info fieldset div elements
const creditCardDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');

// credit card div input elements
const cardNumberInput = document.querySelector('#cc-num');
const zipCodeInput = document.querySelector('#zip');
const cvvInput = document.querySelector('#cvv');


// VALIDATION RELATED FUNCTIONS

function validateName() {
    const isValidName = /^[a-z]+ ?[a-z]* ?[a-z]*$/i.test(nameInput.value);
    if (isValidName) validationPass(nameInput);
    else validationFail(nameInput);
    return isValidName;
}

function validateEmail() {
    const isValidEmail = /^[^@]+@[^@.]+\.[a-z]+$/i.test(emailInput.value);
    if (isValidEmail) validationPass(emailInput);
    else validationFail(emailInput);
    return isValidEmail;
}

function validateActivities() {
    const validActivities = totalCost > 0;
    if (validActivities) validationPass(activitiesFieldset.children[1]);
    else validationFail(activitiesFieldset.children[1]);
    return validActivities;
}

function validateCreditCardNum() {
    const isValidCreditCardNum = /^\d{13,16}$/.test(+cardNumberInput.value);
    if (isValidCreditCardNum) validationPass(cardNumberInput);
    else validationFail(cardNumberInput);
    return isValidCreditCardNum;
}

function validateCVV() {
    const isValidCVV = /^\d{3}$/.test(+cvvInput.value);
    if (isValidCVV) validationPass(cvvInput);
    else validationFail(cvvInput);
    return isValidCVV;
}

function validateZipCode() {
    const isValidZipCode = /^\d{5}$/.test(+zipCodeInput.value);
    if (isValidZipCode) validationPass(zipCodeInput);
    else validationFail(zipCodeInput);
    return isValidZipCode;
}

function validationPass(element) {
    element.parentElement.classList.add('valid');
    element.parentElement.classList.remove('not-valid');
    element.parentElement.lastElementChild.style.display = 'none';
}
  
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

// set focus onto the name input elemente when page first loads
nameInput.focus();

// hide otherJobRoleInput when page loads
otherJobRoleInput.hidden = true;

// event listener to hide/unhide otherJobRoleInput according to selected option's value
jobRoleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'other') otherJobRoleInput.hidden = false;
    else otherJobRoleInput.hidden = true;
});

// disable color select when page loads
colorSelect.disabled = true;

// enable colorSelect options to match designSelect option
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

// update activitiesCostParagraph according to checked checkboxes and disable/enable checkboxes if schedule conflicts exist
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

// hide paypalDiv and bitcoinDiv when page loads
paypalDiv.hidden = true;
bitcoinDiv.hidden = true;

// select credit-card as a default option when page loads
paymentOptionSelect.children[1].selected = true;

// update show/hide payment option divs according to selected option
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

// event listener to perform validations on submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateName() ? console.log('valid name'): console.log('invalid name');
    validateEmail() ? console.log('valid email'): console.log('invalid email');
    validateActivities() ? console.log('ok activitis'): console.log('select at least 1 activity');
    
    if (paymentOptionSelect.children[1].selected) {
        validateCreditCardNum() ? console.log('ok cardnum'): console.log('invalid cardnum');
        validateCVV() ? console.log('ok CVV'): console.log('invalid CVV');
        validateZipCode() ? console.log('ok zip'): console.log('invalid zip');
    }
});

// add focus and blur event listeners on all checkboxes
for (let checkbox of activitiesCheckboxes) {
    checkbox.addEventListener('focus', (e) => e.target.parentElement.classList.add('focus'));
    checkbox.addEventListener('blur', (e) => e.target.parentElement.classList.remove('focus'));
}

// real-time validation on required input fields of type text
nameInput.addEventListener('change', validateName);
emailInput.addEventListener('change', validateEmail);
cardNumberInput.addEventListener('change', validateCreditCardNum);
zipCodeInput.addEventListener('change', validateZipCode);
cvvInput.addEventListener('change', validateCVV);