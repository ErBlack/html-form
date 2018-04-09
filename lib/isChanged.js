/**
 * Возвращает true если в элементе есть изменения
 * @param {HTMLElement} element 
 */
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