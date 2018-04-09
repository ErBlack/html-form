function isChanged(element) {
    switch (element.nodeName) {
        case 'FORM':
        case 'FIELDSET':
            return Array.from(element.elements).some(isChanged);
        case 'SELECT':
            return Array.from(element.options).some((option) => option.selected !== option.defaultSelected);
        case 'TEXTAREA':
            return element.value !== element.defaultValue;
        case 'INPUT':
            switch (element.type) {
                case 'reset':
                case 'submit':
                case 'button':
                case 'image':
                    return false;
                case 'checkbox':
                case 'radio':
                    return element.checked !== element.defaultChecked;
                default:
                    return element.value !== element.defaultValue;
            }
        default:
            return false;
    }
}

const form = document.forms[0];
const length = document.getElementById('length');
const changed = document.getElementById('changed');
const total = document.getElementById('total');

const FIELD_FORMS = ['поле', 'поля', 'полей'];
const FIELDSET_FORMS = ['филдсет', 'филдсета', 'филдсетов'];
const CHANGED_FORMS = ['изменено', 'изменены', 'изменено'];

function isField(element) {
    switch (element.nodeName) {
        case 'SELECT':
        case 'TEXTAREA':
            return true;
        case 'INPUT':
            switch (element.type) {
                case 'reset':
                case 'submit':
                    return false;
                default:
                    return true;
            }
        default:
            return false;
    }
}

function isFieldset(element) {
    return element.nodeName === 'FIELDSET';
}

function getText(number, text) {
    plural = (number % 10 == 1 && number % 100 != 11) ?
        0 :
        ((number % 10 >= 2 && number % 10 <= 4 && (number % 100 < 10 || number % 100 >= 20)) ? 1 : 2);

    return text[plural];
}

function messageFields(n) {
    return `${n} ${getText(n, FIELD_FORMS)}`;
}

function messageFieldsets(n) {
    return `${n} ${getText(n, FIELDSET_FORMS)}`;
}

function updateStats() {
    const elements = Array.from(form.elements);
    const fields = elements.filter(isField);
    const fieldsets = elements.filter(isFieldset);

    const changedFields = fields.filter((element) => {
        const changed = isChanged(element);

        if (changed) {
            element.title = 'Значение поля измененно';
            element.classList.add('changed');
        } else {
            element.title = 'У поля значение по умолчанию';
            element.classList.remove('changed')
        }

        return changed;
    });
    const changedFieldsets = fieldsets.filter((element) => {
        const changed = isChanged(element);
        const fields = Array.from(element.elements).filter(isField);
        const changedFields = fields.filter(isChanged);

        element.title = `${messageFields(fields.length)}, ${messageFields(changedFields.length)} ${getText(
            changedFields.length,
            CHANGED_FORMS
        )}`;

        if (changedFields.length) {
            element.classList.add('changed');
        } else {
            element.classList.remove('changed')
        }

        return changed;
    })

    total.innerText = `В форме ${messageFields(fields.length)} и ${messageFieldsets(fieldsets.length)}.`;
    changed.innerText = `${messageFields(changedFields.length)} и ${messageFieldsets(changedFieldsets.length)} изменены.`
}

form.addEventListener('input', updateStats);
form.addEventListener('change', updateStats);
form.addEventListener('reset', () => setTimeout(updateStats));
updateStats();
