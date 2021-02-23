const nameInput = document.querySelector('#name');

// set focus onto the name input elemente when page first loads
nameInput.focus();

const jobRoleSelect = document.querySelector('#title');
const otherJobRoleInput = document.querySelector('#other-job-role');

// hide otherJobRoleInput when page loads
otherJobRoleInput.hidden = true;

// event listener to hide/unhide otherJobRoleInput according to selected option's value
jobRoleSelect.addEventListener('change', (e) => {
    if (e.target.value === 'other') otherJobRoleInput.hidden = false;
    else otherJobRoleInput.hidden = true;
});

const designSelect = document.querySelector('#design');
const colorSelect = document.querySelector('#color');

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

const activitiesFieldset = document.querySelector('#activities');
const activitiesCostParagraph = document.querySelector('#activities-cost');
let totalCost = 0;

// update activitiesCostParagraph according to checked checkboxes
activitiesFieldset.addEventListener('change', (e) => {
    const activityCost = +e.target.getAttribute('data-cost');
    if (e.target.checked) totalCost += activityCost;
    else totalCost -= activityCost;
    activitiesCostParagraph.innerHTML = `Total: $${totalCost}`;
});

const paymentOptionSelect = document.querySelector('#payment');
const creditCardDiv = document.querySelector('#credit-card');
const paypalDiv = document.querySelector('#paypal');
const bitcoinDiv = document.querySelector('#bitcoin');

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

const emailInput = document.querySelector('#email');

const cardNumberInput = document.querySelector('#cc-num');
const zipCodeInput = document.querySelector('#zip');
const cvvInput = document.querySelector('#cvv');
const form = document.querySelector('form');

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

function validateCCV() {
    const isValidCCV = /^\d{3}$/.test(+cvvInput.value);
    if (isValidCCV) validationPass(cvvInput);
    else validationFail(cvvInput);
    return isValidCCV;
}

function validateZipCode() {
    const isValidZipCode = /^\d{5}$/.test(+zipCodeInput.value);
    if (isValidZipCode) validationPass(zipCodeInput);
    else validationFail(zipCodeInput);
    return isValidZipCode;
}

// event listener to perform validations on submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    validateName() ? console.log('valid name'): console.log('invalid name');
    validateEmail() ? console.log('valid email'): console.log('invalid email');
    validateActivities() ? console.log('ok activitis'): console.log('select at least 1 activity');
    
    if (paymentOptionSelect.children[1].selected) {
        console.log('cc selected');
        validateCreditCardNum() ? console.log('ok cardnum'): console.log('invalid cardnum');
        validateCCV() ? console.log('ok ccv'): console.log('invalid ccv');
        validateZipCode() ? console.log('ok zip'): console.log('invalid zip');
    }
});

const activitiesCheckboxes = document.querySelectorAll('input[type="checkbox"]');

for (let checkbox of activitiesCheckboxes) {
    checkbox.addEventListener('focus', (e) => e.target.parentElement.classList.add('focus'));
    checkbox.addEventListener('blur', (e) => e.target.parentElement.classList.remove('focus'));
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
  }



