/**
 * Возвращает true если переданный элемент — поле для ввода
 * @param {HTMLElement} element
 */
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