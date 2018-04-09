const form = document.forms[0];
const length = document.getElementById('length');
const valid = document.getElementById('valid');
const total = document.getElementById('total');

const {
    messageFields,
    messageValid
} = plural;

document.getElementById('custom').addEventListener('input', validateDevidedBySeven);

function validateDevidedBySeven({target}) {
    if (target.value !== '') {
        if (isNaN(target.value)) {
            target.setCustomValidity(`${target.value} даже не число`);

            return;
        } else if (Number(target.value) % 7 !== 0) {
            target.setCustomValidity(`${target.value} на 7 не делится`);

            return;
        }
    }

    target.setCustomValidity('');
}

function updateStats() {
    const fields = Array.from(form.elements).filter(isField);
    const validFields = fields.filter(({validationMessage}) => !validationMessage);

    total.innerText = `В форме ${messageFields(fields.length)}`;
    valid.innerText = `${messageFields(validFields.length)} ${messageValid(validFields.length)}.`
}

form.addEventListener('input', updateStats);
form.addEventListener('change', updateStats);
form.addEventListener('reset', () => setTimeout(updateStats));
updateStats();