const form = document.forms[0];
const changed = document.getElementById('changed');
const total = document.getElementById('total');

const {
    messageFields,
    messageFieldsets,
    messageChanged
} = plural;

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

        element.title = `${messageFields(fields.length)}, ${messageFields(changedFields.length)} ${
            messageChanged(changedFields.length)}`;

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

window.addEventListener('beforeunload', (e) => {
    if (isChanged(form)) {
        e.returnValue = 'В форме есть несохранённые изменения';

        return e.returnValue;
    }
});
